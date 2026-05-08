# Node.js 获取当前执行的 npm 包命令

在 Node.js 中，有多种方式可以获取当前执行的 npm 包命令。以下是常用的几种方法：

## 1. 使用 process.env.npm_lifecycle_event

这是最直接的方法，可以获取当前执行的 npm script 名称。

```javascript
// 获取当前执行的 npm script 命令
const currentCommand = process.env.npm_lifecycle_event;
console.log('当前执行的命令:', currentCommand);

// 示例输出：
// npm run build -> 输出: build
// npm run dev -> 输出: dev
// npm start -> 输出: start
// npm test -> 输出: test
```

## 2. 使用 process.env.npm_command

获取 npm 的具体命令类型。

```javascript
// 获取 npm 命令类型
const npmCommand = process.env.npm_command;
console.log('npm 命令类型:', npmCommand);

// 示例输出：
// npm run build -> 输出: run-script
// npm install -> 输出: install
// npm start -> 输出: start
```

## 3. 使用 process.argv 解析命令行参数

通过解析命令行参数来获取执行信息。

```javascript
// 获取完整的命令行参数
console.log('命令行参数:', process.argv);

// 解析 npm 相关信息
function getNpmCommandInfo() {
  const argv = process.argv;
  const info = {
    nodeExecutable: argv[0],
    scriptPath: argv[1],
    args: argv.slice(2),
    npmLifecycleEvent: process.env.npm_lifecycle_event,
    npmCommand: process.env.npm_command,
    npmConfigUserAgent: process.env.npm_config_user_agent
  };
  
  return info;
}

const commandInfo = getNpmCommandInfo();
console.log('命令信息:', commandInfo);
```

## 4. 检测是否通过 npm 执行

判断当前脚本是否通过 npm 命令执行。

```javascript
// 检测是否通过 npm 执行
function isRunByNpm() {
  return !!(
    process.env.npm_lifecycle_event ||
    process.env.npm_command ||
    process.env.npm_execpath ||
    process.env.npm_config_user_agent
  );
}

console.log('是否通过 npm 执行:', isRunByNpm());

// 获取详细的 npm 执行信息
function getNpmExecutionInfo() {
  if (!isRunByNpm()) {
    return { isNpm: false, message: '不是通过 npm 执行' };
  }
  
  return {
    isNpm: true,
    lifecycleEvent: process.env.npm_lifecycle_event,
    command: process.env.npm_command,
    execPath: process.env.npm_execpath,
    userAgent: process.env.npm_config_user_agent,
    packageName: process.env.npm_package_name,
    packageVersion: process.env.npm_package_version
  };
}

console.log('npm 执行信息:', getNpmExecutionInfo());
```

## 5. 获取 package.json 中的脚本信息

读取并解析 package.json 中的 scripts 配置。

```javascript
const fs = require('fs');
const path = require('path');

// 读取 package.json
function getPackageScripts() {
  try {
    const packagePath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    return packageJson.scripts || {};
  } catch (error) {
    console.error('读取 package.json 失败:', error.message);
    return {};
  }
}

// 获取当前执行的脚本内容
function getCurrentScriptContent() {
  const currentEvent = process.env.npm_lifecycle_event;
  const scripts = getPackageScripts();
  
  if (currentEvent && scripts[currentEvent]) {
    return {
      scriptName: currentEvent,
      scriptContent: scripts[currentEvent],
      allScripts: scripts
    };
  }
  
  return {
    scriptName: currentEvent || 'unknown',
    scriptContent: null,
    allScripts: scripts
  };
}

console.log('当前脚本信息:', getCurrentScriptContent());
```

## 6. 实用工具函数

创建一个综合的工具函数来获取所有相关信息。

