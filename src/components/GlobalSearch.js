import React, { useState } from 'react';
import axios from 'axios';

const GlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/global-search', {
        params: { query }
      });

      setSearchResults(response.data);
    } catch (error) {
      console.error('Error performing global search', error);
      setSearchResults([]);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Global Search</h1>

      <div className="flex space-x-4 mb-4">
        <input 
          type="text"
          placeholder="Search students, classes..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Search
        </button>
      </div>

      <div className="space-y-4">
        {searchResults.length > 0 ? (
          searchResults.map((result, index) => (
            <div 
              key={index} 
              className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">{result.name}</h2>
                <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
                  {result.type}
                </span>
              </div>
              <p className="text-gray-700">{result.additionalInfo}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No results found</p>
        )}
      </div>
    </div>
  );
};

export default GlobalSearch;
