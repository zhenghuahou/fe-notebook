# Vite 中通过 npm run build 往 process.env 注入自定义变量

在 Vite 项目中，有多种方式可以在构建时往 `process.env` 注入自定义变量。以下是常用的几种方法：

## 1. 使用 .env 文件

### 1.1 创建环境变量文件

```bash
# .env (所有环境)
VITE_APP_TITLE=My App
VITE_API_BASE_URL=https://api.example.com

# .env.local (本地环境，会被 git 忽略)
VITE_LOCAL_API_KEY=local-dev-key

# .env.development (开发环境)
VITE_API_BASE_URL=https://dev-api.example.com
VITE_DEBUG_MODE=true

# .env.production (生产环境)
VITE_API_BASE_URL=https://prod-api.example.com
VITE_DEBUG_MODE=false

# .env.staging (预发布环境)
VITE_API_BASE_URL=https://staging-api.example.com
VITE_DEBUG_MODE=false
```

### 1.2 在代码中使用

```javascript
// 在 Vue 组件或 JS 文件中使用
console.log(import.meta.env.VITE_APP_TITLE)
console.log(import.meta.env.VITE_API_BASE_URL)
console.log(import.meta.env.VITE_DEBUG_MODE)

// 在 Vue 组件中
export default {
  data() {
    return {
      apiUrl: import.meta.env.VITE_API_BASE_URL,
      isDebug: import.meta.env.VITE_DEBUG_MODE === 'true'
    }
  }
}
```

## 2. 通过 package.json scripts 注入

### 2.1 在 package.json 中定义脚本

```json
{
  "scripts": {
    "build": "vite build",
    "build:staging": "cross-env VITE_ENV=staging VITE_API_URL=https://staging-api.com vite build",
    "build:prod": "cross-env VITE_ENV=production VITE_API_URL=https://prod-api.com vite build",
    "build:custom": "cross-env VITE_CUSTOM_VAR=custom-value VITE_BUILD_TIME=$(date +%s) vite build"
  },
  "devDependencies": {
    "cross-env": "^7.0.3"
  }
}
```

### 2.2 运行构建命令

```bash
# 安装 cross-env (跨平台环境变量设置)
npm install --save-dev cross-env

# 运行不同的构建命令
npm run build:staging
npm run build:prod
npm run build:custom
```

## 3. 通过 vite.config.js 配置

### 3.1 使用 define 选项

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  define: {
    // 注入全局常量
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __COMMIT_HASH__: JSON.stringify(process.env.COMMIT_HASH || 'unknown'),
    
    // 注入环境变量
    'process.env.CUSTOM_API_URL': JSON.stringify(process.env.CUSTOM_API_URL || 'https://default-api.com'),
    'process.env.FEATURE_FLAGS': JSON.stringify({
      enableNewUI: process.env.ENABLE_NEW_UI === 'true',
      enableAnalytics: process.env.ENABLE_ANALYTICS !== 'false'
    })
  }
})
```

### 3.2 动态配置环境变量

```javascript
// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command, mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [vue()],
    define: {
      // 将所有 VITE_ 开头的变量注入到 process.env
      ...Object.keys(env).reduce((prev, key) => {
        if (key.startsWith('VITE_')) {
          prev[`process.env.${key}`] = JSON.stringify(env[key])
        }
        return prev
      }, {}),
      
      // 注入构建信息
      'process.env.BUILD_MODE': JSON.stringify(mode),
      'process.env.BUILD_COMMAND': JSON.stringify(command),
      'process.env.BUILD_TIMESTAMP': JSON.stringify(Date.now())
    }
  }
})
```

## 4. 使用插件注入变量

### 4.1 自定义插件

```javascript
// plugins/inject-env.js
export function injectEnvPlugin(envVars = {}) {
  return {
    name: 'inject-env',
    config(config, { command, mode }) {
      const defines = config.define || {}
      
      // 注入自定义环境变量
      Object.keys(envVars).forEach(key => {
        defines[`process.env.${key}`] = JSON.stringify(envVars[key])
      })
      
      // 注入构建信息
      defines['process.env.BUILD_INFO'] = JSON.stringify({
        mode,
        command,
        timestamp: new Date().toISOString(),
        nodeVersion: process.version
      })
      
      config.define = defines
    }
  }
}

// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { injectEnvPlugin } from './plugins/inject-env.js'

