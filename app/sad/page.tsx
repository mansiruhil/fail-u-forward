"use client"
import { useState } from 'react';

const SadnessChecker = () => {
  const [post, setPost] = useState('');
  const [isSad, setIsSad] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [val, setVal] = useState<string>("");

  const analyzePost = async () => {
    setLoading(true);
    setIsSad(null); // Reset the result
    try {
      const response = await fetch('/api/sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({post}),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze sentiment');
      }

      let data = await response.json();
    //   if (!data || typeof data.sad !== "boolean") {
    //     throw new Error("Unexpected API response format");
    //   }
    console.log(typeof(data))
    console.log(data.length)
    if (data.trim()=== '0')
        setVal("happy")
    else if (data.trim()==='1'){
        setVal("sad")
    }
    else setVal("no if")
      setIsSad(data);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      setIsSad(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Sadness Checker</h1>
      </div>
      <textarea
        value={post}
        onChange={(e) => setPost(e.target.value)}
        placeholder="Type your post here..."
        style={{
          width: '100%',
          height: '100px',
          marginBottom: '10px',
          padding: '10px',
          fontSize: '16px',
        }}
      />
      <button
        onClick={analyzePost}
        disabled={loading || !post.trim()}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '5px',
        }}
      >
        {loading ? 'Analyzing...' : 'Check Sadness'}
      </button>
      {isSad !== null && (
        <p style={{ marginTop: '20px', fontSize: '18px' }}>
          {/* {isSad === 1 ? 'The post is Sad ' : 'The post is Not Sad '} */}
          {val}
        </p>
      )}
    </div>
  );
};

export default SadnessChecker;
