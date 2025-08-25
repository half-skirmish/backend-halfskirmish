export default function Topbar() {
  return (
    <div className="bg-gray-800 h-16 fixed right-0 top-0 left-64 px-6 flex items-center justify-between">
      <div className="text-xl font-semibold text-white">Dashboard</div>
      
      <div className="flex items-center space-x-4">
        <button className="text-gray-300 hover:text-white">
          <span className="sr-only">Notifications</span>
          {/* Add notification icon */}
        </button>
        
        <div className="relative">
          <button className="flex items-center space-x-2 text-gray-300 hover:text-white">
            <img
              src="/avatar-placeholder.png"
              alt="User avatar"
              className="h-8 w-8 rounded-full"
            />
            <span>John Doe</span>
          </button>
        </div>
      </div>
    </div>
  );
}
