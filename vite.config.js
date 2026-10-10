import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build` → dist/index.html duy nhất (ảnh, CSS, JS nhúng sẵn) — mở trực tiếp hoặc upload lên hosting tĩnh.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), viteSingleFile()],
})
