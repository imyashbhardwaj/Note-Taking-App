# Server  

This is a MongoDB, Express, and Node.js application API.  

## Running the Application  

To set up and run the server locally, follow these steps:  

1. **Install Dependencies**:  
   Run the following command to install all required dependencies:  
   ```bash
   npm install
   ```

2. **Start the Server**:  
   Navigate to the server directory and start the server using:  
   ```bash
   cd server
   node index
   ```

3. For Production you can use pm2 also
    ```bash
    pm2 start pm2-process.json
    ```