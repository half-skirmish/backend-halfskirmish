import { Image } from "lucide-react";

export default function MediaLibrary() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Media Library</h3>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Upload Media
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-gray-100 aspect-square rounded-lg flex items-center justify-center">
              <Image size={24} className="text-gray-400" />
            </div>
          ))}
        </div>
        <p className="text-gray-600 mt-4">Upload and manage your media files here.</p>
      </div>
    </div>
  );
}