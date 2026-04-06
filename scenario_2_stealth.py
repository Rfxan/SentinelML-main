import time
import requests
import argparse
import random

def main():
    parser = argparse.ArgumentParser(description="Simulate an Advanced Persistent Threat (APT)")
    parser.add_argument("--target", default="http://172.21.102.84:8000", help="Target URL")
    args = parser.parse_args()

    print("="*50)
    print("🥷 SCENARIO 2: STEALTH EVASION (APT)")
    print(f"Target: {args.target}")
    print("="*50)
    print("[*] Simulating an attacker slowly probing the network...")
    print("[*] Highly randomized evasion packets will occasionally drop.")
    print("[*] Press Ctrl+C to stop.\n")
    
    try:
        while True:
            # 90% normal traffic, 10% evasion packet injection
            if random.random() < 0.15:
                print("[!] 🚨 Injecting Stealth Evasion Packet into the stream!")
                requests.post(f"{args.target}/simulate", json={"mode": "evasion", "count": 1})
            else:
                # Normal spoofed traffic
                requests.post(f"{args.target}/simulate", json={"mode": "normal", "count": 1})
                
            time.sleep(random.uniform(0.1, 0.8))
    except KeyboardInterrupt:
        print("\n[✔] Stealth simulation stopped.")

if __name__ == "__main__":
    main()
