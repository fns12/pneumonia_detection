import React, { useState, useRef } from 'react';
import './App.css';
import { FiUpload, FiCheck, FiShield, FiClock, FiAlertTriangle, FiActivity } from 'react-icons/fi';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setPrediction(null);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Diagnosis failed. Please try again.');
      }

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="app">
      {/* Hero Section */}
          <header className="hero">
      <div
        className="hero-image"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/Image.png)`,
        }}
      />
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="tag-container">
          <span className="tag-icon">🩺</span>
          <span className="tag-text">AI-Powered Detection</span>
        </div>
        <h1 className="main-heading">
          Pneumonia <span className="highlight">Classification</span>
        </h1>
        <p className="subtitle">
          Advanced AI technology for accurate pneumonia detection from chest X-ray images. <br />
          Get instant results with confidence scores.
        </p>
      </div>
    </header>

      {/* Features Section */}
      <section className="features-section">
        <div className="feature-card">
          <div className="feature-icon">
            <FiClock />
          </div>
          <h3>Fast Results</h3>
          <p>Get analysis in seconds with our optimized AI model</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">
            <FiCheck />
          </div>
          <h3>Accurate</h3>
          <p>High confidence predictions validated by radiologists</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">
            <FiShield />
          </div>
          <h3>Secure</h3>
          <p>Your medical data is always protected</p>
        </div>
      </section>

      {/* Upload Section */}
      <section className="upload-section">
        <div className="section-header">
          <h2>Upload Chest X-Ray</h2>
          <p>Upload a clear frontal chest X-ray (PA view preferred) for analysis</p>
        </div>
        
        <form onSubmit={handleSubmit} className="upload-form">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange} 
            accept="image/*"
            hidden
          />
          
          <div 
            className={`upload-area ${preview ? 'has-preview' : ''}`}
            onClick={!preview ? triggerFileInput : null}
          >
            {preview ? (
              <div className="image-preview-container">
                <img src={preview} alt="X-Ray Preview" className="preview-image" />
                <button 
                  type="button" 
                  className="change-image-button"
                  onClick={triggerFileInput}
                >
                  Change Image
                </button>
              </div>
            ) : (
              <div className="upload-placeholder">
                <FiUpload className="upload-icon" />
                <p>Click to browse or drag & drop your X-ray image</p>
                <p className="file-types">Supports: JPG, PNG</p>
              </div>
            )}
          </div>
          
          {selectedFile && (
            <button 
              type="submit" 
              className={`analyze-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Analyzing...
                </>
              ) : (
                'Analyze X-Ray'
              )}
            </button>
          )}
          
          {error && (
            <div className="error-message">
              <FiAlertTriangle /> {error}
            </div>
          )}
        </form>
      </section>

      {/* Results Section */}
      {prediction && (
        <section className="results-section">
          <div className="section-header">
            <h2>Diagnostic Results</h2>
            <p>This analysis should be interpreted by a qualified healthcare professional.</p>
          </div>
          <div className={`result-card ${prediction.predicted_class.toLowerCase().replace(' ', '-')}`}>
            <div className="result-header">
              <h3>{prediction.predicted_class}</h3>
              <div className="confidence-badge">
                {Math.round(prediction.confidence)}% confidence
              </div>
            </div>
            
            {prediction.predicted_class === "Pneumonia" && (
              <div className="treatment-info">
                <h4>Clinical Notes</h4>
                <p>
                  Findings suggest pulmonary opacity consistent with pneumonia. 
                  Recommend clinical correlation, additional testing if indicated, 
                  and consideration of antibiotic therapy based on clinical presentation.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Info Section */}
      <section className="info-section">
        <div className="section-header">
          <h2>About Pneumonia Detection</h2>
        </div>
        <div className="disease-cards">
          <div className="disease-card normal">
            <h3>Normal Chest X-Ray</h3>
            <p>Clear lung fields with no evidence of consolidation or infiltrates.</p>
          </div>
          <div className="disease-card pneumonia">
            <h3>Pneumonia Indicators</h3>
            <p>Look for lobar consolidation, air bronchograms, or interstitial patterns.</p>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="disclaimer-section">
        <div className="section-header">
          <h2>Important Disclaimer</h2>
        </div>
        <div className="disclaimer-content">
          <p>
            This AI system is designed to assist healthcare professionals and is not a replacement 
            for clinical judgment. All results should be interpreted in the context of the patient's 
            clinical presentation and by qualified medical personnel.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <h3>Pneumonia Detection System</h3>
          <p>AI-assisted diagnostic support for healthcare providers</p>
          <p className="copyright">© {new Date().getFullYear()} Medical AI Diagnostics</p>
        </div>
      </footer>
    </div>
  );
}

export default App;