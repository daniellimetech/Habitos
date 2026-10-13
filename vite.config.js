import {defineConfig} from 'vite';
export default defineConfig({build:{rollupOptions:{output:{manualChunks(id){if(id.includes('/node_modules/@supabase/')||id.includes('/node_modules/iceberg-js/'))return 'supabase';}}}}});
