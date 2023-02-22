/*
 * @Author: CavinHuang sujinw@qq.com
 * @Date: 2023-02-22 10:02:40
 * @LastEditors: CavinHuang sujinw@qq.com
 * @LastEditTime: 2023-02-22 12:00:17
 * @FilePath: \virtual-scroller\tsup.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs', 'iife'],
  globalName: 'VirtualList',
  splitting: false,
  sourcemap: true,
  clean: true,
  target: 'esnext',
  outDir: 'libs',
  dts: true
})