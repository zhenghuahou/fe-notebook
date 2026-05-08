# npm_lifecycle_event 详解

`npm_lifecycle_event` 是 npm 在执行脚本时自动设置的一个环境变量，它表示当前正在执行的生命周期事件（脚本名称）。

## 1. 基本概念

### 1.1 什么是 npm_lifecycle_event

`npm_lifecycle_event` 是一个特殊的环境变量，当你通过 npm 执行 package.json 中定义的脚本时，npm 会自动将当前执行的脚本名称设置到这个环境变量中。

```javascript
// 在任何 npm 脚本中都可以访问
console.log('当前执行的脚本:', process.env.npm_lifecycle_event);
```

### 1.2 生命周期事件的含义

npm 脚本执行遵循特定的生命周期，每个阶段都有对应的事件名称：

```json
{
  "scripts": {
    "prestart": "echo 'before start'",
    "start": "node server.js",
    "poststart": "echo 'after start'",
    
    "prebuild": "echo 'before build'",
    "build": "webpack",
    "postbuild": "echo 'after build'",
    
    "pretest": "echo 'before test'",
    "test": "jest",
    "posttest": "echo 'after test'"
  }
}
```

## 2. 生命周期事件类型

### 2.1 内置生命周期事件

npm 有一些内置的生命周期事件：

```bash
# 安装相关
npm install
# npm_lifecycle_event: preinstall -> install -> postinstall

# 发布相关
npm publish
# npm_lifecycle_event: prepublish -> prepare -> prepublishOnly -> publish -> postpublish

# 版本相关
npm version
# npm_lifecycle_event: preversion -> version -> postversion

# 测试相关
npm test
# npm_lifecycle_event: pretest -> test -> posttest

# 启动相关
npm start
# npm_lifecycle_event: prestart -> start -> poststart
```

### 2.2 自定义脚本事件

```json
{
  "scripts": {
    "dev": "webpack-dev-server",
    "build": "webpack --mode=production",
    "build:dev": "webpack --mode=development",
    "build:staging": "webpack --mode=staging",
    "deploy": "node deploy.js",
    "lint": "eslint src/",
    "format": "prettier --write src/"
  }
}
```

执行这些脚本时的 `npm_lifecycle_event` 值：

```bash
npm run dev          # npm_lifecycle_event = "dev"
npm run build        # npm_lifecycle_event = "build"
npm run build:dev    # npm_lifecycle_event = "build:dev"
npm run deploy       # npm_lifecycle_event = "deploy"
```

## 3. 实际应用示例

### 3.1 根据脚本名称执行不同逻辑

```javascript
// scripts/universal-script.js
const scriptName = process.env.npm_lifecycle_event;

console.log(`执行脚本: ${scriptName}`);

switch (scriptName) {
  case 'build':
    console.log('执行生产环境构建');
    process.env.NODE_ENV = 'production';
    break;
    
  case 'build:dev':
    console.log('执行开发环境构建');
    process.env.NODE_ENV = 'development';
    break;
    
  case 'build:staging':
    console.log('执行预发布环境构建');
    process.env.NODE_ENV = 'staging';
    break;
    
  case 'dev':
    console.log('启动开发服务器');
    process.env.NODE_ENV = 'development';
    break;
    
  default:
    console.log(`未知脚本: ${scriptName}`);
}

// 根据脚本名称设置不同的配置
const config = {
  build: {
    minify: true,
    sourcemap: false,
    outputDir: 'dist'
  },
  'build:dev': {
    minify: false,
    sourcemap: true,
    outputDir: 'dist-dev'
  },
  dev: {
    hot: true,
    port: 3000,
    open: true
  }
};

const currentConfig = config[scriptName] || {};
console.log('当前配置:', currentConfig);
```

### 3.2 在 package.json 中使用

```json
{
  "scripts": {
    "build": "node scripts/universal-script.js",
    "build:dev": "node scripts/universal-script.js",
    "build:staging": "node scripts/universal-script.js",
    "dev": "node scripts/universal-script.js"
  }
}
```

### 3.3 条件执行和环境配置

