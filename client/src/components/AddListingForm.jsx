import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddListingForm() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    minBid: '',
    maxBid: '',
  });
  
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch('http://localhost:3001/listings/create', {  // Updated URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...formData,
                minBid: parseFloat(formData.minBid),
                maxBid: parseFloat(formData.maxBid),
            }),
            credentials: 'include',
        });

        // Add this console.log to see the actual response
        console.log('Response status:', response.status);
        const text = await response.text();
        console.log('Response body:', text);

        // Try to parse the response only if it's actually JSON
        let data;
        try {
            data = JSON.parse(text);
        } catch (err) {
            throw new Error('Server returned invalid JSON: ' + text);
        }

        if (!response.ok) {
            throw new Error(data.error || 'Failed to create listing');
        }

        navigate('/listings');
    } catch (err) {
        setError(err.message);
        console.error('Error details:', err);
    }
};

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 space-y-6">
      {error && <div className="text-red-500">{error}</div>}
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Title
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
          <textarea
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Minimum Bid ($)
          <input
            type="number"
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={formData.minBid}
            onChange={(e) => setFormData({...formData, minBid: e.target.value})}
          />
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Maximum Bid ($)
          <input
            type="number"
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={formData.maxBid}
            onChange={(e) => setFormData({...formData, maxBid: e.target.value})}
          />
        </label>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        Create Listing
      </button>
    </form>
  );
}