import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState('');

  // Validate if the input is a valid JSON
  const validateJSON = (input) => {
    try {
      JSON.parse(input);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Handle form submission
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

  // Handle multi-select dropdown change
  const handleOptionChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedOptions(value);
  };

  // Filter response based on selected options
  const filteredResponse = () => {
    if (!responseData) return null;

    let filtered = {};
    if (selectedOptions.includes('Alphabets')) {
      filtered.alphabets = responseData.alphabets.join(', ');
    }
    if (selectedOptions.includes('Numbers')) {
      filtered.numbers = responseData.numbers.join(', ');
    }
    if (selectedOptions.includes('Highest lowercase alphabet')) {
      filtered.highest_lowercase_alphabet = responseData.highest_lowercase_alphabet.join(', ');
    }

    return filtered;
  };

  const renderFilteredResponse = () => {
    const filtered = filteredResponse();
    if (!filtered) return null;

    return (
      <div style={{ marginTop: '20px' }}>
        {selectedOptions.includes('Alphabets') && (
          <div>
            <h3>Alphabets:</h3>
            <p>{filtered.alphabets}</p>
          </div>
        )}
        {selectedOptions.includes('Numbers') && (
          <div>
            <h3>Numbers:</h3>
            <p>{filtered.numbers}</p>
          </div>
        )}
        {selectedOptions.includes('Highest lowercase alphabet') && (
          <div>
            <h3>Highest Lowercase Alphabet:</h3>
            <p>{filtered.highest_lowercase_alphabet}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Bajaj finserv Application</h1>
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
          <h2>Select Filters: (To select multiple filters press Ctrl and select multiple of them) </h2>
          <select multiple onChange={handleOptionChange} style={{ width: '200px', height: '100px', marginTop: '10px' }}>
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
          </select>

          <h2>Filtered Response:</h2>
          {renderFilteredResponse()}
        </>
      )}
    </div>
  );
}

export default App;
