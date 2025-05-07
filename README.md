# My Auth App

A Vue.js application with AWS integration for authentication, logging, and database connectivity using AWS RDS and CloudWatch.

## Features

- **Authentication**: User login and logout functionality with secure handling of credentials.
- **AWS CloudWatch Integration**: Logs user activities (e.g., login/logout) to AWS CloudWatch.
- **Vue Router**: Implements routing for navigation between pages (e.g., Dashboard, Profile, Login).
- **Environment Variables**: Securely manages sensitive credentials using `.env`.

---

## Prerequisites

1. **Node.js**: Install [Node.js](https://nodejs.org/) (v16 or later).
2. **AWS Account**: Set up an AWS account with access to RDS and CloudWatch.
3. **MySQL Client**: (Optional) Install a MySQL client like MySQL Workbench for database management.

---

## Installation

## 1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/my-auth-app.git
   cd my-auth-app
   
## 2-Install dependencies:
   npm install

3-Create a .env file in the root directory with the following content:
VITE_AWS_ACCESS_KEY_ID=your-aws-access-key-id
VITE_AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
VITE_AWS_REGION=us-east-1
DB_HOST=your-rds-endpoint
DB_USER=your-database-username
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
DB_PORT=3306

## 4-Start the development server:
## npm run dev

## 5-Project Structure
## my-auth-app/
## ├── src/
## │   ├── components/        # Vue components (e.g., LoginForm, LogoutButton)
## ├── router/            # Vue Router setup
##  ├── services/          # AWS and authentication services
##   ├── plugins/           # Vue plugins (e.g., Auth plugin)
##  ├── db.js              # Database connection setup
##  ├── dbTest.js          # Database connection testing
##  ├── App.vue            # Root Vue component
##  └── [main.js](http://_vscodecontentref_/1)            # Application entry point
## ├── .env                   # Environment variables (not committed to GitHub)
## ├── [vite.config.js](http://_vscodecontentref_/2)         # Vite configuration
## ├── [package.json](http://_vscodecontentref_/3)           # Project dependencies and scripts
## └── [README.md](http://_vscodecontentref_/4)              # Project documentation

 ## AWS Setup
## 1. AWS RDS
## Create an RDS MySQL instance.
Enable public access and configure the security group to allow your IP address.
Add the RDS endpoint and credentials to the .env file.
## 2. AWS CloudWatch
Ensure your AWS IAM user has permissions for logs:CreateLogGroup, logs:CreateLogStream, and logs:PutLogEvents.
The application will automatically create the log group /honeypot/auth and log stream security-events if they do not exist.

Scripts
## Start Development Server:
npm run dev

Build for Production:
npm run build

Test Database Connection:
node src/dbTest.js

Troubleshooting
Database Connection Failed
Ensure the .env file contains the correct RDS credentials.
Verify that the RDS instance is publicly accessible and the security group allows your IP.
AWS CloudWatch Logs Not Working
Check the IAM permissions for the AWS credentials.
Verify that the log group /honeypot/auth exists in CloudWatch.

License
This project is licensed under the MIT License. See the LICENSE file for details.
--

### Key Updates:
1. Added **AWS RDS** and **CloudWatch** setup instructions.
2. Included [.env](http://_vscodecontentref_/5) configuration details.
3. Added troubleshooting steps for common issues.
4. Updated project structure to reflect your current setup.

Let me know if you'd like further modifications! 🚀

