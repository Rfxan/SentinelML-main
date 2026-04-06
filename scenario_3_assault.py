import time
import requests
import argparse
import random
import threading

def worker(target, mode, limit_event):
    while not limit_event.is_set():
        try:
            # Send small batches to create a nice visual stream
            requests.post(f"{target}/simulate", json={"mode": mode, "count": random.randint(1, 2)})
        except requests.exceptions.RequestException:
            pass
        # Rate limit the client to avoid overwhelming the backend rate-limiters instantly
        time.sleep(random.uniform(0.2, 0.5))

def main():
    parser = argparse.ArgumentParser(description="Simulate an active, brutal coordinated assault")
    parser.add_argument("--target", default="http://localhost:8000", help="Target URL")
    parser.add_argument("--duration", type=int, default=0, help="Duration of attack in seconds (0 = infinite)")
    args = parser.parse_args()

    modes = ["poison", "blitz", "evasion"]
    
    print("="*50)
    print("🔥 SCENARIO 3: FULL BRUTAL ASSAULT")
    print(f"Target: {args.target}")
    if args.duration > 0:
        print(f"Duration limit: {args.duration} seconds")
    print("="*50)
    print("[*] Simulating a massive coordinated botnet attack!")
    print("[*] Firing massive Poisoning, DDoS (Blitz), and Evasion concurrently...")
    print("[*] Press Ctrl+C to stop.")

    limit_event = threading.Event()

    # Reduced from 15 to 9 concurrent threads to display prominent but not overwhelming stream
    for _ in range(3):
        for mode in modes:
            t = threading.Thread(target=worker, args=(args.target, mode, limit_event))
            t.daemon = True
            t.start()
    
    start_time = time.time()
    try:
        while True:
            # occasionally trigger retrain to process poison buffers
            time.sleep(2)
            if args.duration > 0 and (time.time() - start_time) > args.duration:
                print(f"[+] Reached duration limit of {args.duration}s. Stopping.")
                limit_event.set()
                break
            try:
                requests.post(f"{args.target}/retrain")
            except:
                pass
    except KeyboardInterrupt:
        print("\n[✔] Assault stopped.")
        limit_event.set()

if __name__ == "__main__":
    main()
