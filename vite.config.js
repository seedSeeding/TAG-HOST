import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
export default defineConfig({
    plugins: [
        react({include: /\.(js|jsx|ts|tsx)$/}),
        laravel({
            input: ['resources/css/app.css','resources/js/script.js', 'resources/js/app.jsx'],
            refresh: true,
        }),
    ],
});
