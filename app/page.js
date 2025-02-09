// app/page.js or wherever you want to use the LoginPage component
import LoginPage from './components/Login';  // Default import (without curly braces)

export default function Admin() {
  return (
    <div>
      <LoginPage /> {/* Using the LoginPage component */}
    </div>
  );
}
