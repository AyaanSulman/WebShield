import React from 'react';

const SecurityRecommendations = ({ recommendations, loading }) => {
  if (loading) {
    return (
      <div className="retro-card">
        <h3 className="text-xl font-retro font-bold mb-4 text-retro-cyan glow-text">
          🛡️ Security Recommendations
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-retro-blue"></div>
          <span className="ml-3">Analyzing security recommendations...</span>
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  const getIconForType = (type) => {
    switch (type) {
      case 'critical': return '🚨';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      case 'info': return 'ℹ️';
      default: return '📋';
    }
  };

  const getColorForType = (type) => {
    switch (type) {
      case 'critical': return 'border-retro-red bg-retro-red/10';
      case 'warning': return 'border-retro-orange bg-retro-orange/10';
      case 'success': return 'border-retro-green bg-retro-green/10';
      case 'info': return 'border-retro-blue bg-retro-blue/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getTextColorForType = (type) => {
    switch (type) {
      case 'critical': return 'text-retro-red';
      case 'warning': return 'text-retro-orange';
      case 'success': return 'text-retro-green';
      case 'info': return 'text-retro-blue';
      default: return 'text-gray-300';
    }
  };

  const criticalRecommendations = recommendations.filter(r => r.type === 'critical');
  const warningRecommendations = recommendations.filter(r => r.type === 'warning');
  const successRecommendations = recommendations.filter(r => r.type === 'success');
  const infoRecommendations = recommendations.filter(r => r.type === 'info');

  const getOverallSecurityScore = () => {
    const criticalCount = criticalRecommendations.length;
    const warningCount = warningRecommendations.length;
    const successCount = successRecommendations.length;
    
    // Base score starts at 100
    let score = 100;
    
    // Deduct points for issues
    score -= criticalCount * 30; // Critical issues are worth -30 points each
    score -= warningCount * 15;  // Warning issues are worth -15 points each
    
    // Add points for successes (but cap the total)
    score += successCount * 10;  // Success items are worth +10 points each
    
    // Ensure score is between 0 and 100
    return Math.max(0, Math.min(100, score));
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-retro-green';
    if (score >= 60) return 'text-retro-yellow';
    if (score >= 40) return 'text-retro-orange';
    return 'text-retro-red';
  };

  const getScoreLevel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const overallScore = getOverallSecurityScore();

  return (
    <div className="retro-card">
      <h3 className="text-xl font-retro font-bold mb-4 text-retro-cyan glow-text">
        🛡️ Security Recommendations
      </h3>

      {/* Overall Security Score */}
      <div className="mb-6 p-4 bg-dark-accent rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-lg">Overall Security Score</span>
          <span className={`font-bold text-xl ${getScoreColor(overallScore)}`}>
            {overallScore}/100 ({getScoreLevel(overallScore)})
          </span>
        </div>
        <div className="progress-bar">
          <div 
            className={`progress-fill ${overallScore >= 80 ? 'bg-retro-green' : 
                                       overallScore >= 60 ? 'bg-retro-yellow' : 
                                       overallScore >= 40 ? 'bg-retro-orange' : 'bg-retro-red'}`}
            style={{ width: `${overallScore}%` }}
          ></div>
        </div>
      </div>

      {/* Critical Issues First */}
      {criticalRecommendations.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-bold text-retro-red mb-3 flex items-center">
            🚨 Critical Issues ({criticalRecommendations.length})
          </h4>
          <div className="space-y-3">
            {criticalRecommendations.map((rec, index) => (
              <div key={`critical-${index}`} className={`border-l-4 p-4 rounded-r-lg ${getColorForType(rec.type)}`}>
                <div className="flex items-start space-x-3">
                  <span className="text-xl">{getIconForType(rec.type)}</span>
                  <div className="flex-1">
                    <h5 className={`font-bold ${getTextColorForType(rec.type)}`}>
                      {rec.title}
                    </h5>
                    <p className="text-gray-300 text-sm mt-1">{rec.description}</p>
                    <p className="text-retro-cyan text-sm mt-2 font-medium">
                      Action: {rec.action}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warning Issues */}
      {warningRecommendations.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-bold text-retro-orange mb-3 flex items-center">
            ⚠️ Warnings ({warningRecommendations.length})
          </h4>
          <div className="space-y-3">
            {warningRecommendations.map((rec, index) => (
              <div key={`warning-${index}`} className={`border-l-4 p-4 rounded-r-lg ${getColorForType(rec.type)}`}>
                <div className="flex items-start space-x-3">
                  <span className="text-xl">{getIconForType(rec.type)}</span>
                  <div className="flex-1">
                    <h5 className={`font-bold ${getTextColorForType(rec.type)}`}>
                      {rec.title}
                    </h5>
                    <p className="text-gray-300 text-sm mt-1">{rec.description}</p>
                    <p className="text-retro-cyan text-sm mt-2 font-medium">
                      Action: {rec.action}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Items */}
      {successRecommendations.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-bold text-retro-green mb-3 flex items-center">
            ✅ Good Security Practices ({successRecommendations.length})
          </h4>
          <div className="space-y-3">
            {successRecommendations.map((rec, index) => (
              <div key={`success-${index}`} className={`border-l-4 p-4 rounded-r-lg ${getColorForType(rec.type)}`}>
                <div className="flex items-start space-x-3">
                  <span className="text-xl">{getIconForType(rec.type)}</span>
                  <div className="flex-1">
                    <h5 className={`font-bold ${getTextColorForType(rec.type)}`}>
                      {rec.title}
                    </h5>
                    <p className="text-gray-300 text-sm mt-1">{rec.description}</p>
                    <p className="text-retro-cyan text-sm mt-2 font-medium">
                      {rec.action}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* General Information */}
      {infoRecommendations.length > 0 && (
        <div>
          <h4 className="text-lg font-bold text-retro-blue mb-3 flex items-center">
            ℹ️ General Security Tips ({infoRecommendations.length})
          </h4>
          <div className="space-y-3">
            {infoRecommendations.map((rec, index) => (
              <div key={`info-${index}`} className={`border-l-4 p-4 rounded-r-lg ${getColorForType(rec.type)}`}>
                <div className="flex items-start space-x-3">
                  <span className="text-xl">{getIconForType(rec.type)}</span>
                  <div className="flex-1">
                    <h5 className={`font-bold ${getTextColorForType(rec.type)}`}>
                      {rec.title}
                    </h5>
                    <p className="text-gray-300 text-sm mt-1">{rec.description}</p>
                    <p className="text-retro-cyan text-sm mt-2 font-medium">
                      {rec.action}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Action Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-retro-purple/20 to-retro-blue/20 rounded-lg border border-retro-purple/30">
        <h5 className="font-bold text-retro-purple mb-2">🎯 Priority Actions</h5>
        <div className="text-sm space-y-1">
          {criticalRecommendations.length > 0 && (
            <div className="text-retro-red">
              • Address {criticalRecommendations.length} critical security issue{criticalRecommendations.length > 1 ? 's' : ''} immediately
            </div>
          )}
          {warningRecommendations.length > 0 && (
            <div className="text-retro-orange">
              • Review {warningRecommendations.length} warning{warningRecommendations.length > 1 ? 's' : ''} when possible
            </div>
          )}
          <div className="text-retro-cyan">
            • Consider implementing general security best practices
          </div>
          <div className="text-retro-green">
            • Regularly monitor your accounts and run security checks
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityRecommendations;
