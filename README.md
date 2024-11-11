# Web-logging-system

### Installation

1. **Clone the Repository**:
   Open your terminal and clone the repository using the following command:

   ```bash
   git clone <repository-url>
   ```

   Replace <repository-url> with the actual URL of your Git repository.

2. **Navigate to the Project Directory**:
   After cloning, move into the project directory:

   ```bash
   cd logging-system-services
   ```

3. **Install Dependencies**:
   Install all required dependencies for the frontend application by running:

   ```bash
   npm install
   ```

   This will install all packages listed in the package.json file.

## Running the Application

To run the application, follow the steps below. You’ll need two terminals: one for the Next frontend and one for Node Server.

### Step 1: Create Environment Variables

In the root directory of the project, create a `.env` file to store the API keys and URLs. Add the following content to your `.env` file:

```plaintext
PORT=8080
MONGO_URI=
JWT_SECRET=
```

### Step 2: Start the Backend (Node)

**In your original terminal**:

1. Make sure you are in the main project directory (logging-system-services), and then start the Node application with:

   ```bash
   npm start
   ```

Or

```bash
   nodemon index.js
```

Or

```bash
   node index.js
```
