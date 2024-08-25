import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState('');

  const validateJSON = (input) => {
    try {
      JSON.parse(input);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (validateJSON(jsonInput)) {
      setError('');
      try {
        const response = await axios.post('https://bajaj-finserv-backend-v1iq.onrender.com/bfhl', JSON.parse(jsonInput));
        setResponseData(response.data);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to fetch data from the server');
      }
    } else {
      setError('Invalid JSON input');
    }
  };

  const handleOptionChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedOptions(value);
  };

  const filteredResponse = () => {
    if (!responseData) return null;

    let filtered = {};
    if (selectedOptions.includes('Alphabets')) {
      filtered.alphabets = responseData.alphabets;
    }
    if (selectedOptions.includes('Numbers')) {
      filtered.numbers = responseData.numbers;
    }
    if (selectedOptions.includes('Highest lowercase alphabet')) {
      filtered.highest_lowercase_alphabet = responseData.highest_lowercase_alphabet;
    }

    return filtered;
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Frontend Application</h1>
      <input
        type="text"
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder='Enter JSON'
        style={{ width: '300px', padding: '5px' }}
      />
      <button onClick={handleSubmit} style={{ marginLeft: '10px', padding: '5px' }}>Submit</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {responseData && (
        <>
          <h2>Select Filters:</h2>
          <select multiple onChange={handleOptionChange} style={{ width: '200px', height: '100px', marginTop: '10px' }}>
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
          </select>

          <h2>Filtered Response:</h2>
          <pre style={{ backgroundColor: '#f4f4f4', padding: '10px' }}>
            {JSON.stringify(filteredResponse(), null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}

export default App;
