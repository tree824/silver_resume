import React, { useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [region, setRegion] = useState('');
  const [image, setImage] = useState(null);
  const [resume, setResume] = useState('');
  const [resumeImage, setResumeImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      
      formData.append('name', name);
      formData.append('age', age);
      formData.append('region', region);
      
      if (image) {
        formData.append('image', image);
      }

      const response = await fetch('http://localhost:8000/resume', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setResume(data.resume);
        if (data.image) {
          setResumeImage(`data:image/jpeg;base64,${data.image}`);
        }
      } else {
        alert('이력서 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('서버 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="이름을 입력하세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />
        <input
          type="number"
          placeholder="나이를 입력하세요"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="지역을 입력하세요"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          style={styles.input}
        />
        <div style={styles.fileInputWrapper}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={styles.fileInput}
            id="file-input"
          />
          <label htmlFor="file-input" style={styles.fileInputLabel}>
            증명사진을 업로드해주세요
          </label>
        </div>
        <button 
          type="submit" 
          style={styles.button}
          disabled={loading}
        >
          {loading ? '생성 중...' : '이력서 생성하기'}
        </button>
      </form>

      {resume && (
        <div style={styles.resumePreview}>
          <h3>생성된 이력서</h3>
          <div style={styles.resumeHeader}>
            {resumeImage && (
              <img 
                src={resumeImage} 
                alt="증명사진" 
                style={styles.resumeImage}
              />
            )}
            <pre style={styles.resumeText}>{resume}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "40px 20px",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  input: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "16px",
  },
  fileInputWrapper: {
    position: "relative",
    width: "100%",
    height: "100px",
    border: "2px dashed #ccc",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
  },
  fileInput: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0,
    cursor: "pointer",
  },
  fileInputLabel: {
    color: "#666",
    fontSize: "14px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  resumePreview: {
    marginTop: "20px",
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  resumeHeader: {
    display: "flex",
    gap: "20px",
    alignItems: "flex-start",
  },
  resumeImage: {
    width: "120px",
    height: "160px",
    objectFit: "cover",
    border: "1px solid #ddd",
  },
  resumeText: {
    whiteSpace: "pre-wrap",
    fontSize: "14px",
    lineHeight: "1.5",
    flex: 1,
  }
};

export default App;