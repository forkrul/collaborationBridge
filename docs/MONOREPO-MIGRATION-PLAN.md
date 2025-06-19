# Monorepo Migration Plan
## Refactoring to Scalable Architecture

---

## 🎯 **Migration Overview**

This document outlines the step-by-step migration from the current single-package structure to a scalable monorepo architecture using modern tooling and best practices.

---

## 📊 **Current State Analysis**

### **Current Structure**
```
project-template-mvp/
├── frontend/                 # Next.js application
│   ├── src/components/      # All components in single package
│   ├── src/i18n/           # Internationalization
│   └── src/app/            # Next.js app router
├── src/                     # Python backend
├── docs/                    # Documentation
└── requirements/            # Python dependencies
```

### **Pain Points**
- **Monolithic Frontend**: All components bundled together
- **Tight Coupling**: Difficult to version components independently
- **Build Performance**: Full rebuild for any change
- **Dependency Management**: Shared dependencies not optimized
- **Testing Complexity**: All tests run for any change

---

## 🏗️ **Target Monorepo Architecture**

### **New Structure**
```
project-template-mvp/
├── packages/
│   ├── core/                # Core utilities and hooks
│   │   ├── src/
│   │   ├── package.json
│   │   └── README.md
│   ├── components/          # React components library
│   │   ├── src/
│   │   ├── package.json
│   │   └── README.md
│   ├── themes/             # Theme configurations
│   │   ├── src/
│   │   ├── package.json
│   │   └── README.md
│   ├── icons/              # Icon library
│   │   ├── src/
│   │   ├── package.json
│   │   └── README.md
│   ├── tokens/             # Design tokens
│   │   ├── src/
│   │   ├── package.json
│   │   └── README.md
│   ├── cli/                # Component generator CLI
│   │   ├── src/
│   │   ├── package.json
│   │   └── README.md
│   └── docs/               # Documentation site
│       ├── src/
│       ├── package.json
│       └── README.md
├── apps/
│   ├── frontend/           # Main Next.js application
│   │   ├── src/
│   │   ├── package.json
│   │   └── README.md
│   └── storybook/          # Storybook application
│       ├── .storybook/
│       ├── package.json
│       └── README.md
├── tools/                  # Shared tooling and configuration
│   ├── eslint-config/
│   ├── typescript-config/
│   └── build-tools/
├── package.json            # Root package.json
├── nx.json                 # Nx configuration
└── workspace.json          # Workspace configuration
```

---

## 🛠️ **Technology Stack**

### **Monorepo Management**
- **Nx**: Advanced monorepo tooling with caching and task orchestration
- **pnpm**: Fast, disk space efficient package manager
- **Changesets**: Version management and changelog generation
- **Turborepo**: Alternative option for build system optimization

### **Build & Development**
- **Vite**: Fast build tool for packages
- **TypeScript**: Shared configuration across packages
- **ESLint**: Shared linting configuration
- **Prettier**: Code formatting consistency

### **Testing & Quality**
- **Jest**: Unit testing framework
- **Playwright**: E2E testing
- **Storybook**: Component development and testing
- **Chromatic**: Visual regression testing

---

## 📋 **Migration Phases**

### **Phase 1: Setup Monorepo Infrastructure (Week 1)**

#### **1.1 Initialize Nx Workspace**
```bash
# Create new Nx workspace
npx create-nx-workspace@latest project-template-mvp --preset=empty

# Install required dependencies
pnpm add -D @nx/react @nx/next @nx/storybook @nx/jest
```

#### **1.2 Configure Package Manager**
```json
// .npmrc
node-linker=hoisted
prefer-workspace-packages=true
save-exact=true
```

#### **1.3 Setup Shared Tooling**
```typescript
// tools/typescript-config/base.json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### **Phase 2: Extract Core Packages (Week 2)**

#### **2.1 Create @company/core Package**
```typescript
// packages/core/src/index.ts
export * from './hooks'
export * from './utils'
export * from './types'
export * from './constants'

// packages/core/package.json
{
  "name": "@company/core",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.js"
    }
  }
}
```

#### **2.2 Extract Design Tokens**
```typescript
// packages/tokens/src/colors.ts
export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    // ... color scale
  }
} as const

// packages/tokens/src/spacing.ts
export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  // ... spacing scale
} as const
```

#### **2.3 Create Theme System**
```typescript
// packages/themes/src/base.ts
import { colors, spacing, typography } from '@company/tokens'

export const baseTheme = {
  colors,
  spacing,
  typography,
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    // ... shadow scale
  }
}
```

### **Phase 3: Component Library Extraction (Week 3)**

#### **3.1 Create Component Package Structure**
```typescript
// packages/components/src/index.ts
export { Button } from './Button'
export { Card } from './Card'
export { Input } from './Input'
// ... all components

// packages/components/src/Button/index.ts
export { Button } from './Button'
export type { ButtonProps } from './Button.types'
```

#### **3.2 Setup Component Build System**
```typescript
// packages/components/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'Components',
      formats: ['es', 'umd'],
      fileName: (format) => `components.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
})
```

