export default function UrlShortener() {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">URL Shortener</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-gray-700 mb-4">Enter a long URL to create a shorter version</p>
        <div className="mb-4">
          <input 
            type="text" 
            placeholder="https://example.com/very/long/url"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Shorten URL
        </button>
      </div>
    </div>
  )
} 