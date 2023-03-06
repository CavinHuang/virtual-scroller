import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      outputDir: 'dist',
      afterBuild: () => {
        const srcPath = path.resolve(__dirname, './dist/src')
        fs.readdirSync(srcPath).forEach(file => {
          const fullFile = path.join(srcPath, file)
          fs.copyFileSync(fullFile, path.join(__dirname, 'dist', file))
          fs.unlinkSync(fullFile)
        })
        fs.rmdirSync(srcPath)
      }
    })
  ],
  build: {
    outDir: 'dist',
    lib: {
      entry: path.resolve(__dirname, './src/index.ts'),
      name: 'Virtual',
      fileName: (format, entryName) => `${entryName.replace(/[\/src]/ig, '')}.${format}.js`,
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})