### **Phase 4: Application Migration (Week 4)**

#### **4.1 Migrate Frontend Application**
```typescript
// apps/frontend/package.json
{
  "name": "@company/frontend",
  "dependencies": {
    "@company/components": "workspace:*",
    "@company/themes": "workspace:*",
    "@company/core": "workspace:*"
  }
}

// apps/frontend/src/app/layout.tsx
import { ThemeProvider } from '@company/themes'
import { baseTheme } from '@company/themes/base'

export default function RootLayout({ children }) {
  return (
    <ThemeProvider theme={baseTheme}>
      {children}
    </ThemeProvider>
  )
}
```

#### **4.2 Setup Storybook Application**
```typescript
// apps/storybook/.storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: [
    '../../../packages/components/src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-design-tokens',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
}

export default config
```

---

## 🔧 **Build System Configuration**

### **Nx Configuration**
```json
// nx.json
{
  "extends": "nx/presets/npm.json",
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx/tasks-runners/default",
      "options": {
        "cacheableOperations": ["build", "test", "lint", "e2e"]
      }
    }
  },
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["production", "^production"]
    },
    "test": {
      "inputs": ["default", "^production", "{workspaceRoot}/jest.preset.js"]
    }
  }
}
```

### **Package Scripts**
```json
// package.json (root)
{
  "scripts": {
    "build": "nx run-many --target=build --all",
    "test": "nx run-many --target=test --all",
    "lint": "nx run-many --target=lint --all",
    "dev": "nx run frontend:dev",
    "storybook": "nx run storybook:storybook",
    "release": "changeset publish"
  }
}
```

---

## 📦 **Package Publishing Strategy**

### **Version Management with Changesets**
```json
// .changeset/config.json
{
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": ["@company/frontend", "@company/storybook"]
}
```

### **Release Workflow**
```bash
# 1. Create changeset for changes
pnpm changeset

# 2. Version packages
pnpm changeset version

# 3. Build all packages
pnpm build

# 4. Publish to npm
pnpm changeset publish
```

---

## 🧪 **Testing Strategy**

### **Package-Level Testing**
```typescript
// packages/components/jest.config.ts
export default {
  displayName: 'components',
  preset: '../../jest.preset.js',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/packages/components',
}
```

### **Integration Testing**
```typescript
// apps/frontend/e2e/component-integration.spec.ts
import { test, expect } from '@playwright/test'

test('components work together correctly', async ({ page }) => {
  await page.goto('/components')
  
  // Test component interactions
  await page.click('[data-testid="button"]')
  await expect(page.locator('[data-testid="modal"]')).toBeVisible()
})
```

---

## 📈 **Performance Optimization**

### **Build Caching**
```typescript
// nx.json - Advanced caching
{
  "tasksRunnerOptions": {
    "default": {
      "runner": "@nrwl/nx-cloud",
      "options": {
        "cacheableOperations": ["build", "test", "lint"],
        "accessToken": "your-nx-cloud-token"
      }
    }
  }
}
```

### **Incremental Builds**
```bash
# Only build affected packages
nx affected:build

# Only test affected packages
nx affected:test

# Only lint affected packages
nx affected:lint
```

---

## 🚀 **Migration Timeline**

### **Week 1: Infrastructure Setup**
- [ ] Initialize Nx workspace
- [ ] Configure package manager (pnpm)
- [ ] Setup shared tooling configurations
- [ ] Create initial package structure

### **Week 2: Core Package Extraction**
- [ ] Extract utilities and hooks to @company/core
- [ ] Create design tokens package
- [ ] Setup theme system package
- [ ] Configure build systems for packages

### **Week 3: Component Migration**
- [ ] Migrate all components to @company/components
- [ ] Setup component build and bundling
- [ ] Create component documentation
- [ ] Implement package testing

### **Week 4: Application Integration**
- [ ] Migrate frontend app to use packages
- [ ] Setup Storybook application
- [ ] Configure CI/CD for monorepo
- [ ] Test end-to-end functionality

---

## ✅ **Success Criteria**

### **Technical Metrics**
- [ ] Build time reduced by 50% for incremental changes
- [ ] Package size optimized (tree-shaking working)
- [ ] Independent package versioning functional
- [ ] All tests passing in new structure

### **Developer Experience**
- [ ] Easy package development workflow
- [ ] Clear dependency management
- [ ] Simplified component consumption
- [ ] Comprehensive documentation

### **Quality Assurance**
- [ ] No regression in functionality
- [ ] Maintained test coverage (95%+)
- [ ] Accessibility compliance preserved
- [ ] Performance benchmarks met

---

## 🔄 **Rollback Plan**

### **Risk Mitigation**
- [ ] Keep current structure in separate branch
- [ ] Incremental migration with feature flags
- [ ] Comprehensive testing at each phase
- [ ] Stakeholder approval at each milestone

### **Rollback Triggers**
- Build time regression >20%
- Critical functionality broken
- Developer productivity significantly impacted
- Timeline exceeded by >50%

---

*This migration plan will be updated as we progress through each phase and encounter real-world challenges.*
