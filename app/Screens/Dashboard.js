import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import MainContent from '../components/dashboard/MainContent';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Sidebar />
      <Topbar />
      <MainContent />
    </div>
  );
}
