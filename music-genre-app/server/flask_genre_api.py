from dotenv import load_dotenv
import os
import tempfile

# Load environment variables from .env
load_dotenv()
MODEL_PATH = os.getenv("MODEL_PATH")
PORT = int(os.getenv("PORT", 5001))  # default to 5001 if not set

from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torch.nn as nn
import torch.nn.functional as F
import torchaudio
from torchvision import models

app = Flask(__name__)
CORS(app)

# ------------------ MODEL ------------------
class GenreModel(nn.Module):
    def __init__(self, num_classes=10):
        super().__init__()
        self.resnet = models.resnet18(weights=None)
        self.resnet.fc = nn.Linear(self.resnet.fc.in_features, num_classes)

    def forward(self, x):
        return self.resnet(x)

# ------------------ LOAD MODEL ------------------
MODEL_PATH = r"F:\music-projects\music-genre-app\server\res_ast_fusion_model.pth"
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"❌ Model file not found: {MODEL_PATH}")

model = GenreModel(num_classes=10)
checkpoint = torch.load(MODEL_PATH, map_location="cpu")
model.load_state_dict(checkpoint.get('model_state_dict', checkpoint), strict=False)
model.eval()
print("✅ Model loaded successfully!")

GENRES = ['blues', 'classical', 'country', 'disco', 'hiphop',
          'jazz', 'metal', 'pop', 'reggae', 'rock']

# ------------------ AUDIO PROCESSING ------------------
import torch
import torch.nn as nn
import torch.nn.functional as F
import torchaudio
from torchvision.models import resnet18, ResNet18_Weights

weights = ResNet18_Weights.DEFAULT
resnet_model = resnet18(weights=weights)
resnet_model.fc = nn.Identity()  # output embeddings instead of classification
resnet_model.eval()  # set to eval mode

# --- Simple AST-like model (placeholder) ---
class SimpleAST(nn.Module):
    def __init__(self, input_channels=1, embedding_dim=512):
        super().__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(input_channels, 32, kernel_size=3, stride=1, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.AdaptiveAvgPool2d((1, 1))
        )
        self.fc = nn.Linear(32, embedding_dim)
    
    def forward(self, x):
        x = self.conv(x)
        x = x.view(x.size(0), -1)
        x = self.fc(x)
        return x

ast_model = SimpleAST()
ast_model.eval()

# --- Final classifier (fusion of embeddings) ---
final_fc = nn.Linear(1024, len(GENRES))
final_fc.train()  # make trainable

# --- Audio loading ---
def load_audio(file_path):
    waveform, sr = torchaudio.load(file_path)
    if sr != 16000:
        waveform = torchaudio.transforms.Resample(sr, 16000)(waveform)
    waveform = waveform.mean(dim=0, keepdim=True)  # stereo → mono
    return waveform

# --- ResNet preprocessing ---
def audio_to_resnet_spec(waveform):
    mel_spec = torchaudio.transforms.MelSpectrogram(
        sample_rate=16000, n_fft=1024, hop_length=512, n_mels=128
    )(waveform)
    mel_spec_db = torchaudio.transforms.AmplitudeToDB()(mel_spec)
    mel_spec_db = F.interpolate(mel_spec_db.unsqueeze(0), size=(224, 224))
    mel_spec_db = mel_spec_db.repeat(1, 3, 1, 1)
    return mel_spec_db

# --- AST preprocessing ---
def ast_preprocess(waveform, sample_rate=16000, n_mels=64, target_frames=512):
    mel_spec = torchaudio.transforms.MelSpectrogram(
        sample_rate=sample_rate, n_fft=1024, hop_length=320, n_mels=n_mels
    )(waveform)
    mel_spec_db = torchaudio.transforms.AmplitudeToDB()(mel_spec)
    mel_spec_db = (mel_spec_db - mel_spec_db.min()) / (mel_spec_db.max() - mel_spec_db.min() + 1e-6)
    n_frames = mel_spec_db.shape[-1]
    if n_frames < target_frames:
        mel_spec_db = F.pad(mel_spec_db, (0, target_frames - n_frames))
    else:
        mel_spec_db = mel_spec_db[:, :, :target_frames]
    return mel_spec_db.unsqueeze(0)  # shape: (1,1,n_mels,target_frames)

# --- Predict genre ---
def predict_genre(audio_path, device='cpu'):
    waveform = load_audio(audio_path).to(device)

    # ResNet branch
    resnet_spec = audio_to_resnet_spec(waveform).to(device)
    with torch.no_grad():
        resnet_embedding = resnet_model(resnet_spec)

    # AST branch
    ast_spec = ast_preprocess(waveform).to(device)
    with torch.no_grad():
        ast_embedding = ast_model(ast_spec)

    # Fuse embeddings
    fused = torch.cat([resnet_embedding, ast_embedding], dim=1)

    # Final classifier
    with torch.no_grad():
        out = final_fc(fused)
        idx = torch.argmax(out, dim=1).item()

    return GENRES[idx]


# ------------------ ROUTES ------------------
@app.route('/')
def home():
    return jsonify({"message": "Music Genre Prediction API is running 🎵"})

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No audio file uploaded'}), 400

    f = request.files['file']
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        f.save(tmp.name)
        temp_path = tmp.name

    try:
        genre = predict_genre(temp_path)
        return jsonify({'genre': genre})
    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

# ------------------ RUN SERVER ------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=True)
