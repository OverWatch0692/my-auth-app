
// 1. AWS Configuration (src/aws-config.js)
import { CloudWatchLogsClient, PutLogEventsCommand, CreateLogStreamCommand, CreateLogGroupCommand } from "@aws-sdk/client-cloudwatch-logs";


// Configure AWS SDK with your credentials and region
export function setupAWS(credentials) {
    const client = new CloudWatchLogsClient({
      region: credentials.region,
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
      },
    });
  
    return {
      cloudWatchLogsClient: client,
    };
  }
// Helper function to create log group and stream if they don't exist
const ensureLogInfrastructure = async (cloudWatchLogsClient) => {
  const logGroupName = "/honeypot/auth";
  const logStreamName = "security-events";
  
  try {
    // Try to create log group (will fail if it already exists)
    await cloudWatchLogsClient.send(
      new CreateLogGroupCommand({
        logGroupName
      })
    );
    console.log(`Created log group: ${logGroupName}`);
  } catch (error) {
    // Ignore if it already exists
    if (error.name !== 'ResourceAlreadyExistsException') {
      console.warn(`Error creating log group: ${error.message}`);
    }
  }
  
  try {
    // Try to create log stream (will fail if it already exists)
    await cloudWatchLogsClient.send(
      new CreateLogStreamCommand({
        logGroupName,
        logStreamName
      })
    );
    console.log(`Created log stream: ${logStreamName}`);
  } catch (error) {
    // Ignore if it already exists
    if (error.name !== 'ResourceAlreadyExistsException') {
      console.warn(`Error creating log stream: ${error.message}`);
    }
  }
};

// Call the function to ensure log infrastructure is set up