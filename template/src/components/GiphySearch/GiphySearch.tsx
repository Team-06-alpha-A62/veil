import React, { useState, useEffect } from 'react';
import { Grid } from '@giphy/react-components';
import { GiphyFetch } from '@giphy/js-fetch-api';
import debounce from 'lodash/debounce'; // Import debounce

interface GiphySearchProps {
  styleProps: Record<string, string>;
  setNewMessageImage: React.Dispatch<React.SetStateAction<string>>;
}

const GiphySearch: React.FC<GiphySearchProps> = ({
  styleProps,
  setNewMessageImage,
}) => {
  const [term, setTerm] = useState('dogs'); // Default search term
  const [searchTerm, setSearchTerm] = useState(term); // State for debounced search term
  const gf = new GiphyFetch(import.meta.env.VITE_GIPHY_API_KEY);

  const fetchGifs = (offset: number) =>
    gf.search(searchTerm, { offset, limit: 10 });

  const handleSearchChange = debounce((value: string) => {
    setSearchTerm(value);
  }, 500);

  useEffect(() => {
    handleSearchChange(term);
  }, [term]);

  return (
    <div
      style={styleProps}
      className="h-96 overflow-y-auto absolute bg-base-100 p-6 rounded-xl"
    >
      <input
        onChange={e => setTerm(e.target.value)}
        className="mb-6 px-4 py-2 rounded-3xl bg-base-200  focus:outline-none focus:ring-2 focus:ring-primary text-base-content"
        style={{ marginBottom: 20 }}
        value={term}
      />

      <Grid
        key={searchTerm}
        columns={2}
        fetchGifs={fetchGifs}
        gutter={6}
        initialGifs={[]}
        noResultsMessage={<div>No results for {searchTerm}</div>}
        overlay={({ gif, isHovered }) => <div>{isHovered ? gif.id : ''}</div>}
        width={400}
        noLink={true}
        onGifClick={gif => setNewMessageImage(gif.images.original.url)}
      />
    </div>
  );
};

export default GiphySearch;