export default defineConfig({
  plugins: [
    vue(),
    injectEnvPlugin({
      CUSTOM_API_ENDPOINT: process.env.CUSTOM_API_ENDPOINT || 'https://api.example.com',
      FEATURE_TOGGLE_A: process.env.FEATURE_TOGGLE_A === 'true',
      APP_VERSION: process.env.npm_package_version
    })
  ]
})
```

### 4.2 使用现有插件

```bash
# 安装环境变量插件
npm install --save-dev @rollup/plugin-replace
```

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import replace from '@rollup/plugin-replace'

export default defineConfig({
  plugins: [
    vue(),
    replace({
      preventAssignment: true,
      values: {
        'process.env.CUSTOM_VAR': JSON.stringify(process.env.CUSTOM_VAR || 'default'),
        'process.env.BUILD_VERSION': JSON.stringify(process.env.npm_package_version),
        '__BUILD_DATE__': JSON.stringify(new Date().toLocaleDateString())
      }
    })
  ]
})
```

## 5. 通过 CI/CD 注入变量

### 5.1 GitHub Actions 示例

```yaml
# .github/workflows/build.yml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build with custom env vars
      run: |
        export VITE_BUILD_NUMBER=${{ github.run_number }}
        export VITE_COMMIT_SHA=${{ github.sha }}
        export VITE_BRANCH_NAME=${{ github.ref_name }}
        export VITE_BUILD_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
        npm run build
      env:
        VITE_API_URL: ${{ secrets.PROD_API_URL }}
        VITE_API_KEY: ${{ secrets.PROD_API_KEY }}
```

### 5.2 Docker 构建示例

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

# 构建时注入环境变量
ARG VITE_API_URL
ARG VITE_APP_VERSION
ARG BUILD_TIME

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_VERSION=$VITE_APP_VERSION
ENV VITE_BUILD_TIME=$BUILD_TIME

RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

```bash
# 构建 Docker 镜像时注入变量
docker build \
  --build-arg VITE_API_URL=https://prod-api.com \
  --build-arg VITE_APP_VERSION=1.0.0 \
  --build-arg BUILD_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ") \
  -t my-app .
```

## 6. 实际应用示例

### 6.1 多环境配置

```javascript
// config/env.config.js
const envConfigs = {
  development: {
    VITE_API_BASE_URL: 'http://localhost:3000/api',
    VITE_ENABLE_MOCK: 'true',
    VITE_LOG_LEVEL: 'debug'
  },
  staging: {
    VITE_API_BASE_URL: 'https://staging-api.example.com/api',
    VITE_ENABLE_MOCK: 'false',
    VITE_LOG_LEVEL: 'info'
  },
  production: {
    VITE_API_BASE_URL: 'https://api.example.com/api',
    VITE_ENABLE_MOCK: 'false',
    VITE_LOG_LEVEL: 'error'
  }
}

export default envConfigs

// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import envConfigs from './config/env.config.js'

export default defineConfig(({ mode }) => {
  const envConfig = envConfigs[mode] || envConfigs.development
  
  return {
    plugins: [vue()],
    define: {
      // 注入环境配置
      ...Object.keys(envConfig).reduce((prev, key) => {
        prev[`process.env.${key}`] = JSON.stringify(envConfig[key])
        return prev
      }, {}),
      
      // 注入构建信息
      'process.env.BUILD_MODE': JSON.stringify(mode),
      'process.env.BUILD_TIME': JSON.stringify(new Date().toISOString())
    }
  }
})
```

### 6.2 功能开关配置

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  // 从环境变量读取功能开关
  const featureFlags = {
    ENABLE_NEW_DASHBOARD: process.env.ENABLE_NEW_DASHBOARD === 'true',
    ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS !== 'false',
    ENABLE_BETA_FEATURES: process.env.ENABLE_BETA_FEATURES === 'true',
    ENABLE_DEBUG_PANEL: mode === 'development'
  }
  
  return {
    plugins: [vue()],
    define: {
      'process.env.FEATURE_FLAGS': JSON.stringify(featureFlags),
      'process.env.APP_CONFIG': JSON.stringify({
        version: process.env.npm_package_version,
        buildTime: new Date().toISOString(),
        mode,
        features: featureFlags
      })
    }
  }
})
```

## 7. 注意事项

1. **变量前缀**：Vite 只会暴露以 `VITE_` 开头的环境变量到客户端代码
2. **安全性**：不要在客户端代码中暴露敏感信息（如 API 密钥）
3. **类型转换**：环境变量都是字符串，需要手动转换类型
4. **构建时替换**：这些变量在构建时被静态替换，不是运行时动态的
5. **缓存问题**：修改环境变量后需要重新构建

## 8. 最佳实践

1. **分层配置**：使用不同的 .env 文件管理不同环境
2. **类型安全**：为环境变量创建 TypeScript 类型定义
3. **文档化**：在 README 中记录所有可用的环境变量
4. **默认值**：为所有环境变量提供合理的默认值
5. **验证**：在应用启动时验证必需的环境变量是否存在

通过这些方法，你可以灵活地在 Vite 构建过程中注入自定义环境变量，满足不同环境和部署需求。