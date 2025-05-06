// 4. Auth Plugin (src/plugins/auth.js)
import { setupAWS } from '../aws-config';
import { CloudWatchLogger } from '../services/cloudwatch-logger';
import { AuthService } from '../services/auth-services'; // Corrected file name

export const createAuthPlugin = (credentials) => {
  return {
    install: (app) => {
      // Setup AWS clients
      const { cloudWatchLogsClient } = setupAWS(credentials);
      
      // Create services
      const cloudWatchLogger = new CloudWatchLogger(cloudWatchLogsClient);
      const authService = new AuthService(cloudWatchLogger);
      
      // Provide services to the app
      app.provide('auth', authService);
      
      // Add global properties
      app.config.globalProperties.$auth = authService;
    }
  };
};