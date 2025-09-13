// src/components/debug/ApiDebug.jsx
import React, { useState } from 'react';
import { loanAPI } from '../../api/loan';

const ApiDebug = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    try {
      const result = await loanAPI.getAllLoans();
      setResponse(result);
      console.log('API Response:', result);
    } catch (error) {
      setResponse(error);
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-lg font-bold mb-2">API Debug</h2>
      <button
        onClick={testApi}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Loans API'}
      </button>
      
      {response && (
        <div className="mt-4 p-4 bg-white rounded">
          <h3 className="font-semibold">Response:</h3>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiDebug;