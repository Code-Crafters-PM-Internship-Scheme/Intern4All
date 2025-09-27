import React, { useState } from 'react';
import './LoginPage.css'; // Import the CSS for this page

const LoginPage = ({ onLoginSuccess, onSignUpClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- Handles regular email/password login (SIMULATED) ---
  const handleRegularLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsLoading(true);
    setError('');

    // --- START: SIMULATED BACKEND INTERACTION (NOT SECURE FOR PRODUCTION) ---
    // In a real application, you would send a request to your backend login API:
    /*
    try {
      const response = await fetch('YOUR_BACKEND_LOGIN_ENDPOINT', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json(); // Assuming backend returns { token, user: { name } }
      if (response.ok) {
        // Store the token and user info (e.g., in localStorage or a more secure state management)
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userName', data.user.name);
        onLoginSuccess(data.user.name); // Call the success handler with user's name
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Network error or server unavailable. Please try again later.');
    }
    */

    // --- SIMULATED SUCCESS FOR DEMO (DO NOT USE IN PRODUCTION) ---
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    if (email === 'test@example.com' && password === 'password123') {
      const userName = "AMAN YADAV"; // Placeholder name, would come from backend
      onLoginSuccess(userName); // Call the success handler with a placeholder name
    } else {
      setError('Invalid email or password. (Hint: test@example.com / password123)');
    }
    // --- END: SIMULATED BACKEND INTERACTION ---

    setIsLoading(false);
  };

  // --- Handles Google Login (SIMULATED) ---
  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);

    // --- START: SIMULATED GOOGLE LOGIN (NOT SECURE FOR PRODUCTION) ---
    // In a real application, this would initiate a Google OAuth flow:
    // 1. Redirect user to Google's authentication page.
    // 2. Google authenticates the user and redirects back to your app with a token/code.
    // 3. Your backend or frontend processes this to get user info.
    // 4. onLoginSuccess(userNameFromGoogle);

    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    const userName = "AMAN YADAV (Google)"; // Placeholder name, would come from Google profile
    onLoginSuccess(userName); // Call the success handler with a placeholder name
    // --- END: SIMULATED GOOGLE LOGIN ---

    setIsLoading(false);
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-logo">
          {/* Replace this with your actual SkillSync/Intern4All logo image */}
          <img src="https://assets.website-files.com/626b91c80b5557ce6782f9df/626b91c80b55570bb182fa53_SkillSync-Full-Logo-Standard-White.svg" alt="Intern4All Logo" />
        </div>
        <h2 className="login-title">Welcome to Intern4All</h2>
        <p className="login-subtitle">Sign in to continue</p>

        <button className="google-login-btn" onClick={handleGoogleLogin} disabled={isLoading}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" alt="Google Logo" className="google-icon"/>
          Continue with Google
        </button>

        <div className="or-divider">OR</div>

        <form onSubmit={handleRegularLogin} className="login-form">
          <div className="form-group">
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {error && <p className="login-error-message">{error}</p>}

          <button type="submit" className="signin-btn" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="login-links">
          <a href="#" onClick={(e) => {e.preventDefault(); alert('Forgot password functionality not implemented');}} className="forgot-password-link">Forgot password?</a>
          <span> • </span>
          <a href="#" onClick={(e) => {e.preventDefault(); onSignUpClick();}} className="signup-link">Need an account? Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;