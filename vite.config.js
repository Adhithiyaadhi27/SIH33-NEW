import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            // REST API -> Flask backend
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
            },
            // Socket.IO -> Flask-SocketIO backend
            '/socket.io': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                ws: true,
            },
        },
    },
});
