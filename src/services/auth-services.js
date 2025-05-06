// 3. Auth Service (src/services/auth-service.js)
import { ref } from 'vue';

export class AuthService {
  constructor(cloudWatchLogger) {
    this.cloudWatchLogger = cloudWatchLogger;
    this.currentUser = ref(null);
    this.isLoading = ref(false);
    this.error = ref(null);
    
    // Check local storage for existing session
    this.checkExistingSession();
  }
  
  checkExistingSession() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        this.currentUser.value = JSON.parse(userStr);
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }
  
  async login(username, password) {
    this.isLoading.value = true;
    this.error.value = null;
    
    try {
      // Check for potential security threats
      this.checkForSecurityThreats(username, password);
      
      // In a honeypot, we want to accept any credentials to log them
      // but we'll simulate a "successful" login only for non-suspicious inputs
      const isValidInput = username && password && 
                          !this.cloudWatchLogger.detectXSS(username) && 
                          !this.cloudWatchLogger.detectSQLi(username);
      
      if (isValidInput) {
        // Mock successful login
        const user = { username, id: Date.now() };
        
        // Store user in local storage
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser.value = user;
        
        // Log to CloudWatch
        await this.cloudWatchLogger.logLogin(username, true, {
          loginTime: new Date().toISOString(),
          ipAddress: await this.fetchClientIP(), // Get IP for better tracking
          passwordLength: password ? password.length : 0
        });
        
        return true;
      } else {
        // For honeypot - appear to fail but still log everything
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      this.error.value = error.message;
      
      // Log failed attempt to CloudWatch with detailed info
      await this.cloudWatchLogger.logLogin(username, false, {
        errorMessage: error.message,
        attemptTime: new Date().toISOString(),
        passwordLength: password ? password.length : 0
      });
      
      return false;
    } finally {
      this.isLoading.value = false;
    }
  }
  
  // Helper method to detect and log potential threats
  async checkForSecurityThreats(username, password) {
    if (!username) return;
    
    // Check for SQL injection
    if (this.cloudWatchLogger.detectSQLi(username)) {
      await this.cloudWatchLogger.logSecurityEvent('SQL_INJECTION_ATTEMPT', {
        input: username,
        target: 'login_username'
      });
    }
    
    // Check for XSS
    if (this.cloudWatchLogger.detectXSS(username)) {
      await this.cloudWatchLogger.logSecurityEvent('XSS_ATTEMPT', {
        input: username,
        target: 'login_username'
      });
    }
    
    // Check password for potential attacks too
    if (password) {
      if (this.cloudWatchLogger.detectSQLi(password)) {
        await this.cloudWatchLogger.logSecurityEvent('SQL_INJECTION_ATTEMPT', {
          inputLength: password.length,
          target: 'login_password'
        });
      }
      
      if (this.cloudWatchLogger.detectXSS(password)) {
        await this.cloudWatchLogger.logSecurityEvent('XSS_ATTEMPT', {
          inputLength: password.length,
          target: 'login_password'
        });
      }
    }
  }
  
  // Get client IP for better tracking
  async fetchClientIP() {
    try {
      // Use a service like ipify to get the client's IP
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error("Could not fetch IP:", error);
      return '127.0.0.1';
    }
  }
  
  async logout() {
    const username = this.currentUser.value?.username;
    
    // Clear user data
    localStorage.removeItem('user');
    this.currentUser.value = null;
    
    // Log to CloudWatch
    if (username) {
      await this.cloudWatchLogger.logLogout(username);
    }
    
    return true;
  }
  
  async signup(username, password, email) {
    this.isLoading.value = true;
    this.error.value = null;
    
    try {
      // Check all inputs for security threats
      await this.checkForSecurityThreats(username, password);
      await this.checkEmailForThreats(email);
      
      // For honeypot - we want to accept any input but log suspicious ones
      const isValidInput = username && password && email &&
                          !this.cloudWatchLogger.detectXSS(username) && 
                          !this.cloudWatchLogger.detectSQLi(username) &&
                          !this.cloudWatchLogger.detectXSS(email) && 
                          !this.cloudWatchLogger.detectSQLi(email);
      
      if (isValidInput) {
        // Mock successful signup
        const user = { username, id: Date.now(), email };
        
        // Store user in local storage
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser.value = user;
        
        // Log to CloudWatch
        await this.cloudWatchLogger.logSignup(username, true, {
          email,
          signupTime: new Date().toISOString(),
          ipAddress: await this.fetchClientIP(),
          passwordLength: password ? password.length : 0
        });
        
        return true;
      } else {
        // For honeypot - appear to fail but still log everything
        throw new Error('Invalid registration details');
      }
    } catch (error) {
      this.error.value = error.message;
      
      // Log failed attempt to CloudWatch with detailed info
      await this.cloudWatchLogger.logSignup(username, false, {
        email,
        errorMessage: error.message,
        attemptTime: new Date().toISOString(),
        ipAddress: await this.fetchClientIP(),
        passwordLength: password ? password.length : 0
      });
      
      return false;
    } finally {
      this.isLoading.value = false;
    }
  }
  
  // Additional check for email field
  async checkEmailForThreats(email) {
    if (!email) return;
    
    // Check for SQL injection in email
    if (this.cloudWatchLogger.detectSQLi(email)) {
      await this.cloudWatchLogger.logSecurityEvent('SQL_INJECTION_ATTEMPT', {
        input: email,
        target: 'signup_email'
      });
    }
    
    // Check for XSS in email
    if (this.cloudWatchLogger.detectXSS(email)) {
      await this.cloudWatchLogger.logSecurityEvent('XSS_ATTEMPT', {
        input: email,
        target: 'signup_email'
      });
    }
  }
  
  isAuthenticated() {
    return !!this.currentUser.value;
  }
}