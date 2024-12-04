import { defineConfig } from 'vite';
import dns from 'node:dns';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

// dns.setDefaultResultOrder('verbatim');

export default defineConfig({
    // build: {
    //     manifest: true,
    //     outDir: 'public/build', 
    // },
    // server: {
    //     host: true,
    //     port: 8000,
    //     hmr: {
    //         host: os.networkInterfaces().eth0?.[0].address,
    //     },
    // },
    plugins: [
        react({include: /\.(js|jsx|ts|tsx)$/}),
        
        laravel({
            input: ['resources/css/app.css','resources/js/script.js', 'resources/js/app.jsx'],
            refresh: true,
        }),
        
        // vue({
        //     template: {
        //         transformAssetUrls: {
        //             base: null,
        //             includeAbsolute: false,
        //         },
        //     },
        // }),
    ],
});
