import time

class Blocker:
    def __init__(self):
        # dict mapping ip to: {ip, blocked_at, reason, strike_count}
        self.db = {}

    def record_strike(self, ip, reason):
        if ip not in self.db:
            self.db[ip] = {"ip": ip, "blocked_at": None, "reason": reason, "strike_count": 1}
        else:
            self.db[ip]["strike_count"] += 1
            if self.db[ip]["strike_count"] >= 3 and not self.is_blocked(ip):
                self.block(ip, reason)

    def is_blocked(self, ip):
        record = self.db.get(ip)
        return bool(record and record.get("blocked_at") is not None)

    def block(self, ip, reason):
        if ip not in self.db:
            self.db[ip] = {"ip": ip, "blocked_at": None, "reason": "", "strike_count": 0}
        self.db[ip]["blocked_at"] = time.time()
        self.db[ip]["reason"] = reason

    def unblock(self, ip):
        if ip in self.db:
            self.db[ip]["blocked_at"] = None
            self.db[ip]["strike_count"] = 0

    def get_all(self):
        return {ip: data for ip, data in self.db.items() if data.get("blocked_at") is not None}
