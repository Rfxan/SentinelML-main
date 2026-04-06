import time
from threading import Lock

class Blocker:
    def __init__(self, strike_threshold=3):
        self.strike_threshold = strike_threshold
        self.strikes = {} # {ip: strike_count}
        self.blocked_ips = {} # {ip: {timestamp, reason, strike_count}}
        self.lock = Lock()

    def record_strike(self, ip, is_adversarial=False, reason="Adversarial behavior"):
        with self.lock:
            if ip in self.blocked_ips:
                return True
            
            if is_adversarial:
                self.strikes[ip] = self.strikes.get(ip, 0) + 1
                
                if self.strikes[ip] >= self.strike_threshold:
                    self.blocked_ips[ip] = {
                        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                        "reason": reason,
                        "strike_count": self.strikes[ip]
                    }
                    return True
            return False

    def is_blocked(self, ip):
        with self.lock:
            return ip in self.blocked_ips

    def get_blocked_ips(self):
        with self.lock:
            return self.blocked_ips.copy()

    def unblock_ip(self, ip):
        with self.lock:
            if ip in self.blocked_ips:
                del self.blocked_ips[ip]
                self.strikes[ip] = 0
                return True
            return False

    def unblock_all(self):
        with self.lock:
            self.blocked_ips.clear()
            self.strikes.clear()
            return True

    def block_ip_manually(self, ip, reason="Manual block"):
        with self.lock:
            self.blocked_ips[ip] = {
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                "reason": reason,
                "strike_count": self.strikes.get(ip, 0)
            }
