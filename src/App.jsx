import './App.css';
import Title from './assets/Title.jsx';
import Dataset from './assets/Dataset.jsx';

function App() {
  return (
    <div className="main">
      <div className="container1">
        <Title />
      </div>
      <div className="container2">
        <Dataset />
      </div>
    </div>
  );
}

export default App;
