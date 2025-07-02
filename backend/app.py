from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import hashlib
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

def check_pwned_password(password):
    """Check if password has been pwned using HaveIBeenPwned API"""
    # Hash the password with SHA-1
    sha1_hash = hashlib.sha1(password.encode('utf-8')).hexdigest().upper()
    prefix = sha1_hash[:5]
    suffix = sha1_hash[5:]
    
    try:
        # Query the API with the first 5 characters
        response = requests.get(f'https://api.pwnedpasswords.com/range/{prefix}', timeout=10)
        response.raise_for_status()
        
        # Check if our suffix appears in the response
        for line in response.text.splitlines():
            hash_suffix, count = line.split(':')
            if hash_suffix == suffix:
                return int(count)
        return 0
    except Exception as e:
        print(f"Error checking password: {e}")
        return None

def check_pwned_email(email):
    """Check if email has been in data breaches using HaveIBeenPwned API"""
    try:
        headers = {
            'User-Agent': 'WebShield-CyberSecurity-Dashboard'
        }
        response = requests.get(
            f'https://haveibeenpwned.com/api/v3/breachedaccount/{email}',
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            return response.json()
        elif response.status_code == 404:
            return []
        else:
            return None
    except Exception as e:
        print(f"Error checking email: {e}")
        return None

@app.route('/api/check-security', methods=['POST'])
def check_security():
    data = request.get_json()
    email = data.get('email', '').strip()
    password = data.get('password', '')
    
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    
    # Check email breaches
    email_breaches = check_pwned_email(email)
    
    # Check password breaches
    password_pwned_count = check_pwned_password(password)
    
    # Generate security recommendations
    recommendations = generate_recommendations(email_breaches, password_pwned_count)
    
    return jsonify({
        'email_breaches': email_breaches,
        'password_pwned_count': password_pwned_count,
        'recommendations': recommendations,
        'timestamp': datetime.now().isoformat()
    })

def generate_recommendations(email_breaches, password_pwned_count):
    """Generate security recommendations based on results"""
    recommendations = []
    
    # Email breach recommendations
    if email_breaches is None:
        recommendations.append({
            'type': 'warning',
            'title': 'Email Check Failed',
            'description': 'Unable to check email breaches. Try again later.',
            'action': 'Retry the check or manually search on HaveIBeenPwned.com'
        })
    elif len(email_breaches) > 0:
        recommendations.append({
            'type': 'critical',
            'title': 'Email Found in Data Breaches',
            'description': f'Your email was found in {len(email_breaches)} data breach(es).',
            'action': 'Change passwords for affected accounts and enable 2FA where possible'
        })
        
        # Add specific breach info
        for breach in email_breaches[:3]:  # Show top 3 breaches
            recommendations.append({
                'type': 'info',
                'title': f'Breach: {breach.get("Name", "Unknown")}',
                'description': f'Compromised on {breach.get("BreachDate", "Unknown date")}',
                'action': f'Data compromised: {", ".join(breach.get("DataClasses", []))}'
            })
    else:
        recommendations.append({
            'type': 'success',
            'title': 'Email Not Found in Breaches',
            'description': 'Your email was not found in known data breaches.',
            'action': 'Continue monitoring and consider using unique emails for different services'
        })
    
    # Password breach recommendations
    if password_pwned_count is None:
        recommendations.append({
            'type': 'warning',
            'title': 'Password Check Failed',
            'description': 'Unable to check password breaches. Try again later.',
            'action': 'Use a strong, unique password and consider a password manager'
        })
    elif password_pwned_count > 0:
        recommendations.append({
            'type': 'critical',
            'title': 'Password Found in Breaches',
            'description': f'This password has been seen {password_pwned_count:,} times in data breaches.',
            'action': 'Change this password immediately and use a unique, strong password'
        })
    else:
        recommendations.append({
            'type': 'success',
            'title': 'Password Not Found in Breaches',
            'description': 'This password has not been found in known data breaches.',
            'action': 'Continue using strong, unique passwords for each account'
        })
    
    # General security recommendations
    recommendations.extend([
        {
            'type': 'info',
            'title': 'Enable Two-Factor Authentication',
            'description': 'Add an extra layer of security to your accounts.',
            'action': 'Enable 2FA on all important accounts (email, banking, social media)'
        },
        {
            'type': 'info',
            'title': 'Use a Password Manager',
            'description': 'Generate and store unique passwords for each account.',
            'action': 'Consider using Bitwarden, 1Password, or LastPass'
        },
        {
            'type': 'info',
            'title': 'Regular Security Checkups',
            'description': 'Monitor your accounts regularly for suspicious activity.',
            'action': 'Check this dashboard monthly and review account activity'
        }
    ])
    
    return recommendations

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
