  export default function NotFound() {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <h1 className="text-4xl font-bold text-gray-900">Work In Progress</h1>
        <p className="text-lg mt-2 text-gray-500">Check later for the finished result</p>
        <a
          href="/"
          className="mt-4 text-sm font-medium text-primary underline hover:no-underline"
        >
          Go back to the homepage
        </a>
      </div>
    );
  }
  