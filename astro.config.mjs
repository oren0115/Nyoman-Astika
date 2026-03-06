// @ts-check
/// <reference types="node" />
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
    define: {
      'import.meta.env.PUBLIC_API_URL': JSON.stringify(process.env.PUBLIC_API_URL),
    },
  },
  integrations: [react()],
});
