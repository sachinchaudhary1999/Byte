import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { FiFileText, FiDownload, FiShoppingCart } from "react-icons/fi";
import "./table.css";
import Button from '@mui/material/Button';
import Filters from './Filters.jsx';

function Table({ filters }) {
  const [rawData, setRawData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Load CSV data
  useEffect(() => {
    try {
      Papa.parse("/business_dataset_expanded.csv", {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const validRows = results.data.filter(
              (row) =>
                row &&
                row.id &&
                row.category &&
                row.country &&
                row.state &&
                row.city &&
                String(row.id).trim() !== "" &&
                row.category.trim() !== "" &&
                row.country.trim() !== "" &&
                row.state.trim() !== "" &&
                row.city.trim() !== ""
            );
            setRawData(validRows);
          } catch (err) {
            console.error("Error filtering CSV data:", err);
            setRawData([]);
          }
        },
        error: (err) => {
          console.error("Error loading CSV:", err);
          setRawData([]);
        },
      });
    } catch (err) {
      console.error("Unexpected CSV parsing error:", err);
    }
  }, []);

  // Apply filters + group by category
  useEffect(() => {
    try {
      if (!rawData.length) return;

      let filtered = rawData; // rawData is an array
      for (var i = 0; i < filtered.length; i++) {
        console.log('::::::::' + filtered[i].category);
      } 


const groupMap = {};
filtered.forEach((row) => {
  try {
    const groupKey = `${row.category}__${row.country}`;
    if (!groupMap[groupKey]) {
      groupMap[groupKey] = { 
        category: row.category, 
        country: row.country,
        count: 0, 
        items: [] 
      };
    }
    groupMap[groupKey].count += 1;
    groupMap[groupKey].items.push(row); // store row data for access
  } catch (err) {
    console.error("Error grouping row:", err);
  }
});

setGroupedData(Object.values(groupMap));

 
      setCurrentPage(1);
    } catch (err) {
      console.error("Error applying filters or grouping:", err);
      setGroupedData([]);
    }
  }, [rawData, filters]);

  // Pagination
  let totalPages = 1;
  let paginatedData = [];
  try {
    totalPages = Math.ceil(groupedData.length / itemsPerPage);
    paginatedData = groupedData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  } catch (err) {
    console.error("Error in pagination:", err);
    paginatedData = [];
  }

  return (
    <>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>
                <div className="name">NAME</div>
              </th>
              <th>
                <div className="total">Total Records</div>
              </th>
              <th>
                <div className="email">Email</div>
              </th>
              <th>
                <div className="phone">Phone</div>
              </th>
              <th>
                <div colSpan="2" className="action">Actions</div>
              </th>
            </tr>
          </thead>
    <tbody>
        {paginatedData.map((item, index) => {
    const uniqueEmails = [
      ...new Set(item.items.map((row) => row.email)),
    ].filter(Boolean);

    const uniquePhones = [
      ...new Set(item.items.map((row) => row.phone)),
    ].filter(Boolean);

    return (
      <tr key={index}>
        {/* Name (Category + Country) */}
       <td>{`List of ${item.category} in ${item.country}`}</td>


        {/* Total Records */}
        <td>{item.count.toLocaleString()}</td>

        {/* Email */}
        <td>{uniqueEmails.length}</td>

        {/* Phone */}
        <td>{uniquePhones.length}</td>

        {/* Actions */}
        <td colSpan="2">
          <div className="btn-group">
            <button className="btn view">
              <FiFileText /> View
            </button>
            <button className="btn sample">
              <FiDownload /> Sample
            </button>
            <button className="btn purchase">
              <FiShoppingCart /> Purchase
            </button>
          </div>
        </td>
      </tr>
    );
  })}
</tbody>
        </table>
         <div className="pagination">
        <span className="showing">
          Showing{" "}
          {paginatedData.length === 0
            ? 0
            : (currentPage - 1) * itemsPerPage + 1}{" "}
          - {Math.min(currentPage * itemsPerPage, groupedData.length)} of{" "}
          {groupedData.length.toLocaleString()}
        </span>
      <div className="button pagination"> 
         <button className="previous"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button className="next"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </button></div>
      </div>



      </div>
    </>
  );
}

export default Table;
