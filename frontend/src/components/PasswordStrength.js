import { useState, useEffect } from 'react';
import zxcvbn from 'zxcvbn';

const PasswordStrength = ({ password, onStrengthChange }) => {
  const [strength, setStrength] = useState(null);

  useEffect(() => {
    if (password) {
      const result = zxcvbn(password);
      setStrength(result);
      onStrengthChange(result);
    } else {
      setStrength(null);
      onStrengthChange(null);
    }
  }, [password, onStrengthChange]);

  if (!password || !strength) {
    return null;
  }

  const getStrengthColor = (score) => {
    const colors = [
      'bg-retro-red',    // 0 - Very Weak
      'bg-retro-orange', // 1 - Weak
      'bg-retro-yellow', // 2 - Fair
      'bg-retro-blue',   // 3 - Good
      'bg-retro-green'   // 4 - Strong
    ];
    return colors[score] || 'bg-gray-500';
  };

  const getStrengthText = (score) => {
    const texts = [
      'Very Weak',
      'Weak',
      'Fair',
      'Good',
      'Strong'
    ];
    return texts[score] || 'Unknown';
  };

  const getStrengthTextColor = (score) => {
    const colors = [
      'text-retro-red',
      'text-retro-orange',
      'text-retro-yellow',
      'text-retro-blue',
      'text-retro-green'
    ];
    return colors[score] || 'text-gray-500';
  };

  const formatTime = (seconds) => {
    if (seconds < 1) return 'instantly';
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 2592000) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 31536000) return `${Math.round(seconds / 2592000)} months`;
    return `${Math.round(seconds / 31536000)} years`;
  };

  return (
    <div className="mt-4 space-y-3">
      {/* Strength Bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Password Strength</span>
          <span className={`text-sm font-bold ${getStrengthTextColor(strength.score)}`}>
            {getStrengthText(strength.score)}
          </span>
        </div>
        <div className="progress-bar">
          <div 
            className={`progress-fill ${getStrengthColor(strength.score)}`}
            style={{ width: `${((strength.score + 1) / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Crack Time Estimates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-300">Online (throttled):</span>
            <span className="text-retro-cyan">
              {formatTime(strength.crack_times_seconds.online_throttling_100_per_hour)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Online (unthrottled):</span>
            <span className="text-retro-cyan">
              {formatTime(strength.crack_times_seconds.online_no_throttling_10_per_second)}
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-300">Offline (slow):</span>
            <span className="text-retro-cyan">
              {formatTime(strength.crack_times_seconds.offline_slow_hashing_1e4_per_second)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Offline (fast):</span>
            <span className="text-retro-cyan">
              {formatTime(strength.crack_times_seconds.offline_fast_hashing_1e10_per_second)}
            </span>
          </div>
        </div>
      </div>

      {/* Feedback */}
      {(strength.feedback.warning || strength.feedback.suggestions.length > 0) && (
        <div className="bg-dark-accent rounded-lg p-3 space-y-2">
          {strength.feedback.warning && (
            <div className="flex items-start space-x-2">
              <span className="text-retro-orange text-lg">⚠️</span>
              <span className="text-sm text-retro-orange">{strength.feedback.warning}</span>
            </div>
          )}
          {strength.feedback.suggestions.length > 0 && (
            <div className="space-y-1">
              <div className="text-retro-blue text-sm font-medium">💡 Suggestions:</div>
              {strength.feedback.suggestions.map((suggestion, index) => (
                <div key={index} className="text-sm text-gray-300 ml-6">
                  • {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pattern Analysis */}
      {strength.sequence && strength.sequence.length > 0 && (
        <details className="text-sm">
          <summary className="cursor-pointer text-retro-cyan hover:text-retro-blue transition-colors">
            View Pattern Analysis
          </summary>
          <div className="mt-2 space-y-1">
            {strength.sequence.map((seq, index) => (
              <div key={index} className="bg-dark-accent rounded p-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Pattern:</span>
                  <span className="text-retro-yellow">{seq.pattern}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Token:</span>
                  <span className="text-retro-blue font-mono">{seq.token}</span>
                </div>
                {seq.dictionary_name && (
                  <div className="flex justify-between">
                    <span className="text-gray-300">Dictionary:</span>
                    <span className="text-retro-orange">{seq.dictionary_name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
};

export default PasswordStrength;
