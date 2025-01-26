# Collaborative Notes Application  

This project is a real-time collaborative notes application built with modern web technologies.  

## Features  

- **Client-Side Development**:  
  Built with Vite for streamlined client-side development and React with TypeScript for a robust, type-safe frontend.  

- **User Management**:  
  Utilizes [Clerk](https://clerk.com) for authentication, user management, and collaboration invitations. Secure password storage along with Google and GitHub authentication are supported.  

- **UI Components**:  
  Incorporates [shadCN UI components](https://shadcn.dev) for rapid development of buttons, tables, inputs, and more.  

- **Backend**:  
  - Created using Express.js, Node.js, and MongoDB (supports both MongoDB Atlas and local MongoDB).  
  - Database schema for notes is defined in `server/model/note.js`.  
  - Includes APIs for creating and retrieving user notes.  

- **Real-Time Collaboration**:  
  - Integrated with Socket.IO to facilitate real-time updates. All changes from clients are sent to the server, which broadcasts updates to all connected clients to maintain synchronized states.  
  - Notes state is maintained in internal memory temporarily and persisted in the database at regular short intervals. Optimizations remove unnecessary notes data from memory.  
  - Client-side optimizations batch updates to prevent overwhelming the server and update the client state only when necessary.  
  - **Future Scope**: Consider using libraries like AutoMerge for efficiently merging real-time changes from different clients.  

- **Development Assistance**:  
  Leveraged tools like GitHub Copilot and ChatGPT to overcome challenges throughout the development process.  

## Setup  

### Prerequisites  
- Node.js v18  
- MongoDB  

### Steps to Run  

1. **Prepare MongoDB**:  
   - Get a MongoDB Atlas instance or start a local MongoDB server.  
   - Ensure the MongoDB service is running and create a database named `notes`.  

2. **Set Environment Variables**:  
   - Create a `.env` file and add all required configuration details.  

3. **Run the Application**:  
   - The application consists of three components: Client, Server, and Database. All three need to run simultaneously.  
   - Separate README files are available in the `client` and `server` directories for detailed setup instructions.  

Feel free to contribute to this project or raise issues for any improvements!  
