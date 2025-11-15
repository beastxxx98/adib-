import { useState } from 'react';
import './genre.css';

export default function GenrePredict() {
  const [audioFile, setAudioFile] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAudioFile(file);
    setAudioURL(URL.createObjectURL(file));
    setResult('');
  };

  const handlePredict = async () => {
    if (!audioFile) return setResult('Please upload an audio file first.');
    setLoading(true);
    setResult('');

    try {
      const formData = new FormData();
      formData.append('file', audioFile);

      const res = await fetch('http://127.0.0.1:5001/predict', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Server error');

      // ✅ Updated: show both genre & subgenre
      const genreText = `🎵 Predicted Genre: ${data.genre}`;

      setResult(`${genreText}`);
    } catch (err) {
      console.error('Prediction Error:', err);
      setResult(`Error predicting genre: ${err.message}`);
    }

    setLoading(false);
  };

  return (
    <div className="genre-container">
      <div className="genre-card">
        <h2>🎧 Music Genre Prediction</h2>
        <p className="subtitle">Upload your audio file:</p>

        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
        />

        {/* Audio player */}
        {audioURL && (
          <audio controls style={{ marginTop: '10px', width: '100%' }}>
            <source src={audioURL} type={audioFile?.type} />
            Your browser does not support the audio element.
          </audio>
        )}

        <button
          onClick={handlePredict}
          disabled={loading || !audioFile}
          style={{ marginTop: '10px' }}
        >
          {loading ? 'Predicting...' : 'Predict Genre '}
        </button>

        {result && (
          <div
            className="result-box"
            style={{
              marginTop: '10px',
              whiteSpace: 'pre-line', // 👈 keeps line breaks
            }}
          >
            {result}
          </div>
        )}
      </div>
    </div>
  );
}
