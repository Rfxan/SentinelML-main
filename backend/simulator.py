import random
import numpy as np

class Simulator:
    def __init__(self):
        self.continuous_indices = [0, 4, 5, 9, 10, 11, 12, 13, 14, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]

    def generate_normal(self):
        features = [float(np.random.random() * 0.1) for _ in range(41)]
        features[4] = random.uniform(100, 500) # src_bytes
        features[22] = random.uniform(1, 10) # count
        return features

    def generate_evasion(self):
        features = self.generate_normal()
        # High activity + anomalous bytes
        features[22] = 250.0 
        features[4] = 9999.0
        # Add perturbations
        for idx in self.continuous_indices:
            if random.random() > 0.5:
                features[idx] += random.choice([-1, 1]) * random.uniform(0.1, 0.3)
        return features

    def generate_poison(self):
        # Malicious features but target normal label
        features = [0.0] * 41
        features[22] = 500.0 # High count
        features[24] = 1.0 # High serror_rate
        return features, 0 # features, flipped_label

    def generate_blitz(self):
        strategies = ["normal", "evasion", "poison"]
        choice = random.choice(strategies)
        if choice == "normal":
            return self.generate_normal(), "normal"
        elif choice == "evasion":
            return self.generate_evasion(), "evasion"
        else:
            return self.generate_poison(), "poison"

    def generate_extraction_probe(self, probe_type="boundary"):
        if probe_type == "boundary":
            # Systematic boundary probing: vary features near decision boundary
            features = self.generate_normal()
            for idx in self.continuous_indices[:8]:
                features[idx] = random.uniform(-0.5, 0.5)
            features[22] = random.uniform(100, 300)  # count near typical boundary
            features[4] = random.uniform(500, 2000)  # src_bytes varied
        else:
            # Coverage attack: systematic feature-space sweep
            features = [float(np.random.uniform(-1, 1)) for _ in range(41)]
            features[4] = random.uniform(0, 10000)
            features[22] = random.uniform(0, 500)
        return features
