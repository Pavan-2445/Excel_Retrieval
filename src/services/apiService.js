// API service for connecting to Python backend
const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  // AUTHENTICATION
  static async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  static async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async forgotPassword(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send reset email');
      return data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  static async verifyOTP(email, otp) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'OTP verification failed');
      return data;
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  }

  static async resetPassword(token, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Password reset failed');
      return data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  // FILE UPLOADS
  static async uploadFile(
  file,
  userId,
  {
    includeCredentials = false,
    maxSizeMB = 50,
    allowedTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
    ],
  } = {}
) {
  try {
    if (!file) throw new Error('No file selected');
    if (file.size > maxSizeMB * 1024 * 1024)
      throw new Error(`File size exceeds ${maxSizeMB}MB limit`);
    if (!allowedTypes.includes(file.type))
      throw new Error(`File type ${file.type} is not allowed`);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userId);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
      credentials: includeCredentials ? 'include' : 'same-origin',
    });

    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      const msg =
        data.error ||
        data.message ||
        data.raw ||
        `Upload failed (status ${response.status})`;
      throw new Error(msg);
    }

    return data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}


  // Upload with progress tracking
  static async uploadFileWithProgress(file, userId, onProgress, { includeCredentials = false } = {}) {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error('No file selected'));

      const xhr = new XMLHttpRequest();
      const url = `${API_BASE_URL}/upload`;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', userId);

      xhr.open('POST', url, true);
      if (includeCredentials) xhr.withCredentials = true;

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && typeof onProgress === 'function') {
          onProgress(e.loaded / e.total);
        }
      };

      xhr.onload = () => {
        const status = xhr.status;
        const respText = xhr.responseText;
        let parsed;
        try {
          parsed = respText ? JSON.parse(respText) : {};
        } catch {
          parsed = { raw: respText };
        }

        if (status >= 200 && status < 300) {
          resolve(parsed);
        } else {
          const msg = parsed.error || parsed.message || parsed.raw || `Upload failed (status ${status})`;
          reject(new Error(msg));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during upload'));
      xhr.send(formData);
    });
  }

  // FILE MANAGEMENT
  static async getUserFiles(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/files/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch files');
      return data;
    } catch (error) {
      console.error('Get user files error:', error);
      throw error;
    }
  }

  static async getFileData(fileId) {
    try {
      const response = await fetch(`${API_BASE_URL}/files/${fileId}/data`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch file data');
      return data;
    } catch (error) {
      console.error('Get file data error:', error);
      throw error;
    }
  }

  static async deleteFile(fileId) {
    try {
      const response = await fetch(`${API_BASE_URL}/files/${fileId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete file');
      return data;
    } catch (error) {
      console.error('Delete file error:', error);
      throw error;
    }
  }

  // HEALTH CHECK
  static async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }
}

export default ApiService;
