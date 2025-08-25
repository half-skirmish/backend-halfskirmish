export default function Topbar() {
  return (
    <div className="bg-white h-16 fixed right-0 top-0 left-64 px-6 border border-[#F3F2F1] flex items-center justify-between">
      <div className="text-xl font-semibold text-[#0078D4]">Admin Panel</div>
      
      <div className="flex items-center space-x-4">
        
        <div className="relative">

        <button className="text-white bg-[#0078D4] hover:bg-[#005ba0] px-3 py-3 rounded-lg text-sm">
          + Create Post
        </button>

        </div>
      </div>
    </div>
  );
}
