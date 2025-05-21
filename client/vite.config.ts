import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [ 
    react()
   
  ],
  server: {
    port: 3000,      // Frontend dev server
    open: true,      // Auto-open in browser
    proxy: {
      '/graphql': {
        target: 'http://localhost:4000',  // Backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
