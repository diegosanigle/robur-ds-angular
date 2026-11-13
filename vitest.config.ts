import path from 'node:path'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { storybookAngularVitest } from '@storybook/angular-vite/vitest'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

const dirname = import.meta.dirname

// Cada story de Storybook se ejecuta como un test en un navegador real.
export default defineConfig({
  // Vite prepara estas dependencias antes de empezar: si las descubre a mitad de los tests, recarga y fallan.
  optimizeDeps: { include: ['@angular/common', '@angular/forms/signals'] },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // Lleva a Vitest las opciones de angular.json (estilos, zoneless…).
          storybookAngularVitest({}),
          storybookTest({ configDir: path.join(dirname, '.storybook') }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
