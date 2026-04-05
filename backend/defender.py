import numpy as np

class Defender:
    def __init__(self, threshold=3.5):
        self.threshold = threshold
        # Baseline mean and std for 41 features (synthetic 0-1 uniform distributed: mean ~0.5, std ~0.288)
        self.baseline_mean = np.full(41, 0.5)
        self.baseline_std = np.full(41, 0.288)

    def detect_evasion(self, features):
        features = np.array(features)
        z_scores = np.abs((features - self.baseline_mean) / self.baseline_std)
        max_z = np.max(z_scores)
        is_evasion = float(max_z) > self.threshold
        
        score = self.compute_evasion_score(features)
        return is_evasion, score

    def detect_poisoning(self, features, label, model_prediction, confidence):
        is_poisoning = bool(confidence > 0.9 and label != model_prediction)
        reason = "High confidence mismatch" if is_poisoning else ""
        return is_poisoning, reason

    def compute_evasion_score(self, features):
        features = np.array(features)
        z_scores = np.abs((features - self.baseline_mean) / self.baseline_std)
        avg_z = np.mean(z_scores)
        score = min(avg_z * 33.3, 100.0)
        return float(score)
