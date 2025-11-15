from dotenv import load_dotenv
import os, tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS
import torch, torch.nn as nn
import torch.nn.functional as F
import torchaudio
from torchvision import models, transforms
from transformers import ASTModel, AutoProcessor

# ------------------ CONFIG ------------------
load_dotenv()
PORT = int(os.getenv("PORT", 5001))
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

app = Flask(__name__)
CORS(app)

# ------------------ LABELS ------------------
GENRE_CLASSES = ['blues', 'classical', 'country', 'disco', 'hiphop',
                 'jazz', 'metal', 'pop', 'reggae', 'rock']

# ------------------ MODEL PATH ------------------
BASE_DIR = r"F:\music-projects\music-genre-app\server"
GENRE_MODEL_PATH = os.path.join(BASE_DIR, "res_ast_fusion_model.pth")

# ------------------ MODEL ------------------
class AttentionFusion(nn.Module):
    def __init__(self, ast_dim=768, resnet_dim=512, hidden_dim=512, num_classes=len(GENRE_CLASSES)):
        super().__init__()
        self.ast_proj = nn.Linear(ast_dim, hidden_dim)
        self.resnet_proj = nn.Linear(resnet_dim, hidden_dim)
        self.attn = nn.Sequential(
            nn.Linear(hidden_dim, hidden_dim),
            nn.Tanh(),
            nn.Linear(hidden_dim, 1)
        )
        self.classifier = nn.Sequential(
            nn.Linear(hidden_dim, hidden_dim//2),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(hidden_dim//2, num_classes)
        )

    def forward(self, ast_emb, resnet_emb):
        ast_h = self.ast_proj(ast_emb)
        resnet_h = self.resnet_proj(resnet_emb)
        seq = torch.stack([ast_h, resnet_h], dim=1)  # (B,2,H)
        attn_scores = self.attn(seq)
        attn_weights = torch.softmax(attn_scores, dim=1)
        fused = (attn_weights * seq).sum(dim=1)
        return self.classifier(fused)

# ------------------ LOAD MODEL ------------------
def load_genre_model():
    model = AttentionFusion().to(device)
    checkpoint = torch.load(GENRE_MODEL_PATH, map_location=device)
    model.load_state_dict(checkpoint['model_state_dict'])
    model.eval()
    return model

genre_model = load_genre_model()
print("✅ Genre model loaded successfully!")

# ------------------ FEATURE PROCESSING ------------------
processor = AutoProcessor.from_pretrained("MIT/ast-finetuned-audioset-10-10-0.4593")
resnet_model = models.resnet18(weights=None)
resnet_model.fc = nn.Identity()
resnet_model.eval().to(device)

resnet_transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485,0.456,0.406], std=[0.229,0.224,0.225])
])

def load_audio(audio_path):
    waveform, sr = torchaudio.load(audio_path)
    if sr != 16000:
        waveform = torchaudio.transforms.Resample(sr,16000)(waveform)
    return waveform.mean(dim=0, keepdim=True)  # mono

def waveform_to_mel_spec(waveform):
    mel = torchaudio.transforms.MelSpectrogram(16000, n_fft=1024, hop_length=512, n_mels=128)(waveform)
    mel_db = torchaudio.transforms.AmplitudeToDB()(mel)
    mel_db = F.interpolate(mel_db.unsqueeze(0), size=(224,224))
    mel_db = mel_db.repeat(1,3,1,1)
    return mel_db

def extract_features(audio_path):
    waveform = load_audio(audio_path).to(device)
    
    # AST features
    inputs = processor(raw_speech=waveform.squeeze().cpu().numpy(),
                       sampling_rate=16000, return_tensors="pt", padding=True)
    inputs = {k:v.to(device) for k,v in inputs.items()}
    with torch.no_grad():
        ast_model = ASTModel.from_pretrained("MIT/ast-finetuned-audioset-10-10-0.4593").to(device)
        ast_model.eval()
        ast_out = ast_model(**inputs)
        ast_feat = torch.mean(ast_out.last_hidden_state, dim=1)
    
    # ResNet features
    mel_spec = waveform_to_mel_spec(waveform).to(device)
    with torch.no_grad():
        resnet_feat = resnet_model(mel_spec)
        resnet_feat = resnet_feat.view(resnet_feat.size(0), -1)
    
    return ast_feat, resnet_feat

# ------------------ PREDICTION ------------------
def predict_genre(audio_path):
    ast_feat, resnet_feat = extract_features(audio_path)
    with torch.no_grad():
        logits = genre_model(ast_feat, resnet_feat)
        pred_idx = torch.argmax(logits, dim=1).item()
        genre = GENRE_CLASSES[pred_idx]
    return genre

# ------------------ FLASK API ------------------
@app.route("/predict", methods=["POST"])
def predict():
    try:
        if "file" not in request.files:
            return jsonify({"error":"No file uploaded"}),400
        uploaded_file = request.files["file"]
        if uploaded_file.filename=="":
            return jsonify({"error":"Empty filename"}),400

        with tempfile.NamedTemporaryFile(delete=False,suffix=".wav") as tmp:
            uploaded_file.save(tmp.name)
            audio_path = tmp.name

        torch.cuda.empty_cache()
        genre = predict_genre(audio_path)

        if os.path.exists(audio_path):
            os.remove(audio_path)

        return jsonify({"status":"success", "genre": genre})

    except Exception as e:
        if 'audio_path' in locals() and os.path.exists(audio_path):
            os.remove(audio_path)
        return jsonify({"status":"error","error":str(e)}),500
# ------------------ RUN SERVER ------------------
if __name__ == "__main__":
    from waitress import serve
    print("🚀 Running with Waitress production server on port 5001...")
    serve(app, host="0.0.0.0", port=5001)

