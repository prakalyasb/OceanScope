import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explorer from './pages/Explorer';
import Map from './pages/Map';
import Datasets from './pages/Datasets';
import Upload from './pages/Upload';
import Compare from './pages/Compare';
import Insights from './pages/Insights';
import About from './pages/About';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explorer" element={<Explorer />} />
          <Route path="/map" element={<Map />} />
          <Route path="/datasets" element={<Datasets />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;