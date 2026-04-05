import os
import pickle
import numpy as np
from sklearn.ensemble import RandomForestClassifier

class MLModel:
    def __init__(self, model_path="model.pkl"):
        self.model_path = model_path
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        
        if os.path.exists(self.model_path):
            self.load()
        else:
            self._generate_synthetic_and_train()
            
    def _generate_synthetic_and_train(self):
        # Generate 1000 synthetic samples
        # 41 features, binary labels
        X = np.random.rand(1000, 41)
        y = np.random.randint(0, 2, 1000)
        self.train(X, y)
        
    def train(self, X, y):
        self.model.fit(X, y)
        self.save()
        
    def predict(self, features):
        X = np.array(features).reshape(1, -1)
        proba = self.model.predict_proba(X)[0]
        confidence = float(max(proba))
        label_idx = int(np.argmax(proba))
        label = "attack" if label_idx == 1 else "normal"
        return label, confidence
        
    def retrain_with_adversarial(self, adversarial_samples):
        if not adversarial_samples:
            return
            
        X_new = np.array([s['features'] for s in adversarial_samples])
        y_new = np.array([s['label'] for s in adversarial_samples])
        
        X_base = np.random.rand(1000, 41)
        y_base = np.random.randint(0, 2, 1000)
        
        X_combined = np.vstack((X_base, X_new))
        y_combined = np.concatenate((y_base, y_new))
        
        self.train(X_combined, y_combined)
        
    def save(self):
        with open(self.model_path, 'wb') as f:
            pickle.dump(self.model, f)
            
    def load(self):
        with open(self.model_path, 'rb') as f:
            self.model = pickle.load(f)
