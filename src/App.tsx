import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

function App() {
  const [zipCode, setZipCode] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    // SOAP request envelope
    const soapRequest = `<?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope 
        xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:web="http://www.webserviceX.NET">
        <soap:Body>
          <web:GetCityWeatherByZIP>
            <web:ZIP>${zipCode}</web:ZIP>
          </web:GetCityWeatherByZIP>
        </soap:Body>
      </soap:Envelope>`;

    try {
      const response = await fetch('http://www.webservicex.net/globalweather.asmx', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml;charset=UTF-8',
          'SOAPAction': 'http://www.webserviceX.NET/GetCityWeatherByZIP'
        },
        body: soapRequest
      });

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const xmlText = await response.text();
      setResult(xmlText);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Weather SOAP API Demo</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
              Enter ZIP Code
            </label>
            <input
              type="text"
              id="zip"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter ZIP code"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : 'Get Weather'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {result && !error && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Response:</h2>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm whitespace-pre-wrap">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;