```javascript
// scripts/env-setup.js
const lifecycleEvent = process.env.npm_lifecycle_event;

// 环境变量映射
const envMapping = {
  'dev': 'development',
  'build': 'production',
  'build:dev': 'development',
  'build:prod': 'production',
  'build:staging': 'staging',
  'test': 'test',
  'test:unit': 'test',
  'test:e2e': 'test'
};

// 设置 NODE_ENV
const nodeEnv = envMapping[lifecycleEvent] || 'development';
process.env.NODE_ENV = nodeEnv;

console.log(`脚本: ${lifecycleEvent}`);
console.log(`环境: ${nodeEnv}`);

// 根据脚本设置特定的环境变量
switch (lifecycleEvent) {
  case 'build':
  case 'build:prod':
    process.env.MINIFY = 'true';
    process.env.SOURCE_MAP = 'false';
    process.env.API_URL = 'https://api.production.com';
    break;
    
  case 'build:staging':
    process.env.MINIFY = 'true';
    process.env.SOURCE_MAP = 'true';
    process.env.API_URL = 'https://api.staging.com';
    break;
    
  case 'dev':
  case 'build:dev':
    process.env.MINIFY = 'false';
    process.env.SOURCE_MAP = 'true';
    process.env.API_URL = 'http://localhost:3001';
    process.env.HOT_RELOAD = 'true';
    break;
    
  case 'test':
  case 'test:unit':
    process.env.API_URL = 'http://localhost:3002';
    process.env.MOCK_API = 'true';
    break;
}
```

## 4. 生命周期钩子详解

### 4.1 pre 和 post 钩子

npm 会自动执行 `pre<script>` 和 `post<script>` 钩子：

```json
{
  "scripts": {
    "prebuild": "echo 'Starting build process...'",
    "build": "webpack",
    "postbuild": "echo 'Build completed!'",
    
    "pretest": "npm run lint",
    "test": "jest",
    "posttest": "npm run coverage"
  }
}
```

执行 `npm run build` 时的生命周期事件顺序：
1. `npm_lifecycle_event = "prebuild"`
2. `npm_lifecycle_event = "build"`
3. `npm_lifecycle_event = "postbuild"`

### 4.2 监听生命周期事件

```javascript
// scripts/lifecycle-monitor.js
const currentEvent = process.env.npm_lifecycle_event;
const timestamp = new Date().toISOString();

console.log(`[${timestamp}] 生命周期事件: ${currentEvent}`);

// 记录到日志文件
const fs = require('fs');
const logEntry = `${timestamp} - ${currentEvent}\n`;
fs.appendFileSync('build.log', logEntry);

// 根据事件类型执行不同操作
if (currentEvent.startsWith('pre')) {
  console.log('执行前置操作...');
} else if (currentEvent.startsWith('post')) {
  console.log('执行后置清理...');
} else {
  console.log('执行主要操作...');
}
```

## 5. 高级应用场景

### 5.1 动态配置加载

```javascript
// config/dynamic-config.js
const lifecycleEvent = process.env.npm_lifecycle_event;

// 根据脚本名称加载不同的配置文件
const configFiles = {
  'dev': './config.dev.js',
  'build': './config.prod.js',
  'build:dev': './config.dev.js',
  'build:staging': './config.staging.js',
  'test': './config.test.js'
};

const configFile = configFiles[lifecycleEvent] || './config.default.js';

try {
  const config = require(configFile);
  console.log(`加载配置文件: ${configFile}`);
  module.exports = config;
} catch (error) {
  console.error(`配置文件加载失败: ${configFile}`, error);
  module.exports = require('./config.default.js');
}
```

### 5.2 构建工具集成

```javascript
// webpack.config.js
const lifecycleEvent = process.env.npm_lifecycle_event;

const baseConfig = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  }
};

// 根据生命周期事件调整配置
switch (lifecycleEvent) {
  case 'dev':
    module.exports = {
      ...baseConfig,
      mode: 'development',
      devtool: 'eval-source-map',
      devServer: {
        hot: true,
        port: 3000
      }
    };
    break;
    
  case 'build':
    module.exports = {
      ...baseConfig,
      mode: 'production',
      optimization: {
        minimize: true
      }
    };
    break;
    
  case 'build:analyze':
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    module.exports = {
      ...baseConfig,
      mode: 'production',
      plugins: [
        new BundleAnalyzerPlugin()
      ]
    };
    break;
    
  default:
    module.exports = baseConfig;
}
```

