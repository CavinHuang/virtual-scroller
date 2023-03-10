import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs', 'iife'],
  globalName: 'Virtual',
  splitting: false,
  sourcemap: true,
  clean: true,
  target: 'esnext',
  outDir: 'libs',
  dts: true
})