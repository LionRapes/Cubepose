import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import glsl from 'vite-plugin-glsl'


export default defineConfig({
  plugins: [react(), glsl()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react',
              test: /node_modules\/react/
            },
            {
              name: 'react-dom',
              test: /node_modules\/react-dom/
            },
            {
              name: 'three',
              test: /node_modules\/three/
            }
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
})
