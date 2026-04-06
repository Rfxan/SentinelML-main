import time
import requests
import argparse
import random
import threading

def worker(target, mode):
    while True:
        try:
            requests.post(f"{target}/simulate", json={"mode": mode, "count": random.randint(1, 3)})
        except requests.exceptions.RequestException:
            pass
        time.sleep(random.uniform(0.01, 0.1))

def main():
    parser = argparse.ArgumentParser(description="Simulate an active, brutal coordinated assault")
    parser.add_argument("--target", default="http://172.21.102.84:8000", help="Target URL")
    args = parser.parse_args()

    modes = ["poison", "blitz", "evasion"]
    
    print("="*50)
    print("🔥 SCENARIO 3: FULL BRUTAL ASSAULT")
    print(f"Target: {args.target}")
    print("="*50)
    print("[*] Simulating a massive coordinated botnet attack!")
    print("[*] Firing massive Poisoning, DDoS (Blitz), and Evasion concurrently...")
    print("[*] Press Ctrl+C to stop.")

    # 15 concurrent attacking threads (5 for each mode)
    for _ in range(5):
        for mode in modes:
            t = threading.Thread(target=worker, args=(args.target, mode))
            t.daemon = True
            t.start()
    
    try:
        while True:
            # Occasionally trigger retrain to process poison buffers
            time.sleep(2)
            try:
                requests.post(f"{args.target}/retrain")
            except:
                pass
    except KeyboardInterrupt:
        print("\n[✔] Assault stopped.")

if __name__ == "__main__":
    main()