```javascript
// utils/npm-command-detector.js
class NpmCommandDetector {
  constructor() {
    this.env = process.env;
    this.argv = process.argv;
  }
  
  // 获取当前执行的 npm 命令
  getCurrentCommand() {
    return this.env.npm_lifecycle_event || null;
  }
  
  // 获取 npm 命令类型
  getCommandType() {
    return this.env.npm_command || null;
  }
  
  // 检查是否通过 npm 执行
  isNpmExecution() {
    return !!(
      this.env.npm_lifecycle_event ||
      this.env.npm_command ||
      this.env.npm_execpath
    );
  }
  
  // 获取包信息
  getPackageInfo() {
    return {
      name: this.env.npm_package_name,
      version: this.env.npm_package_version,
      description: this.env.npm_package_description
    };
  }
  
  // 获取 npm 配置信息
  getNpmConfig() {
    const config = {};
    Object.keys(this.env).forEach(key => {
      if (key.startsWith('npm_config_')) {
        const configKey = key.replace('npm_config_', '');
        config[configKey] = this.env[key];
      }
    });
    return config;
  }
  
  // 获取完整的执行上下文
  getExecutionContext() {
    return {
      isNpmExecution: this.isNpmExecution(),
      currentCommand: this.getCurrentCommand(),
      commandType: this.getCommandType(),
      packageInfo: this.getPackageInfo(),
      npmConfig: this.getNpmConfig(),
      userAgent: this.env.npm_config_user_agent,
      nodeVersion: process.version,
      platform: process.platform,
      cwd: process.cwd(),
      argv: this.argv
    };
  }
  
  // 格式化输出
  printInfo() {
    const context = this.getExecutionContext();
    
    console.log('=== NPM 命令执行信息 ===');
    console.log(`是否通过 npm 执行: ${context.isNpmExecution}`);
    
    if (context.isNpmExecution) {
      console.log(`当前命令: ${context.currentCommand || '未知'}`);
      console.log(`命令类型: ${context.commandType || '未知'}`);
      console.log(`包名: ${context.packageInfo.name || '未知'}`);
      console.log(`包版本: ${context.packageInfo.version || '未知'}`);
      console.log(`用户代理: ${context.userAgent || '未知'}`);
    }
    
    console.log(`Node.js 版本: ${context.nodeVersion}`);
    console.log(`工作目录: ${context.cwd}`);
    console.log('========================');
    
    return context;
  }
}

// 使用示例
const detector = new NpmCommandDetector();
const info = detector.printInfo();

// 导出工具类
module.exports = NpmCommandDetector;
```

## 7. 在不同场景中的应用

### 7.1 构建脚本中的应用

```javascript
// scripts/build.js
const NpmCommandDetector = require('../utils/npm-command-detector');

const detector = new NpmCommandDetector();
const currentCommand = detector.getCurrentCommand();

console.log(`执行构建命令: ${currentCommand}`);

// 根据不同的命令执行不同的构建逻辑
switch (currentCommand) {
  case 'build:dev':
    console.log('执行开发环境构建');
    process.env.NODE_ENV = 'development';
    break;
  case 'build:prod':
    console.log('执行生产环境构建');
    process.env.NODE_ENV = 'production';
    break;
  case 'build:staging':
    console.log('执行预发布环境构建');
    process.env.NODE_ENV = 'staging';
    break;
  default:
    console.log('执行默认构建');
}
```

### 7.2 在 package.json scripts 中的应用

```json
{
  "scripts": {
    "dev": "node scripts/dev.js",
    "build": "node scripts/build.js",
    "build:dev": "node scripts/build.js",
    "build:prod": "node scripts/build.js",
    "test": "node scripts/test.js",
    "deploy": "node scripts/deploy.js"
  }
}
```

### 7.3 条件执行逻辑

```javascript
// scripts/conditional-script.js
const currentCommand = process.env.npm_lifecycle_event;

// 根据命令执行不同的逻辑
const commandHandlers = {
  'dev': () => {
    console.log('启动开发服务器');
    // 开发服务器逻辑
  },
  'build': () => {
    console.log('执行构建');
    // 构建逻辑
  },
  'test': () => {
    console.log('运行测试');
    // 测试逻辑
  },
  'deploy': () => {
    console.log('执行部署');
    // 部署逻辑
  }
};

const handler = commandHandlers[currentCommand];
if (handler) {
  handler();
} else {
  console.log(`未知命令: ${currentCommand}`);
}
```

## 8. 环境变量完整列表

npm 执行时会设置大量的环境变量：

```javascript
// 打印所有 npm 相关的环境变量
function printNpmEnvVars() {
  console.log('=== NPM 环境变量 ===');
  
  Object.keys(process.env)
    .filter(key => key.startsWith('npm_'))
    .sort()
    .forEach(key => {
      console.log(`${key}: ${process.env[key]}`);
    });
}

printNpmEnvVars();

// 常见的 npm 环境变量：
// npm_command - npm 命令类型
// npm_lifecycle_event - 当前执行的脚本名称
// npm_package_name - 包名
// npm_package_version - 包版本
// npm_config_user_agent - npm 用户代理
// npm_execpath - npm 可执行文件路径
// npm_node_execpath - node 可执行文件路径
```

## 9. 注意事项

1. **环境变量的可用性**：只有通过 npm 执行的脚本才会有这些环境变量
2. **跨平台兼容性**：某些环境变量在不同操作系统上可能有差异
3. **版本差异**：不同版本的 npm 可能提供不同的环境变量
4. **安全性**：避免在生产环境中暴露敏感的环境变量信息

通过这些方法，你可以准确地获取当前执行的 npm 包命令，并根据不同的命令执行相应的逻辑。