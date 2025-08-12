import './Dataset.css';
import Filters from './Filters.jsx';
import Table from './Table.jsx';

function Dataset() {
  return (
    <div className="dataset">
      <div className="filters-container">
        <Filters />
      </div>
      <div className="table-container">
        <Table />
      </div>
    </div>
  );
}

export default Dataset;
