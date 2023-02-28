import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['index.ts'],
  format: ['esm', 'iife'],
  globalName: 'Virtual',
  splitting: false,
  sourcemap: true,
  clean: true,
  target: 'esnext',
  outDir: 'libs',
  dts: true
})