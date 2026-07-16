import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 text-lg">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <Link to="/" className="btn-primary inline-block">
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
