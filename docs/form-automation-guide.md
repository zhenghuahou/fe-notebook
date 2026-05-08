# Vue3 表单自动化填充脚本

一个简单的自动化脚本，用于根据 JSON 配置自动填充 Vue3 表单页面。

## 目录结构

```
fe-notebook/
├── scripts/
│   ├── form-filler.js          # 主自动化脚本
│   └── form-data-config.json   # 表单数据配置
├── example/
│   ├── form-auto-test.html     # 测试用HTML表单页面
│   └── form-auto-filler.js     # 简化版填充脚本
└── docs/
    └── form-automation-guide.md
```

## 快速开始

### 1. 快速测试（推荐）

首先启动一个简单的 HTTP 服务器：

```bash
# 使用 npx 启动静态服务器
npx serve example

# 或使用 Python
python -m http.server 8080
```

然后运行测试脚本：

```bash
npm run form:test
```

这会自动打开 `form-auto-test.html` 页面并填充示例数据。

### 2. 填充项目中的 Vue3 页面

首先启动项目开发服务器：

```bash
npm start
```

然后运行自动化脚本：

```bash
# 列出所有可用的页面配置
npm run form:fill:list

# 填充指定页面
npm run form:fill:page

# 或直接运行
npm run form:fill
```

## 配置文件格式

`scripts/form-data-config.json` 配置文件格式：

```json
{
  "pages": {
    "/路由路径": {
      "description": "页面描述",
      "formConfig": {
        "formSelector": "表单选择器",
        "fields": [
          {
            "name": "字段名",
            "selector": "CSS选择器",
            "type": "input|textarea|radio|checkbox|select|multiselect",
            "value": "填充值"
          }
        ]
      }
    }
  },
  "globalSettings": {
    "headless": false,
    "slowMo": 100
  }
}
```

### 支持的字段类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `input` | 文本输入框 | `{"type": "input", "value": "hello"}` |
| `textarea` | 多行文本框 | `{"type": "textarea", "value": "内容"}` |
| `radio` | 单选按钮 | `{"type": "radio", "selector": "input[value='male']"}` |
| `checkbox` | 复选框 | `{"type": "checkbox", "value": true}` |
| `select` | 下拉框 | `{"type": "select", "value": "tech"}` |
| `multiselect` | 自定义多选组件 | `{"type": "multiselect", "value": ["js", "vue"]}` |

## 使用示例

### 示例 1：填充用户注册表单

```bash
npm run form:fill:page -- /basic/vue3-config-driven-components
```

### 示例 2：创建自定义配置

1. 创建 `my-config.json`：

```json
{
  "url": "http://localhost:3000",
  "formData": {
    "username": "custom_user",
    "email": "custom@test.com",
    "department": "tech"
  }
}
```

2. 运行脚本：

```bash
node example/form-auto-filler.js --config my-config.json
```

### 示例 3：编程方式使用

```javascript
const puppeteer = require('puppeteer');

async function fillForm() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('http://your-form-page-url');
  
  // 填充表单
  await page.type('#username', 'test_user');
  await page.select('#department', 'tech');
  await page.click('input[value="male"]');
  
  // 提交
  await page.click('button[type="submit"]');
  
  await browser.close();
}

fillForm();
```

## 注意事项

1. **确保页面加载完成**：脚本会自动等待元素出现
2. **选择器准确性**：确保 CSS 选择器能唯一匹配目标元素
3. **等待时间**：对于动态加载的内容，适当增加等待时间
4. **多选组件**：Vue 自定义组件可能需要特殊处理

## 常见问题

### Q: 脚本找不到表单元素？

A: 检查：
- 页面是否完全加载
- CSS 选择器是否正确
- 元素是否在 iframe 中

### Q: 多选组件无法填充？

A: 自定义 Vue 组件需要特殊处理，可能需要：
- 点击触发器打开下拉
- 查找并点击具体选项
- 点击其他区域关闭下拉

### Q: 如何处理动态路由？

A: 修改配置中的 `url` 字段为目标页面的完整 URL。

## License

MIT
