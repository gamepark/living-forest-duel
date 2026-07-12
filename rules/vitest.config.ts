import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // @gamepark/rules-api ships ESM with directory imports that Node's ESM resolver rejects.
    // Inlining the dependency lets Vitest transform and resolve it.
    server: {
      deps: {
        inline: [/@gamepark\//]
      }
    }
  }
})