### 5.3 部署脚本

```javascript
// scripts/deploy.js
const lifecycleEvent = process.env.npm_lifecycle_event;

const deployConfigs = {
  'deploy:dev': {
    server: 'dev.example.com',
    path: '/var/www/dev',
    branch: 'develop'
  },
  'deploy:staging': {
    server: 'staging.example.com',
    path: '/var/www/staging',
    branch: 'staging'
  },
  'deploy:prod': {
    server: 'prod.example.com',
    path: '/var/www/production',
    branch: 'main'
  }
};

const config = deployConfigs[lifecycleEvent];

if (!config) {
  console.error(`未知的部署脚本: ${lifecycleEvent}`);
  process.exit(1);
}

console.log(`部署到: ${config.server}`);
console.log(`路径: ${config.path}`);
console.log(`分支: ${config.branch}`);

// 执行部署逻辑
async function deploy() {
  try {
    console.log('开始部署...');
    // 部署逻辑
    console.log('部署完成!');
  } catch (error) {
    console.error('部署失败:', error);
    process.exit(1);
  }
}

deploy();
```

## 6. 调试和监控

### 6.1 生命周期事件日志

```javascript
// scripts/lifecycle-logger.js
const fs = require('fs');
const path = require('path');

const lifecycleEvent = process.env.npm_lifecycle_event;
const timestamp = new Date().toISOString();
const logDir = path.join(process.cwd(), 'logs');

// 确保日志目录存在
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFile = path.join(logDir, 'lifecycle.log');
const logEntry = {
  timestamp,
  event: lifecycleEvent,
  cwd: process.cwd(),
  nodeVersion: process.version,
  npmVersion: process.env.npm_version || 'unknown'
};

// 写入日志
fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');

console.log(`生命周期事件已记录: ${lifecycleEvent}`);
```

### 6.2 环境变量检查

```javascript
// scripts/env-check.js
const lifecycleEvent = process.env.npm_lifecycle_event;

console.log('=== 环境变量检查 ===');
console.log(`当前脚本: ${lifecycleEvent}`);
console.log(`Node.js 版本: ${process.version}`);
console.log(`工作目录: ${process.cwd()}`);

// 检查必需的环境变量
const requiredEnvVars = {
  'build': ['NODE_ENV'],
  'deploy:prod': ['DEPLOY_KEY', 'PROD_SERVER'],
  'test': ['TEST_DB_URL']
};

const required = requiredEnvVars[lifecycleEvent] || [];
const missing = required.filter(varName => !process.env[varName]);

if (missing.length > 0) {
  console.error(`缺少必需的环境变量: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('环境变量检查通过!');
```

## 7. 注意事项和最佳实践

### 7.1 注意事项

1. **只在 npm 脚本中可用**：`npm_lifecycle_event` 只在通过 npm 执行的脚本中才会设置
2. **大小写敏感**：脚本名称是大小写敏感的
3. **特殊字符**：脚本名称中的特殊字符会原样保留

### 7.2 最佳实践

```javascript
// 安全地获取生命周期事件
function getLifecycleEvent() {
  const event = process.env.npm_lifecycle_event;
  
  if (!event) {
    console.warn('未检测到 npm_lifecycle_event，可能不是通过 npm 执行');
    return null;
  }
  
  return event;
}

// 使用示例
const currentEvent = getLifecycleEvent();

if (currentEvent) {
  console.log(`当前执行的脚本: ${currentEvent}`);
  // 执行相应逻辑
} else {
  console.log('直接通过 node 执行');
  // 默认逻辑
}
```

`npm_lifecycle_event` 是一个非常有用的环境变量，它让我们能够编写更智能、更灵活的构建脚本，根据不同的执行上下文采取不同的行为。