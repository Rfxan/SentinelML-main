import time
import requests
import argparse
import random
import threading

def worker(target):
    while True:
        try:
            # Randomize count to create dynamic log spikes
            count = random.randint(1, 5)
            requests.post(f"{target}/simulate", json={"mode": "normal", "count": count})
        except requests.exceptions.RequestException:
            pass
        # Super fast interval for maximum logs
        time.sleep(random.uniform(0.05, 0.2))

def main():
    parser = argparse.ArgumentParser(description="Generate massive amounts of normal background traffic")
    parser.add_argument("--target", default="http://172.21.102.84:8000", help="Target URL")
    parser.add_argument("--threads", type=int, default=10, help="Number of concurrent users")
    args = parser.parse_args()

    print("="*50)
    print("🌍 SCENARIO 1: HEAVY BACKGROUND NOISE")
    print(f"Target: {args.target} | Threads: {args.threads}")
    print("="*50)
    print("[*] Simulating hundreds of normal employees browsing the network...")
    print("[*] Press Ctrl+C to stop.")

    for _ in range(args.threads):
        t = threading.Thread(target=worker, args=(args.target,))
        t.daemon = True
        t.start()
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n[✔] Network traffic simulation stopped.")

if __name__ == "__main__":
    main()
