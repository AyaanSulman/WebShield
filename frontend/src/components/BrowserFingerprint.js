import { useState, useEffect } from 'react';

const BrowserFingerprint = ({ onFingerprintComplete }) => {
  const [fingerprint, setFingerprint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateFingerprint = async () => {
      try {
        const fp = {
          userAgent: navigator.userAgent,
          language: navigator.language,
          languages: navigator.languages,
          platform: navigator.platform,
          cookieEnabled: navigator.cookieEnabled,
          doNotTrack: navigator.doNotTrack,
          hardwareConcurrency: navigator.hardwareConcurrency,
          maxTouchPoints: navigator.maxTouchPoints,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          screenColorDepth: window.screen.colorDepth,
          timezoneOffset: new Date().getTimezoneOffset(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          webGL: getWebGLInfo(),
          canvas: getCanvasFingerprint(),
          localStorage: isLocalStorageAvailable(),
          sessionStorage: isSessionStorageAvailable(),
          indexedDB: isIndexedDBAvailable(),
          adBlocker: await detectAdBlocker(),
          plugins: getPluginInfo(),
          touchSupport: 'ontouchstart' in window,
          webRTC: await detectWebRTC(),
          battery: await getBatteryInfo(),
          connection: getConnectionInfo(),
          deviceMemory: navigator.deviceMemory || 'unknown',
          permissions: await getPermissions()
        };

        setFingerprint(fp);
        onFingerprintComplete(fp);
      } catch (error) {
        console.error('Error generating fingerprint:', error);
      } finally {
        setLoading(false);
      }
    };

    generateFingerprint();
  }, [onFingerprintComplete]);

  const getWebGLInfo = () => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return 'not supported';
      
      const renderer = gl.getParameter(gl.RENDERER);
      const vendor = gl.getParameter(gl.VENDOR);
      return `${vendor} - ${renderer}`;
    } catch (e) {
      return 'error';
    }
  };

  const getCanvasFingerprint = () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('WebShield fingerprint test 🔒', 2, 2);
      return canvas.toDataURL().slice(-50);
    } catch (e) {
      return 'error';
    }
  };

  const isLocalStorageAvailable = () => {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSessionStorageAvailable = () => {
    try {
      sessionStorage.setItem('test', 'test');
      sessionStorage.removeItem('test');
      return true;
    } catch (e) {
      return false;
    }
  };

  const isIndexedDBAvailable = () => {
    return 'indexedDB' in window;
  };

  const detectAdBlocker = () => {
    return new Promise((resolve) => {
      const testAd = document.createElement('div');
      testAd.innerHTML = '&nbsp;';
      testAd.className = 'adsbox';
      testAd.style.position = 'absolute';
      testAd.style.left = '-10000px';
      document.body.appendChild(testAd);
      
      setTimeout(() => {
        const blocked = testAd.offsetHeight === 0;
        document.body.removeChild(testAd);
        resolve(blocked);
      }, 100);
    });
  };

  const getPluginInfo = () => {
    try {
      return Array.from(navigator.plugins).map(plugin => plugin.name);
    } catch (e) {
      return [];
    }
  };

  const detectWebRTC = () => {
    return new Promise((resolve) => {
      try {
        const RTCPeerConnection = window.RTCPeerConnection || 
                                 window.mozRTCPeerConnection || 
                                 window.webkitRTCPeerConnection;
        if (!RTCPeerConnection) {
          resolve(false);
          return;
        }
        
        const pc = new RTCPeerConnection();
        resolve(true);
        pc.close();
      } catch (e) {
        resolve(false);
      }
    });
  };

  const getBatteryInfo = () => {
    return new Promise((resolve) => {
      if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
          resolve({
            charging: battery.charging,
            level: Math.round(battery.level * 100)
          });
        }).catch(() => resolve('not available'));
      } else {
        resolve('not supported');
      }
    });
  };

  const getConnectionInfo = () => {
    try {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection) {
        return {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt
        };
      }
      return 'not available';
    } catch (e) {
      return 'error';
    }
  };

  const getPermissions = async () => {
    const permissions = {};
    const permissionNames = ['camera', 'microphone', 'geolocation', 'notifications'];
    
    for (const permission of permissionNames) {
      try {
        const result = await navigator.permissions.query({ name: permission });
        permissions[permission] = result.state;
      } catch (e) {
        permissions[permission] = 'not available';
      }
    }
    
    return permissions;
  };

  const getSecurityScore = () => {
    if (!fingerprint) return 0;
    
    let score = 0;
    const maxScore = 100;
    
    // Positive security indicators
    if (fingerprint.cookieEnabled) score += 10;
    if (fingerprint.localStorage) score += 10;
    if (fingerprint.sessionStorage) score += 10;
    if (fingerprint.doNotTrack === '1') score += 15;
    if (fingerprint.adBlocker) score += 20;
    if (fingerprint.webRTC === false) score += 15; // WebRTC can leak IP
    if (fingerprint.plugins.length < 5) score += 10; // Fewer plugins = less attack surface
    if (fingerprint.permissions.camera === 'denied') score += 5;
    if (fingerprint.permissions.microphone === 'denied') score += 5;
    
    return Math.min(score, maxScore);
  };

  const getSecurityLevel = (score) => {
    if (score >= 80) return { level: 'High', color: 'text-retro-green', bgColor: 'bg-retro-green' };
    if (score >= 60) return { level: 'Medium', color: 'text-retro-yellow', bgColor: 'bg-retro-yellow' };
    if (score >= 40) return { level: 'Low', color: 'text-retro-orange', bgColor: 'bg-retro-orange' };
    return { level: 'Critical', color: 'text-retro-red', bgColor: 'bg-retro-red' };
  };

  if (loading) {
    return (
      <div className="retro-card">
        <h3 className="text-xl font-retro font-bold mb-4 text-retro-cyan glow-text">
          🔍 Browser Fingerprint Analysis
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-retro-blue"></div>
          <span className="ml-3">Analyzing browser security...</span>
        </div>
      </div>
    );
  }

  const securityScore = getSecurityScore();
  const securityLevel = getSecurityLevel(securityScore);

  return (
    <div className="retro-card">
      <h3 className="text-xl font-retro font-bold mb-4 text-retro-cyan glow-text">
        🔍 Browser Fingerprint Analysis
      </h3>
      
      {/* Security Score */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">Browser Security Score</span>
          <span className={`font-bold ${securityLevel.color}`}>
            {securityScore}/100 ({securityLevel.level})
          </span>
        </div>
        <div className="progress-bar">
          <div 
            className={`progress-fill ${securityLevel.bgColor}`}
            style={{ width: `${securityScore}%` }}
          ></div>
        </div>
      </div>

      {/* Key Security Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Cookies Enabled:</span>
            <span className={fingerprint.cookieEnabled ? 'text-retro-green' : 'text-retro-red'}>
              {fingerprint.cookieEnabled ? '✓' : '✗'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Do Not Track:</span>
            <span className={fingerprint.doNotTrack === '1' ? 'text-retro-green' : 'text-retro-yellow'}>
              {fingerprint.doNotTrack === '1' ? '✓ Enabled' : '⚠ Disabled'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Ad Blocker:</span>
            <span className={fingerprint.adBlocker ? 'text-retro-green' : 'text-retro-yellow'}>
              {fingerprint.adBlocker ? '✓ Active' : '⚠ Not detected'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>WebRTC:</span>
            <span className={!fingerprint.webRTC ? 'text-retro-green' : 'text-retro-orange'}>
              {fingerprint.webRTC ? '⚠ Enabled' : '✓ Disabled'}
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Local Storage:</span>
            <span className={fingerprint.localStorage ? 'text-retro-green' : 'text-retro-red'}>
              {fingerprint.localStorage ? '✓' : '✗'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Touch Support:</span>
            <span className="text-retro-blue">
              {fingerprint.touchSupport ? '✓ Yes' : '✗ No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Plugins Count:</span>
            <span className={fingerprint.plugins.length < 5 ? 'text-retro-green' : 'text-retro-yellow'}>
              {fingerprint.plugins.length}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Device Memory:</span>
            <span className="text-retro-blue">
              {fingerprint.deviceMemory !== 'unknown' ? `${fingerprint.deviceMemory}GB` : 'Unknown'}
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Info (Collapsible) */}
      <details className="mt-4">
        <summary className="cursor-pointer text-retro-cyan hover:text-retro-blue transition-colors">
          View Detailed Fingerprint Data
        </summary>
        <div className="mt-3 p-3 bg-dark-accent rounded text-xs space-y-1">
          <div><strong>User Agent:</strong> {fingerprint.userAgent}</div>
          <div><strong>Platform:</strong> {fingerprint.platform}</div>
          <div><strong>Language:</strong> {fingerprint.language}</div>
          <div><strong>Screen:</strong> {fingerprint.screenResolution} ({fingerprint.screenColorDepth}-bit)</div>
          <div><strong>Timezone:</strong> {fingerprint.timezone}</div>
          <div><strong>WebGL:</strong> {fingerprint.webGL}</div>
          <div><strong>Canvas:</strong> {fingerprint.canvas}</div>
          {fingerprint.connection !== 'not available' && (
            <div><strong>Connection:</strong> {JSON.stringify(fingerprint.connection)}</div>
          )}
        </div>
      </details>
    </div>
  );
};

export default BrowserFingerprint;
