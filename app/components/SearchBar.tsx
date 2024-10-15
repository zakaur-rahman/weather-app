import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [city, setCity] = useState<string>('');

  const handleSearch = () => {
    if (city.trim()) {
      onSearch(city);
    }
  };

  return (
    <div className="flex items-center bg-white bg-opacity-20 p-2 rounded-lg">
      <input
        type="text"
        placeholder="Search by city..."
        className="bg-transparent outline-none px-2 text-white"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button onClick={handleSearch} className="ml-2">
        🔍
      </button>
    </div>
  );
};

export default SearchBar;
