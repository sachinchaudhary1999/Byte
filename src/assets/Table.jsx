import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { FiFileText, FiDownload, FiShoppingCart } from 'react-icons/fi';
import './table.css';
import Filters from './Filters.jsx';

function Table({ Filters }) { // Receive filters as prop
  const [rawData, setRawData] = useState([]); // keep full raw data
  const [groupedData, setGroupedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;


  useEffect(() => {
    Papa.parse('/business_dataset.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validRows = results.data.filter(row => row.name && row.email && row.phone && row.category);
        setRawData(validRows);
      },
      error: (err) => {
        console.error('Error loading CSV:', err);
      }
    });
  }, []);

  // Whenever rawData or filters change, apply filtering and grouping
  useEffect(() => {
    if (!rawData.length) return;

    // Apply filters:
    const filtered = rawData.filter(row => {
      return (
        (!filters.category || row.category === Filters.category) &&
        (!filters.country || row.country === Filters.country) &&
        (!filters.state || row.state === Filters.state) &&
        (!filters.city || row.city === Filters.city)
      );
    });

    // Group by category (or any other grouping logic you want)
    const groupMap = {};
    filtered.forEach(row => {
      const cat = row.category;
      if (!groupMap[cat]) {
        groupMap[cat] = { category: cat, count: 0, emails: new Set(), phones: new Set() };
      }
      groupMap[cat].count += 1;
      groupMap[cat].emails.add(row.email);
      groupMap[cat].phones.add(row.phone);
    });

    const groupedArray = Object.values(groupMap).map(item => ({
      category: item.category,
      count: item.count,
      emails: Array.from(item.emails),
      phones: Array.from(item.phones),
    }));

    setGroupedData(groupedArray);
    setCurrentPage(1); // reset to first page on filter change
  }, [rawData, Filters]);

  const totalPages = Math.ceil(groupedData.length / itemsPerPage);
  const paginatedData = groupedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Total Records</th>
              <th>Email Count</th>
              <th>Phone Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">Loading or No data available</td>
              </tr>
            ) : (
              paginatedData.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.category}</td>
                  <td style={{ fontWeight: '600', color: '#0d47a1' }}>{item.count.toLocaleString()}</td>
                  <td>{item.emails.length.toLocaleString()}</td>
                  <td>{item.phones.length.toLocaleString()}</td>
                  <td>
                    <button className="btn view"><FiFileText /> View</button>
                    <button className="btn sample"><FiDownload /> Sample</button>
                    <button className="btn purchase"><FiShoppingCart /> Purchase</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <span>
          Showing {paginatedData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, groupedData.length)} of {groupedData.length.toLocaleString()}
        </span>
        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</button>
        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
      </div>
    </>
  );
}

export default Table;
