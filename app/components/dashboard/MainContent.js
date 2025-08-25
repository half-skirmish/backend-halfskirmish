export default function MainContent() {
  return (
    <div className="ml-64 mt-16 p-6 bg-gray-900 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="bg-gray-800 p-6 rounded-lg border border-teal-500">
          <h3 className="text-lg font-semibold text-white">Total Games</h3>
          <p className="text-3xl font-bold text-teal-500">24</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg border border-teal-500">
          <h3 className="text-lg font-semibold text-white">Active Players</h3>
          <p className="text-3xl font-bold text-teal-500">142</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg border border-teal-500">
          <h3 className="text-lg font-semibold text-white">Total Revenue</h3>
          <p className="text-3xl font-bold text-teal-500">$1,234</p>
        </div>
      </div>
    </div>
  );
}
