import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        colors: resolve(__dirname, 'src/colors.ts'),
        spacing: resolve(__dirname, 'src/spacing.ts'),
        typography: resolve(__dirname, 'src/typography.ts'),
        shadows: resolve(__dirname, 'src/shadows.ts'),
        borders: resolve(__dirname, 'src/borders.ts'),
        animations: resolve(__dirname, 'src/animations.ts'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      output: {
        entryFileNames: (chunkInfo) => {
          const name = chunkInfo.name
          return `${name}.[format].js`
        },
      },
    },
    sourcemap: true,
    minify: 'esbuild',
  },
})
