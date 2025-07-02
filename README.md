# WebShield - Personal Cybersecurity Dashboard

A modern, retro-styled cybersecurity dashboard that helps users assess their digital security posture through comprehensive analysis of email breaches, password strength, and browser fingerprinting.

## Features

### 🔍 Security Analysis
- **Email Breach Detection**: Uses HaveIBeenPwned API to check if your email appears in known data breaches
- **Password Strength Assessment**: Real-time password analysis using zxcvbn.js with visual feedback
- **Browser Fingerprinting**: Comprehensive browser security analysis including:
  - Cookie and storage capabilities
  - Ad blocker detection
  - WebRTC detection
  - Plugin enumeration
  - Hardware fingerprinting
  - Permission status

### 🛡️ Security Recommendations
- Personalized security recommendations based on analysis results
- Priority-based action items (Critical, Warning, Success, Info)
- Overall security score calculation
- Actionable steps to improve security posture

### 🎨 Modern Retro Design
- Cyberpunk-inspired UI with neon colors and glowing effects
- Fully responsive design optimized for mobile and desktop
- Tailwind CSS with custom retro color palette
- Smooth animations and transitions

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework with custom retro theme
- **zxcvbn** - Password strength estimation
- **Axios** - HTTP client for API requests

### Backend
- **Flask** - Python web framework
- **Flask-CORS** - Cross-origin resource sharing
- **Requests** - HTTP library for API calls
- **HaveIBeenPwned API** - Breach and password checking

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- Python 3.7+
- pip (Python package manager)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Run the Flask server:
```bash
python app.py
```

The backend will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## Usage

1. **Start both servers** (backend on port 5000, frontend on port 3000)
2. **Open your browser** and navigate to `http://localhost:3000`
3. **Enter your email and password** in the security assessment form
4. **Review the results**:
   - Email breach status
   - Password strength analysis
   - Browser fingerprint security score
   - Personalized security recommendations

## API Endpoints

### `POST /api/check-security`
Analyzes email and password security.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "userpassword"
}
```

**Response:**
```json
{
  "email_breaches": [...],
  "password_pwned_count": 0,
  "recommendations": [...],
  "timestamp": "2024-01-01T00:00:00"
}
```

### `GET /api/health`
Health check endpoint.

## Security Features

### Privacy Protection
- Passwords are never stored or logged
- Email addresses are only used for breach checking
- All data processing happens locally or through secure APIs
- No personal data is retained after analysis

### Browser Fingerprinting Detection
- Detects tracking capabilities
- Identifies security-relevant browser features
- Provides recommendations for privacy enhancement

### Password Security
- Real-time strength analysis
- Breach database checking (using k-anonymity)
- Detailed feedback and improvement suggestions

## Customization

### Styling
The app uses a custom Tailwind CSS configuration with retro/cyberpunk colors:
- `retro-pink`, `retro-purple`, `retro-blue`, `retro-cyan`
- `retro-green`, `retro-yellow`, `retro-orange`, `retro-red`
- Dark theme with `dark-bg`, `dark-card`, `dark-accent`

### Adding New Security Checks
1. Add new analysis functions to `backend/app.py`
2. Create corresponding React components in `frontend/src/components/`
3. Update the main App component to integrate new features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Disclaimer

This tool is for educational and personal security assessment purposes. While it uses reputable APIs and security practices, it should not be considered a comprehensive security audit. Always follow additional security best practices and consult with security professionals for critical applications.

## Acknowledgments

- [HaveIBeenPwned](https://haveibeenpwned.com/) for breach data
- [zxcvbn](https://github.com/dropbox/zxcvbn) for password strength estimation
- [Tailwind CSS](https://tailwindcss.com/) for styling framework
