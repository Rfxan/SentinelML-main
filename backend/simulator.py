import random

class Simulator:
    def generate_normal(self):
        return [random.uniform(0.1, 0.4) for _ in range(41)]
        
    def generate_evasion(self):
        features = [random.uniform(0.4, 0.6) for _ in range(41)]
        features[10] = 2.0  # Spike one feature to trigger evasion above threshold 3.5 z-score
        return features
        
    def generate_poison(self):
        features = self.generate_normal()
        wrong_label = 1
        return features, wrong_label
        
    def generate_blitz(self):
        strategies = ["normal", "evasion", "poison"]
        choice = random.choice(strategies)
        if choice == "normal":
            return self.generate_normal(), "normal"
        elif choice == "evasion":
            return self.generate_evasion(), "evasion"
        else:
            return self.generate_poison(), "poison"
