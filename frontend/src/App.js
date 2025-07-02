import React, { useState, useCallback } from 'react';
import axios from 'axios';
import PasswordStrength from './components/PasswordStrength';
import BrowserFingerprint from './components/BrowserFingerprint';
import SecurityRecommendations from './components/SecurityRecommendations';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [browserFingerprint, setBrowserFingerprint] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordStrengthChange = useCallback((strength) => {
    setPasswordStrength(strength);
  }, []);

  const handleFingerprintComplete = useCallback((fingerprint) => {
    setBrowserFingerprint(fingerprint);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/check-security', {
        email: email.trim(),
        password: password
      });

      setResults(response.data);
    } catch (err) {
      console.error('Error checking security:', err);
      setError(
        err.response?.data?.error || 
        'Failed to check security. Please make sure the backend server is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setResults(null);
    setPasswordStrength(null);
    setError('');
  };

  const getBreachSummary = () => {
    if (!results) return null;
    
    const breachCount = results.email_breaches?.length || 0;
    const passwordPwned = results.password_pwned_count > 0;
    
    let status = 'good';
    let message = 'Your security looks good!';
    let icon = '🛡️';
    
    if (breachCount > 0 && passwordPwned) {
      status = 'critical';
      message = 'Critical security issues detected!';
      icon = '🚨';
    } else if (breachCount > 0 || passwordPwned) {
      status = 'warning';
      message = 'Some security concerns found';
      icon = '⚠️';
    }
    
    return { status, message, icon, breachCount, passwordPwned };
  };

  const summary = getBreachSummary();

  return (
    <div className="min-h-screen bg-gradient-cyber cyber-grid">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-retro-purple/20 to-retro-blue/20"></div>
        <div className="relative container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-retro font-black text-transparent bg-clip-text bg-gradient-to-r from-retro-cyan to-retro-purple glow-text mb-4">
              WebShield
            </h1>
            <p className="text-xl md:text-2xl text-retro-blue font-mono">
              Personal Cybersecurity Dashboard
            </p>
            <div className="mt-4 flex justify-center space-x-4 text-sm">
              <span className="px-3 py-1 bg-retro-blue/20 rounded-full border border-retro-blue/30">
                🔍 Breach Detection
              </span>
              <span className="px-3 py-1 bg-retro-purple/20 rounded-full border border-retro-purple/30">
                🔐 Password Analysis
              </span>
              <span className="px-3 py-1 bg-retro-cyan/20 rounded-full border border-retro-cyan/30">
                🖥️ Browser Security
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Security Check Form */}
        <div className="retro-card max-w-2xl mx-auto">
          <h2 className="text-2xl font-retro font-bold mb-6 text-retro-cyan glow-text">
            🔐 Security Assessment
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-retro-blue">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="retro-input"
                disabled={loading}
              />
              <p className="text-xs text-gray-400 mt-1">
                We'll check if your email appears in known data breaches
              </p>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-retro-blue">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a password to analyze"
                  className="retro-input pr-12"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-retro-blue hover:text-retro-cyan transition-colors"
                  disabled={loading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                We'll analyze password strength and check for breaches (passwords are not stored)
              </p>
            </div>

            {/* Password Strength Component */}
            {password && (
              <PasswordStrength 
                password={password} 
                onStrengthChange={handlePasswordStrengthChange}
              />
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-retro-red/20 border border-retro-red/50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <span className="text-retro-red text-lg">❌</span>
                  <span className="text-retro-red font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading || !email || !password}
                className="retro-button flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Analyzing Security...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>🔍</span>
                    <span>Check Security</span>
                  </div>
                )}
              </button>
              
              {results && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-dark-accent border border-retro-purple/30 rounded-lg font-semibold transition-all duration-300 hover:border-retro-purple hover:bg-retro-purple/10"
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Results Summary */}
        {summary && (
          <div className="max-w-4xl mx-auto">
            <div className={`retro-card border-2 ${
              summary.status === 'critical' ? 'border-retro-red' :
              summary.status === 'warning' ? 'border-retro-orange' :
              'border-retro-green'
            }`}>
              <div className="text-center">
                <div className="text-6xl mb-4">{summary.icon}</div>
                <h3 className={`text-2xl font-retro font-bold mb-2 ${
                  summary.status === 'critical' ? 'text-retro-red' :
                  summary.status === 'warning' ? 'text-retro-orange' :
                  'text-retro-green'
                }`}>
                  {summary.message}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl mb-2">📧</div>
                    <div className="text-sm text-gray-300">Email Breaches</div>
                    <div className={`text-xl font-bold ${summary.breachCount > 0 ? 'text-retro-red' : 'text-retro-green'}`}>
                      {summary.breachCount}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🔐</div>
                    <div className="text-sm text-gray-300">Password Status</div>
                    <div className={`text-xl font-bold ${summary.passwordPwned ? 'text-retro-red' : 'text-retro-green'}`}>
                      {summary.passwordPwned ? 'Compromised' : 'Safe'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">💪</div>
                    <div className="text-sm text-gray-300">Password Strength</div>
                    <div className={`text-xl font-bold ${
                      !passwordStrength ? 'text-gray-400' :
                      passwordStrength.score >= 3 ? 'text-retro-green' :
                      passwordStrength.score >= 2 ? 'text-retro-yellow' :
                      'text-retro-red'
                    }`}>
                      {!passwordStrength ? 'N/A' :
                       passwordStrength.score >= 3 ? 'Strong' :
                       passwordStrength.score >= 2 ? 'Fair' : 'Weak'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Browser Fingerprint */}
        <div className="max-w-4xl mx-auto">
          <BrowserFingerprint onFingerprintComplete={handleFingerprintComplete} />
        </div>

        {/* Security Recommendations */}
        {results && (
          <div className="max-w-4xl mx-auto">
            <SecurityRecommendations 
              recommendations={results.recommendations}
              loading={loading}
            />
          </div>
        )}

        {/* Additional Security Tips */}
        <div className="max-w-4xl mx-auto retro-card">
          <h3 className="text-xl font-retro font-bold mb-4 text-retro-cyan glow-text">
            🎯 Pro Security Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🔑</span>
                <div>
                  <h4 className="font-bold text-retro-blue">Use Unique Passwords</h4>
                  <p className="text-sm text-gray-300">Never reuse passwords across different accounts. Use a password manager to generate and store unique passwords.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🔐</span>
                <div>
                  <h4 className="font-bold text-retro-blue">Enable 2FA Everywhere</h4>
                  <p className="text-sm text-gray-300">Two-factor authentication adds an extra layer of security to your accounts, even if your password is compromised.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">📱</span>
                <div>
                  <h4 className="font-bold text-retro-blue">Keep Software Updated</h4>
                  <p className="text-sm text-gray-300">Regular updates patch security vulnerabilities. Enable automatic updates when possible.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🌐</span>
                <div>
                  <h4 className="font-bold text-retro-blue">Use HTTPS Websites</h4>
                  <p className="text-sm text-gray-300">Always look for the lock icon in your browser's address bar, especially when entering sensitive information.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">📧</span>
                <div>
                  <h4 className="font-bold text-retro-blue">Beware of Phishing</h4>
                  <p className="text-sm text-gray-300">Be cautious of suspicious emails, links, and attachments. When in doubt, verify the sender through another channel.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🔍</span>
                <div>
                  <h4 className="font-bold text-retro-blue">Regular Security Checkups</h4>
                  <p className="text-sm text-gray-300">Periodically review your account activity, check for data breaches, and update your security settings.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-dark-card border-t border-retro-blue/30 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-retro-cyan font-retro font-bold text-xl mb-2">WebShield</div>
            <p className="text-gray-400 text-sm mb-4">
              Your personal cybersecurity dashboard. Stay safe online.
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <span className="text-retro-blue">🔒 Privacy First</span>
              <span className="text-retro-purple">🛡️ Security Focused</span>
              <span className="text-retro-cyan">⚡ Real-time Analysis</span>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Passwords are never stored. All checks are performed securely.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
