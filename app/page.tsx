'use client';
import { useState } from 'react';

interface GeocodeResult {
  status: 'success' | 'error';
  lat?: string;
  lng?: string;
  formatted_address?: string;
  message?: string;
}

export default function Home() {
  const [address, setAddress] = useState<string>('');
  const [result, setResult] = useState<GeocodeResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    console.log('FRONTEND DEBUG: Submitting address:', address);  // Debug
    try {
      const res = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);  // Proxy with "address" (calls Railway)
      console.log('FRONTEND DEBUG: Proxy status:', res.status);  // Debug
      const text = await res.text();
      let data: GeocodeResult;
      try {
        data = JSON.parse(text) as GeocodeResult;
      } catch {
        console.error('FRONTEND DEBUG: Parse error:', text.substring(0, 200));  // Debug
        setResult({ status: 'error', message: 'Invalid response format' });
        setLoading(false);
        return;
      }
      console.log('FRONTEND DEBUG: Parsed data:', data);  // Debug
      setResult(data);
    } catch (error) {
      console.error('FRONTEND DEBUG: Fetch error:', error);  // Debug
      setResult({ status: 'error', message: 'Network error: ' + (error as Error).message });
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Smartgeocode</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter address (e.g., Paris, France)"
          className="border p-2 mr-2 w-full mb-2 rounded"
          required
        />
        <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 rounded w-full">
          {loading ? 'Geocoding...' : 'Geocode'}
        </button>
      </form>
      {result && (
        <div className="border p-4 rounded bg-gray-100">
          <p><strong>Status:</strong> {result.status}</p>
          {result.status === 'success' && (
            <div>
              <p><strong>Lat:</strong> {result.lat}</p>
              <p><strong>Lng:</strong> {result.lng}</p>
              <p><strong>Address:</strong> {result.formatted_address}</p>
            </div>
          )}
          {result.status === 'error' && <p className="text-red-500"><strong>Error:</strong> {result.message}</p>}
        </div>
      )}
    </div>
  );
}