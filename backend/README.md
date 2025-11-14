# Excel Retrival Backend Setup Instructions

## Prerequisites
- Python 3.8 or higher
- MySQL 8.0 or higher
- pip (Python package installer)

## Installation Steps

### 1. Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Setup MySQL Database
1. Install MySQL server on your system
2. Start MySQL service
3. Create a database user (optional, you can use root)
4. Run the database setup script:
```bash
mysql -u root -p < database_setup.sql
```

### 3. Configure Environment Variables
1. Copy the example configuration:
```bash
cp .env.example .env
```
2. Edit `.env` file with your database credentials and other settings

### 4. Create Upload Directory
```bash
mkdir uploads
```

### 5. Run the Application
```bash
python app.py
```

The backend will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### File Management
- `POST /api/upload` - Upload Excel file
- `GET /api/files/<user_id>` - Get user's files
- `GET /api/files/<file_id>/data` - Get file data
- `DELETE /api/files/<file_id>` - Delete file

### Health Check
- `GET /api/health` - Health check endpoint

## Database Schema

### Users Table
- `id` - Primary key
- `user_id` - Unique user identifier
- `name` - User's full name
- `email` - User's email (unique)
- `password_hash` - Hashed password
- `created_at` - Account creation timestamp
- `is_active` - Account status

### Excel Files Table
- `id` - Primary key
- `file_id` - Unique file identifier
- `user_id` - Foreign key to users table
- `filename` - Stored filename
- `original_filename` - Original filename
- `file_path` - File storage path
- `file_size` - File size in bytes
- `sheets_data` - JSON data of all sheets
- `uploaded_at` - Upload timestamp
- `is_active` - File status

### Password Resets Table
- `id` - Primary key
- `email` - User's email
- `token` - Reset token
- `created_at` - Token creation time
- `expires_at` - Token expiration time
- `is_used` - Token usage status

## Security Notes
- Change default passwords in production
- Use environment variables for sensitive data
- Enable HTTPS in production
- Implement rate limiting for API endpoints
- Use proper CORS configuration
- Validate and sanitize all inputs

## Troubleshooting
- Check MySQL service is running
- Verify database credentials in .env file
- Ensure upload directory has write permissions
- Check Python version compatibility
- Review logs for detailed error messages
