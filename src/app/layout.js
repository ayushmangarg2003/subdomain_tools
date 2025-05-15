import './globals.css'
import Navbar from '../components/Navbar'

export const metadata = {
  title: 'ToolHub - Web Utilities',
  description: 'A collection of useful web tools and utilities',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
        
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <span className="text-lg font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ToolHub
                </span>
                <span className="mx-2 text-gray-500">•</span>
                <span className="text-sm text-gray-500">Web Utilities</span>
              </div>
              <p className="text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} ToolHub. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
} 