//12. Main Entry Point (src/main.js)
import { createApp } from 'vue';
import App from './App.vue';
import { createAuthPlugin } from './plugins/auth';
import { setupRouter } from './router';
import { AuthService } from './services/auth-services'; // Corrected file name
import { CloudWatchLogger } from './services/cloudwatch-logger';
import { setupAWS } from './aws-config';

// Load environment variables
const AWS_CREDENTIALS = {
  accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
  secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1'
};


const app = createApp(App);

// Setup AWS and services
const { cloudWatchLogsClient } = setupAWS(AWS_CREDENTIALS);
const cloudWatchLogger = new CloudWatchLogger(cloudWatchLogsClient);
const authService = new AuthService(cloudWatchLogger);

// Register auth plugin
app.use(createAuthPlugin(AWS_CREDENTIALS));

// Setup and use router
const router = setupRouter(authService);
app.use(router);

// Mount app
app.mount('#app');