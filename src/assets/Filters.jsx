

import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Papa from 'papaparse';
import './Filters.css';

const Filters = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    category: '',
    country: '',
    state: '',
    city: '',
  });

  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    Papa.parse('/business_dataset.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Log loaded CSV for debugging
        console.log('CSV loaded:', results.data);
        setCsvData(results.data);
      },
      error: (error) => {
        console.error('CSV parse error:', error);
      }
    });
  }, []);

  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleRequest = () => {
    const result = csvData.filter((item) => {
      return (
        (!filters.category || (item.category && item.category.trim().toLowerCase() === filters.category.trim().toLowerCase())) &&
        (!filters.country || (item.country && item.country.trim().toLowerCase() === filters.country.trim().toLowerCase())) &&
        (!filters.state || (item.state && item.state.trim().toLowerCase() === filters.state.trim().toLowerCase())) &&
        (!filters.city || (item.city && item.city.trim().toLowerCase() === filters.city.trim().toLowerCase()))
      );
    });

    console.log('Filtered Data:', result);
    if (typeof onFilter === 'function') {
      onFilter(result);
    }
  };

  // Normalize options: remove empty, trim, deduplicate
  const getOptions = (field) => {
    if (!csvData || csvData.length === 0) return [];

    const options = csvData
      .map((item) => item[field])
      .filter((val) => val && val.trim() !== '') // remove empty or undefined
      .map((val) => val.trim());

    // Deduplicate options and sort alphabetically for better UX
    return [...new Set(options)].sort((a, b) => a.localeCompare(b));
  };

  return (
    <div className="filters-container">
      <div className="filters-top">
        {['category', 'country', 'state', 'city'].map((field) => (
          <div key={field} className="filter-item">
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <select
              value={filters[field]}
              onChange={(e) => handleChange(field, e.target.value)}
            >
              <option value="">Select {field}</option>
              {getOptions(field).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="filters-bottom">
        <Button variant="contained" onClick={handleRequest} className="request">
          Request Custom Database
        </Button>
      </div>
    </div>
  );
};

export default Filters;


