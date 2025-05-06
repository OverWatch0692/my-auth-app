// 2. CloudWatch Logger Service (src/services/cloudwatch-logger.js)
import { PutLogEventsCommand } from "@aws-sdk/client-cloudwatch-logs";

export class CloudWatchLogger {
  constructor(cloudWatchLogsClient, logGroupName = "/honeypot/auth", logStreamName = "security-events") {
    this.cloudWatchLogsClient = cloudWatchLogsClient;
    this.logGroupName = logGroupName;
    this.logStreamName = logStreamName;
  }

  async log(message, logLevel = "INFO") {
    try {
      const timestamp = new Date().getTime();
      const formattedMessage = `[${logLevel}] ${message}`;
      
      const command = new PutLogEventsCommand({
        logGroupName: this.logGroupName,
        logStreamName: this.logStreamName,
        logEvents: [
          {
            timestamp,
            message: formattedMessage
          }
        ]
      });
      
      return await this.cloudWatchLogsClient.send(command);
    } catch (error) {
      console.error("Failed to send logs to CloudWatch:", error);
      return null;
    }
  }

  async logLogin(username, success, details = {}) {
    const message = JSON.stringify({
      event: "LOGIN",
      username,
      success,
      timestamp: new Date().toISOString(),
      details,
      inputData: this.sanitizeForLogging(username)
    });
    
    return await this.log(message, success ? "INFO" : "WARN");
  }

  async logLogout(username) {
    const message = JSON.stringify({
      event: "LOGOUT",
      username,
      timestamp: new Date().toISOString()
    });
    
    return await this.log(message);
  }
  
  async logSignup(username, success, details = {}) {
    const message = JSON.stringify({
      event: "SIGNUP",
      username,
      success,
      timestamp: new Date().toISOString(),
      details,
      inputData: {
        username: this.sanitizeForLogging(username),
        email: details.email ? this.sanitizeForLogging(details.email) : null
      }
    });
    
    return await this.log(message, success ? "INFO" : "WARN");
  }
  
  async logSecurityEvent(eventType, payload, level = "ALERT") {
    const message = JSON.stringify({
      event: eventType,
      timestamp: new Date().toISOString(),
      payload,
      userAgent: navigator.userAgent,
      referer: document.referrer,
      url: window.location.href
    });
    
    return await this.log(message, level);
  }
  
  // Helper methods for attack detection
  sanitizeForLogging(input) {
    return {
      raw: input,
      length: input ? input.length : 0,
      hasScript: this.detectXSS(input),
      hasSQLi: this.detectSQLi(input)
    };
  }
  
  detectXSS(input) {
    if (!input) return false;
    // Basic XSS patterns
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript\s*:/gi,
      /onerror\s*=/gi,
      /onclick\s*=/gi,
      /alert\s*\(/gi,
      /eval\s*\(/gi
    ];
    
    return xssPatterns.some(pattern => pattern.test(input));
  }
  
  detectSQLi(input) {
    if (!input) return false;
    // Basic SQL injection patterns
    const sqliPatterns = [
      /'\s*OR\s*'1'\s*=\s*'1/gi,
      /'\s*OR\s*1\s*=\s*1/gi,
      /'\s*;\s*DROP\s+TABLE/gi,
      /'\s*;\s*--/gi,
      /UNION\s+SELECT/gi,
      /UNION\s+ALL\s+SELECT/gi,
      /SELECT\s+.*\s+FROM/gi
    ];
    
    return sqliPatterns.some(pattern => pattern.test(input));
  }
}