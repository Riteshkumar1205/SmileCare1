import os
import numpy as np
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.models import load_model
from PIL import Image


class TeethDiseaseModel:
    def __init__(self, model_path="./models/teeth_disease_model.h5"):
        self.model_path = model_path
        self.model = None
        self.metrics = {}

        if os.path.exists(model_path):
            try:
                self.model = load_model(model_path, compile=False)
            except Exception:
                self.model = None

        # default labels - adapt if your trained model uses different labels
        self.class_names = ["Caries", "Calculus", "Gingivitis", "Periodontitis", "Healthy"]

    def load_images_from_directory(self, directory):
        if not os.path.exists(directory):
            return None, None

        images, labels = [], []
        class_names = sorted([d for d in os.listdir(directory) if os.path.isdir(os.path.join(directory,d))])

        for idx, cls in enumerate(class_names):
            cls_dir = os.path.join(directory, cls)
            for img in os.listdir(cls_dir):
                try:
                    path = os.path.join(cls_dir, img)
                    im = Image.open(path).convert("RGB").resize((224, 224))
                    images.append(np.array(im) / 255.0)
                    labels.append(idx)
                except Exception:
                    continue

        if len(images) == 0:
            return None, None

        return np.array(images, dtype=np.float32), np.array(labels, dtype=np.int32)

    def build_model(self, num_classes=5):
        base = keras.applications.ResNet50(
            weights="imagenet", include_top=False, input_shape=(224, 224, 3)
        )
        x = layers.GlobalAveragePooling2D()(base.output)
        x = layers.Dense(512, activation="relu")(x)
        x = layers.Dropout(0.3)(x)
        output = layers.Dense(num_classes, activation="softmax")(x)
        self.model = keras.Model(inputs=base.input, outputs=output)
        self.model.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])

    def train(self, images, labels, epochs=5):
        self.metrics = self.model.fit(images, labels, epochs=epochs, batch_size=16, validation_split=0.2).history

    def save_model(self):
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        self.model.save(self.model_path)

    def predict(self, img_array):
        if self.model is None:
            raise RuntimeError("Model not loaded")
        img = np.expand_dims(img_array.astype(np.float32), axis=0)
        preds = self.model.predict(img)[0]
        top_idx = int(np.argmax(preds))
        return {
            "predicted_class": self.class_names[top_idx] if top_idx < len(self.class_names) else f"class_{top_idx}",
            "confidence": float(preds[top_idx] * 100.0),
            "all_confidences": {self.class_names[i] if i < len(self.class_names) else f"class_{i}": float(preds[i] * 100.0) for i in range(len(preds))}
        }
