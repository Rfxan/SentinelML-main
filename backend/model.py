import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
import urllib.request
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
MODEL_PATH = os.path.join(DATA_DIR, "model.pkl")
SCALER_PATH = os.path.join(DATA_DIR, "scaler.pkl")
STATS_PATH = os.path.join(DATA_DIR, "train_stats.pkl")
DATASET_URL = "https://raw.githubusercontent.com/defcom17/NSL_KDD/master/KDDTrain%2B.txt"
DATASET_FILE = os.path.join(DATA_DIR, "KDDTrain+.txt")

COLUMNS = [
    "duration", "protocol_type", "service", "flag", "src_bytes", "dst_bytes", "land",
    "wrong_fragment", "urgent", "hot", "num_failed_logins", "logged_in",
    "num_compromised", "root_shell", "su_attempted", "num_root", "num_file_creations",
    "num_shells", "num_access_files", "num_outbound_cmds", "is_host_login",
    "is_guest_login", "count", "srv_count", "serror_rate", "srv_serror_rate",
    "rerror_rate", "srv_rerror_rate", "same_srv_rate", "diff_srv_rate",
    "srv_diff_host_rate", "dst_host_count", "dst_host_srv_count", "dst_host_same_srv_rate",
    "dst_host_diff_srv_rate", "dst_host_same_src_port_rate", "dst_host_srv_diff_host_rate",
    "dst_host_serror_rate", "dst_host_srv_serror_rate", "dst_host_rerror_rate",
    "dst_host_srv_rerror_rate", "label", "difficulty_level"
]

class MLModel:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.train_stats = None
        
        if not os.path.exists(DATA_DIR):
            os.makedirs(DATA_DIR)

    def download_dataset(self):
        if os.path.exists(DATASET_FILE):
            return
        try:
            logger.info("Downloading NSL-KDD dataset...")
            urllib.request.urlretrieve(DATASET_URL, DATASET_FILE)
        except Exception:
            self._generate_synthetic_and_train()

    def _generate_synthetic_and_train(self):
        # Fallback if download fails
        data = [[0]*43 for _ in range(100)]
        df = pd.DataFrame(data, columns=COLUMNS)
        df.to_csv(DATASET_FILE, index=False, header=False)

    def train(self, new_samples=None):
        if not os.path.exists(DATASET_FILE):
            self.download_dataset()
        
        df = pd.read_csv(DATASET_FILE, names=COLUMNS, header=None)
        df['label'] = df['label'].apply(lambda x: 0 if x == 'normal' else 1)
        
        # Numeric encoding for categoricals
        for col in ['protocol_type', 'service', 'flag']:
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col])

        X = df.drop(['label', 'difficulty_level'], axis=1)
        y = df['label']

        if new_samples:
            try:
                new_X = pd.DataFrame([s['features'] for s in new_samples], columns=X.columns)
                new_y = pd.Series([s['label'] for s in new_samples])
                X = pd.concat([X, new_X], ignore_index=True)
                y = pd.concat([y, new_y], ignore_index=True)
            except Exception as e:
                logger.error(f"Failed to append new samples: {e}")

        self.scaler = StandardScaler()
        X_scaled = self.scaler.fit_transform(X)
        
        self.model = RandomForestClassifier(n_estimators=100)
        self.model.fit(X_scaled, y)
        
        self.train_stats = {
            'mean': X.mean(axis=0).values.tolist(),
            'std': X.std(axis=0).values.tolist()
        }
        
        joblib.dump(self.model, MODEL_PATH)
        joblib.dump(self.scaler, SCALER_PATH)
        joblib.dump(self.train_stats, STATS_PATH)

    def load(self):
        if os.path.exists(MODEL_PATH):
            self.model = joblib.load(MODEL_PATH)
            self.scaler = joblib.load(SCALER_PATH)
            self.train_stats = joblib.load(STATS_PATH)
            return True
        return False

    def predict(self, features):
        if not self.model: return 0, 0.0
        X = np.array(features).reshape(1, -1)
        X_scaled = self.scaler.transform(X)
        label = int(self.model.predict(X_scaled)[0])
        confidence = float(np.max(self.model.predict_proba(X_scaled)[0]))
        return label, confidence
