# Excel Finder - Complete Setup Guide

A full-stack web application for uploading and managing Excel files with user authentication.

## Tech Stack
- **Frontend**: React.js, TailwindCSS, React Router
- **Backend**: Python Flask, SQLAlchemy
- **Database**: MySQL 8.0
- **File Processing**: pandas, openpyxl

---

## Prerequisites

1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **Python** (v3.8 or higher) - [Download](https://www.python.org/)
3. **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/)
4. **Git** (optional) - [Download](https://git-scm.com/)

---

## Installation Steps

### 1. Clone/Download the Project
```bash
cd Mark1
```

### 2. Backend Setup

#### Step 2.1: Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### Step 2.2: Configure MySQL
Make sure MySQL service is running:
```bash
# Windows (Run CMD as Administrator)
net start mysql80

# Check if MySQL is running
sc query mysql80
```

#### Step 2.3: Create Database
Enter your MySQL root password when prompted:
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS excel_finder_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p excel_finder_db < database_setup.sql
```

#### Step 2.4: Configure Environment Variables
The `.env` file should already be created. Update it with your MySQL credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=YourMySQLPassword
DB_NAME=excel_finder_db
```

#### Step 2.5: Run Backend Server
```bash
python app.py
```

The backend will start at: **http://localhost:5000**

---

### 3. Frontend Setup

Open a **new terminal window** and navigate to the project root:

#### Step 3.1: Install Node Dependencies
```bash
npm install
```

#### Step 3.2: Run Frontend Development Server
```bash
npm run dev
```

The frontend will start at: **http://localhost:5173**

---

## Testing the Application

### 1. Open Browser
Navigate to: **http://localhost:5173**

### 2. Register a New User
- Click "Signup"
- Enter your name, email, and password
- Click "Register"

### 3. Login
- Enter your registered email and password
- Click "Login"

### 4. Upload Excel File
- Click "Choose File"
- Select an Excel file (.xlsx or .xls)
- The file will be uploaded to the server and stored in MySQL
- View the data in the dashboard

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### File Management
- `POST /api/upload` - Upload Excel file
- `GET /api/files/<user_id>` - Get user's files
- `GET /api/files/<file_id>/data` - Get file data
- `DELETE /api/files/<file_id>` - Delete file

### Health Check
- `GET /api/health` - Backend health status

---

## Project Structure

```
Mark1/
├── backend/
│   ├── app.py                 # Flask application
│   ├── requirements.txt       # Python dependencies
│   ├── database_setup.sql     # Database schema
│   ├── .env                   # Environment variables
│   ├── uploads/               # Uploaded files directory
│   └── README.md              # Backend documentation
├── src/
│   ├── Pages/
│   │   ├── Login.jsx          # Login/Register page
│   │   └── Dashboard.jsx      # Dashboard with file upload
│   ├── services/
│   │   └── apiService.js      # API communication layer
│   ├── components/
│   │   ├── GlassSurface.jsx
│   │   └── Particles.jsx
│   └── App.jsx                # Main React component
├── package.json               # Node dependencies
└── README.md                  # This file
```

---

## Common Issues & Solutions

### Issue 1: MySQL Connection Error
**Error**: `Can't connect to MySQL server`

**Solution**:
1. Check if MySQL service is running: `sc query mysql80`
2. Start MySQL: `net start mysql80` (Run CMD as Administrator)
3. Verify password in `.env` file
4. Test connection: `mysql -u root -p`

### Issue 2: Port Already in Use
**Error**: `Port 5000 is already in use`

**Solution**:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in app.py and apiService.js
```

### Issue 3: Special Characters in MySQL Password
**Error**: `Authentication failed` with special characters

**Solution**: The app now automatically handles special characters in passwords using URL encoding.

### Issue 4: CORS Error
**Solution**: Backend already has CORS enabled via `Flask-CORS`

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE,
    name VARCHAR(100),
    email VARCHAR(120) UNIQUE,
    password_hash VARCHAR(255),
    created_at TIMESTAMP,
    is_active BOOLEAN
);
```

### Excel Files Table
```sql
CREATE TABLE excel_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    file_id VARCHAR(50) UNIQUE,
    user_id INT,
    filename VARCHAR(255),
    original_filename VARCHAR(255),
    file_path VARCHAR(500),
    file_size INT,
    sheets_data TEXT,
    uploaded_at TIMESTAMP,
    is_active BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## Features

✅ User Authentication (Register, Login, Password Reset)  
✅ Secure password hashing with Werkzeug  
✅ Excel file upload (.xlsx, .xls)  
✅ Multiple sheets support  
✅ Data stored in MySQL database  
✅ Real-time file processing  
✅ Beautiful glassmorphism UI  
✅ Particle effects background  
✅ Responsive design  

---

## Security Notes

⚠️ **For Production**:
1. Change `FLASK_SECRET_KEY` in `.env`
2. Use strong MySQL passwords
3. Enable HTTPS
4. Implement rate limiting
5. Add input validation
6. Use environment-specific configurations
7. Set up proper error handling
8. Add logging and monitoring

---

## Development vs Production

### Development
- Debug mode enabled
- CORS allows all origins
- Detailed error messages

### Production (TODO)
- Disable debug mode
- Configure specific CORS origins
- Use production database
- Add SSL/TLS certificates
- Set up reverse proxy (nginx)
- Use gunicorn or similar WSGI server

---

## License

MIT License - feel free to use this project for learning purposes.

---

## Support

If you encounter any issues:
1. Check the error logs in terminal
2. Verify all services are running
3. Review this guide carefully
4. Check MySQL connection first

---

## Credits

Built with ❤️ using React, Flask, and MySQL
