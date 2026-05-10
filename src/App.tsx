import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';
import LogRun from './pages/LogRun';
import StatsPage from './pages/StatsPage';
import GoalsPage from './pages/GoalsPage';
import RaceRecordsPage from './pages/RaceRecordsPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/log" element={<LogRun />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/records" element={<RaceRecordsPage />} />
        </Routes>
        <NavBar />
      </BrowserRouter>
    </AppProvider>
  );
}
