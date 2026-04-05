import requests
import time
import random

BASE_URL = "http://localhost:8000"

def run_tests():
    print("="*50)
    print("SENTINELML HACKATHON LIVE DEMO GENERATOR")
    print("="*50)

    print("\n[✔] Connecting & Resetting State...")
    requests.get(f"{BASE_URL}/health")
    requests.post(f"{BASE_URL}/reset")

    print("[✔] Pumping Normal Traffic (5 items)...")
    for _ in range(5):
        requests.post(f"{BASE_URL}/simulate", json={"mode": "normal", "count": 1})
        time.sleep(0.1)

    print("[!] Generating Straight Attacks (3 items)...")
    for _ in range(3):
        requests.post(f"{BASE_URL}/predict", json={"features": [1.0]*41, "ip": f"100.0.0.{random.randint(1,250)}"})
        time.sleep(0.1)

    print("[!] Triggering AI Evasion Detectors (3 items)...")
    for _ in range(3):
        requests.post(f"{BASE_URL}/simulate", json={"mode": "evasion", "count": 1})
        time.sleep(0.1)

    print("[!] Feeding Poison Ingestion (5 items)...")
    for _ in range(5):
        # Using simulator poison to push it to the train endpoint securely
        requests.post(f"{BASE_URL}/simulate", json={"mode": "poison", "count": 1})
        time.sleep(0.1)

    print("[!] Executing Blitz Attempt (IP Block threshold test)...")
    requests.post(f"{BASE_URL}/simulate", json={"mode": "blitz", "count": 4})
    
    # Just to add visual chaos for the dashboard lines
    print("[✔] Background noise simulation...")
    requests.post(f"{BASE_URL}/simulate", json={"mode": "normal", "count": 10})

    print("[✔] Triggering Model Retrain on buffers...")
    requests.post(f"{BASE_URL}/retrain")

    print("\n" + "="*50)
    print("DEMO PAYLOADS DELIVERED! CHECK YOUR DASHBOARDS!")
    print("="*50)

if __name__ == "__main__":
    run_tests()
