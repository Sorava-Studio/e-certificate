export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="font-bold text-4xl">Login Page</h1>
        <p className="mt-4 text-gray-600">
          This is a simple login page to test middleware.
        </p>
        <p className="mt-2 text-gray-500 text-sm">
          If you're authenticated, you should be redirected to /dashboard
        </p>
      </div>
    </div>
  );
}
