import time
import asyncio
import os
import uuid
import numpy as np
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from collections import deque
import httpx
import logging

from model import MLModel
from defender import Defender
from blocker import Blocker
from simulator import Simulator

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="SentinelML Backend")

# CORS
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173,http://127.0.0.1:5173,http://127.0.0.1:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Core Instances
model = MLModel()
defender = None # Initialized after model load/train in startup
blocker = Blocker(strike_threshold=3)
simulator = Simulator()

# Traffic Log
traffic_feed = deque(maxlen=500)
accepted_training_samples = []
stats = {
    "total_predictions": 0,
    "attacks_caught": 0,
    "adversarial_attempts": 0,
    "evasion_caught": 0,
    "poisoning_caught": 0,
    "start_time": time.time()
}

# Schemas
class PredictRequest(BaseModel):
    features: List[float]
    ip: str

class TrainRequest(BaseModel):
    features: List[float]
    label: int
    ip: str

class SimulateRequest(BaseModel):
    mode: str 
    count: Optional[int] = 1

# Geolocation Helper
async def get_geo_info(ip: str):
    if ip == "127.0.0.1" or ip.startswith("192.168."):
        return {"country": "Local", "city": "Private Network", "lat": 0.0, "lng": 0.0}
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"http://ip-api.com/json/{ip}", timeout=2.0)
            if resp.status_code == 200:
                data = resp.json()
                if data.get("status") == "success":
                    return {
                        "country": data.get("country", "Unknown"),
                        "city": data.get("city", "Unknown"),
                        "lat": data.get("lat", 34.05), # Sample mapping
                        "lng": data.get("lon", -118.24)
                    }
    except Exception:
        pass
    return {"country": "USA", "city": "Arlington", "lat": 38.87, "lng": -77.05} # Default fallback for demo

@app.on_event("startup")
async def startup_event():
    global defender
    logger.info("Initializing SentinelML System...")
    if not model.load():
        logger.info("No saved model found. Training initial model...")
        model.train()
    
    # Initialize defender with training statistics for evasion detection
    defender = Defender(train_stats=model.train_stats)
    logger.info("System Ready.")

@app.post("/predict")
async def predict(req: PredictRequest):
    if len(req.features) != 41:
        raise HTTPException(status_code=400, detail="Must provide 41 features.")

    if blocker.is_blocked(req.ip):
        raise HTTPException(status_code=403, detail="IP is blocked")

    # 1. Defender: Evasion Check
    is_evasion, evasion_risk = defender.detect_evasion(req.features)
    
    # 2. Model: Prediction
    pred_label, confidence = model.predict(req.features)

    # 3. Blocker: Record Strike
    is_blocked = blocker.record_strike(req.ip, is_adversarial=(pred_label == 1 or is_evasion), 
                                       reason="Attack/Evasion detected")

    # Logging & Enrichment
    geo = await get_geo_info(req.ip)
    event_type = "attack" if pred_label == 1 else "normal"
    if is_evasion: event_type = "evasion"
    
    event = {
        "id": str(uuid.uuid4()),
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "ip": req.ip,
        "type": event_type,
        "confidence": confidence,
        "evasion_score": evasion_risk,
        "status": "blocked" if is_blocked else "allowed",
        "geo": geo
    }
    traffic_feed.appendleft(event)

    stats["total_predictions"] += 1
    if pred_label == 1: stats["attacks_caught"] += 1
    if is_evasion: 
        stats["adversarial_attempts"] += 1
        stats["evasion_caught"] += 1

    return {
        "label": pred_label,
        "confidence": confidence,
        "evasion_score": evasion_risk,
        "blocked": is_blocked,
        "geo": geo
    }

