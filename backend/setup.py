import os
import subprocess
import sys

def create_env_file():
    """Create .env file with default configuration"""
    env_content = """# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_NAME=excel_finder_db

# Flask Configuration
FLASK_SECRET_KEY=your-secret-key-here-change-in-production
FLASK_DEBUG=True
FLASK_HOST=0.0.0.0
FLASK_PORT=5000

# File Upload Configuration
UPLOAD_FOLDER=uploads
MAX_FILE_SIZE=16777216  # 16MB in bytes

# Email Configuration (for password reset)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Security Configuration
PASSWORD_RESET_TOKEN_EXPIRY=3600  # 1 hour in seconds
"""
    
    with open('.env', 'w') as f:
        f.write(env_content)
    print("✅ Created .env file")

def install_requirements():
    """Install Python requirements"""
    try:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
        print("✅ Installed Python requirements")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install requirements: {e}")
        return False
    return True

def create_upload_directory():
    """Create uploads directory"""
    os.makedirs('uploads', exist_ok=True)
    print("✅ Created uploads directory")

def check_mysql_connection():
    """Check if MySQL is running"""
    try:
        import pymysql
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password='password',
            database='mysql'
        )
        connection.close()
        print("✅ MySQL connection successful")
        return True
    except Exception as e:
        print(f"❌ MySQL connection failed: {e}")
        print("\n📋 To fix this:")
        print("1. Install MySQL Server or XAMPP")
        print("2. Start MySQL service")
        print("3. Run: mysql -u root -p < database_setup.sql")
        print("4. Update .env file with correct credentials")
        return False

def main():
    print("🚀 Setting up Excel Finder Backend...")
    create_env_file()
    if not install_requirements():
        return
    create_upload_directory()
    mysql_ok = check_mysql_connection()
    
    if mysql_ok:
        print("\n🎉Setup complete! You can now run: python app.py")
    else:
        print("\n⚠️Setup incomplete. Please fix MySQL connection and try again.")

if __name__ == "__main__":
    main()
