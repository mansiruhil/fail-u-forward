import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 text-center px-6">
      {/* Big 404 */}
      <h1 className="text-8xl font-extrabold text-red-600 drop-shadow-lg">404</h1>
      
      {/* Message */}
      <h2 className="mt-4 text-3xl font-bold text-gray-800">Page Not Found</h2>
      <p className="mt-2 text-gray-600 max-w-lg">
        Oops! The page you are looking for doesn’t exist or may have been moved.
        Don’t worry, you can always head back to the homepage.
      </p>

      {/* Buttons */}
      <div className="mt-6 flex gap-4">
        <Link href="/">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition duration-200">
            Go Home
          </button>
        </Link>
        <Link href="/contact">
          <button className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl shadow-md hover:bg-gray-300 transition duration-200">
            Contact Support
          </button>
        </Link>
      </div>

      {/* Footer Note */}
      <p className="mt-10 text-sm text-gray-500">
        © {new Date().getFullYear()} Fail U Forward. All rights reserved.
      </p>
    </div>
  );
}