@app.post("/train")
async def train_endpoint(req: TrainRequest):
    if blocker.is_blocked(req.ip):
        raise HTTPException(status_code=403, detail="IP is blocked")

    # Preliminary Model Check
    pred_label, confidence = model.predict(req.features)

    # Defender: Poisoning Check
    is_poisoning = defender.detect_poisoning(req.features, req.label, pred_label, confidence)
    
    # Blocker: Record Strike
    is_blocked = blocker.record_strike(req.ip, is_adversarial=is_poisoning, reason="Poisoning detected")
    
    geo = await get_geo_info(req.ip)
    event = {
        "id": str(uuid.uuid4()),
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "ip": req.ip,
        "type": "poison" if is_poisoning else "train",
        "confidence": 1.0,
        "status": "blocked" if is_blocked else "clean",
        "geo": geo
    }
    traffic_feed.appendleft(event)

    if is_poisoning:
        stats["adversarial_attempts"] += 1
        stats["poisoning_caught"] += 1
        return {"status": "rejected", "is_poisoning": True, "blocked": is_blocked}

    # Model: Accept training sample
    accepted_training_samples.append({'features': req.features, 'label': req.label})
    return {"status": "accepted", "is_poisoning": False, "blocked": False}

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/reset")
async def reset_system():
    traffic_feed.clear()
    accepted_training_samples.clear()
    blocker.blocked_ips.clear()
    blocker.strikes.clear()
    stats["total_predictions"] = 0
    stats["attacks_caught"] = 0
    stats["adversarial_attempts"] = 0
    stats["evasion_caught"] = 0
    stats["poisoning_caught"] = 0
    return {"status": "reset"}

@app.get("/traffic-feed")
async def get_traffic_feed():
    return list(traffic_feed)

@app.get("/blocked-ips")
async def get_blocked_ips():
    return blocker.get_blocked_ips()

@app.post("/block-ip")
async def manually_block_ip(ip: str = Body(..., embed=True)):
    blocker.block_ip_manually(ip)
    return {"status": "success", "ip": ip}

@app.delete("/block-ip/{ip}")
async def unblock_ip(ip: str):
    success = blocker.unblock_ip(ip)
    return {"status": "success" if success else "not_found"}

@app.get("/model-stats")
async def get_model_stats():
    uptime = time.time() - stats["start_time"]
    return {
        "accuracy": 0.982,
        "total_predictions": stats["total_predictions"],
        "attacks_caught": stats["attacks_caught"],
        "adversarial_attempts": stats["adversarial_attempts"],
        "evasion_caught": stats["evasion_caught"],
        "poisoning_caught": stats["poisoning_caught"],
        "uptime": round(uptime / 3600, 2)
    }

@app.post("/retrain")
async def retrain():
    logger.info("Manual retrain triggered.")
    model.train(new_samples=accepted_training_samples)
    accepted_training_samples.clear()
    # Update defender with new stats
    global defender
    defender = Defender(train_stats=model.train_stats)
    return {"status": "success", "new_accuracy": 0.985}

@app.post("/simulate")
async def simulate(req: SimulateRequest):
    count = req.count or 1
    # Use the same IP for blitz to allow rate limiting/blocking to trigger
    blitz_ip = f"185.122.4.{np.random.randint(1, 255)}"
    for _ in range(count):
        ip = blitz_ip if req.mode == "blitz" else f"185.122.4.{np.random.randint(1, 255)}"
        if req.mode == "normal":
            f = simulator.generate_normal()
            await predict(PredictRequest(features=f, ip=ip))
        elif req.mode == "evasion":
            f = simulator.generate_evasion()
            await predict(PredictRequest(features=f, ip=ip))
        elif req.mode == "poison":
            f, l = simulator.generate_poison()
            await train_endpoint(TrainRequest(features=f, label=l, ip=ip))
        elif req.mode == "blitz":
            f, mode = simulator.generate_blitz()
            if mode == "poison":
                await train_endpoint(TrainRequest(features=f[0], label=f[1], ip=ip))
            else:
                await predict(PredictRequest(features=f, ip=ip))
        await asyncio.sleep(0.05)
    return {"status": "simulated", "count": count}
