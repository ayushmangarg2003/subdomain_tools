import Link from 'next/link';
import BackgroundPattern from '../components/BackgroundPattern';

const tools = [
  {
    id: 'password-generator',
    title: 'Password Generator',
    description: 'Create strong, secure passwords with custom requirements',
    icon: '🔒',
    available: true,
  },
  {
    id: 'color-palette',
    title: 'Color Palette Generator',
    description: 'Generate beautiful color schemes for your projects',
    icon: '🎨',
    available: true,
  },
  {
    id: 'url-shortener',
    title: 'URL Shortener',
    description: 'Shorten long URLs into compact, shareable links',
    icon: '🔗',
    available: true,
  },
  {
    id: 'markdown-editor',
    title: 'Markdown Editor',
    description: 'Edit and preview markdown with a clean interface',
    icon: '📝',
    available: true,
  },
  {
    id: 'regex-tester',
    title: 'Regex Tester',
    description: 'Test and debug regular expressions with live highlighting',
    icon: '🔍',
    available: true,
  },
  {
    id: 'image-to-data-uri',
    title: 'Image to Data URI',
    description: 'Convert images to data URIs for embedding in HTML/CSS',
    icon: '🖼️',
    available: true,
  },
  {
    id: 'csv-to-json',
    title: 'CSV to JSON Converter',
    description: 'Convert between CSV and JSON formats easily',
    icon: '📊',
    available: true,
  },
  {
    id: 'css-gradient',
    title: 'CSS Gradient Generator',
    description: 'Create beautiful CSS gradients for your website',
    icon: '🌈',
    available: true,
  },
];

export default function Home() {
  return (
    <div className="relative py-12">
      <BackgroundPattern />
      
      <div className="relative">
        <div className="text-center mb-16">
          <div className="flex flex-col items-center justify-center">
            <div className="bg-gradient-to-r p-2 from-indigo-500 via-purple-500 to-pink-500 rounded-full mb-6">
              <div className="bg-gray-50 rounded-full p-4">
                <div className="text-6xl">🛠️</div>
              </div>
            </div>
            <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              ToolHub
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your collection of useful web utilities to boost productivity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="relative flex flex-col bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 hover:border-gray-200 h-full min-h-[340px]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <div className="flex flex-col flex-1 p-8 relative z-10">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-r p-2 from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <div className="bg-white rounded-full p-3 flex items-center justify-center">
                      <div className="text-3xl flex items-center justify-center">{tool.icon}</div>
                    </div>
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-2 text-center">{tool.title}</h2>
                <p className="text-gray-600 mb-6 text-center line-clamp-2 min-h-[48px]">{tool.description}</p>
                <div className="mt-auto">
                  {tool.available ? (
                    <Link 
                      href={`/${tool.id}`}
                      className="inline-flex w-full items-center justify-center px-4 py-2.5 text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                    >
                      Use Tool
                    </Link>
                  ) : (
                    <span className="inline-flex w-full items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md border border-gray-200">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 