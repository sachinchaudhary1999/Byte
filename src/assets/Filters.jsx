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
        console.log('CSV loaded:', results.data);
        setCsvData(results.data);
      },
      error: (error) => {
        console.error('CSV parse error:', error);
      }
    });
  }, []);

  const handleChange = (key, value) => {
    // Reset dependent dropdowns when a higher-level one changes
    if (key === 'category') {
      setFilters({ category: value, country: '', state: '', city: '' });
    } else if (key === 'country') {
      setFilters((prev) => ({ ...prev, country: value, state: '', city: '' }));
    } else if (key === 'state') {
      setFilters((prev) => ({ ...prev, state: value, city: '' }));
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
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

  const getOptions = (field) => {
    if (!csvData || csvData.length === 0) return [];

    let filteredData = csvData;

    if (field === 'country' && filters.category) {
      filteredData = filteredData.filter(item => item.category?.trim().toLowerCase() === filters.category.trim().toLowerCase());
    }

    if (field === 'state') {
      if (filters.category) {
        filteredData = filteredData.filter(item => item.category?.trim().toLowerCase() === filters.category.trim().toLowerCase());
      }
      if (filters.country) {
        filteredData = filteredData.filter(item => item.country?.trim().toLowerCase() === filters.country.trim().toLowerCase());
      }
    }

    if (field === 'city') {
      if (filters.category) {
        filteredData = filteredData.filter(item => item.category?.trim().toLowerCase() === filters.category.trim().toLowerCase());
      }
      if (filters.country) {
        filteredData = filteredData.filter(item => item.country?.trim().toLowerCase() === filters.country.trim().toLowerCase());
      }
      if (filters.state) {
        filteredData = filteredData.filter(item => item.state?.trim().toLowerCase() === filters.state.trim().toLowerCase());
      }
    }

    const options = filteredData
      .map((item) => item[field])
      .filter((val) => val && val.trim() !== '')
      .map((val) => val.trim());

    return [...new Set(options)].sort((a, b) => a.localeCompare(b));
  };

  return (
    <div className="filters-container">
      <div className="filters-top">
        {['category', 'country', 'state', 'city'].map((field) => (
          <div key={field} className="filter-item">

            <label
            style={{
              color: "blue",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
            }}
            onClick={() =>
              setOpenDropdown(openDropdown === field ? null : field)
            }
          >

          
              {field === 'category' && (
                <img src="/category.svg" width="20" height="20" alt="Category Icon"
                  style={{ filter: 'invert(27%) sepia(100%) saturate(5000%) hue-rotate(180deg)', verticalAlign: 'middle' }} />
              )}
              {field === 'country' && (
                <img src="/country.svg" width="20" height="20" alt="Country Icon"
                  style={{ filter: 'invert(27%) sepia(100%) saturate(5000%) hue-rotate(180deg)', verticalAlign: 'middle' }} />
              )}
              {field === 'state' && (
                <img src="/state.svg" width="20" height="20" alt="State Icon"
                  style={{ filter: 'invert(27%) sepia(100%) saturate(5000%) hue-rotate(180deg)', verticalAlign: 'middle' }} />
              )}
              {field === 'city' && (
                <img src="/city.svg" width="20" height="20" alt="City Icon"
                  style={{ filter: 'invert(27%) sepia(100%) saturate(5000%) hue-rotate(180deg)', verticalAlign: 'middle' }} />
              )}
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>

            <select
              value={filters[field]}


              onChange={(e) => handleChange(field, e.target.value)}
              // 🔹 This line changes only the placeholder text color to red
              style={{ color: filters[field] === '' ? 'grey' : 'blue' }}
            >
              <option value="" disabled style={{ color: 'grey' }}>
                Select {field}
              </option>
              {getOptions(field).map((option) => (
                <option key={option} value={option} style={{ color: 'blue' }}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="filters-bottom">
        <Button
          variant="contained"
          onClick={handleRequest}
          className="request"
          startIcon={
            <img
              src="/data.svg"
              alt="Request Icon"
              width="20"
              height="20"
              style={{ filter: 'invert(100%)' }}
            />
          }
          style={{
            backgroundColor: 'blue',
            color: 'white',
            borderRadius: '10px',
            padding: '8px 16px',
          }}
        >
          Request Custom Database
        </Button>
      </div>
    </div>
  );
};

export default Filters;

