import path from "path"
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../server/.env') });

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'process.env': process.env, // Make variables available to the client
  },
  server: {
    port:3000,
    host: true, // Exposes the server to external addresses
    hmr: {
	 host: '35.209.89.38', // Replace this with your public IP or do
	 port: 3000, // If you're using HTTPS, specify 443; otherwise, use the port your server is exposed on
    }, // Ensure it's running on port 80
  }
});
