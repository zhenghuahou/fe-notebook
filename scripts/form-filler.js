#!/usr/bin/env node

/**
 * Vue3表单预审批页面自动化填充脚本
 * 
 * 功能：
 * 1. 根据不同路由页面，从JSON配置中读取表单数据
 * 2. 自动填充表单数据到对应页面
 * 3. 支持多种表单组件类型：input、textarea、radio、checkbox、select、multiselect
 * 
 * 使用方法：
 *   node form-filler.js                    # 填充所有配置的页面
 *   node form-filler.js --page /basic/vue3-config-driven-components  # 填充指定页面
 *   node form-filler.js --list             # 列出所有可用的页面配置
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// 配置路径
const CONFIG_PATH = path.join(__dirname, 'form-data-config.json');

// 读取配置
function loadConfig() {
  try {
    const configData = fs.readFileSync(CONFIG_PATH, 'utf8');
    return JSON.parse(configData);
  } catch (error) {
    console.error('❌ 配置文件加载失败:', error.message);
    process.exit(1);
  }
}

// 列出所有可用的页面配置
function listPages(config) {
  console.log('\n📋 可用的页面配置:\n');
  Object.entries(config.pages).forEach(([route, pageConfig]) => {
    console.log(`  ${route}`);
    console.log(`    └── ${pageConfig.description}`);
    if (pageConfig.formConfig?.fields) {
      console.log(`        字段数: ${pageConfig.formConfig.fields.length}`);
    }
    console.log();
  });
}

// 等待元素出现
async function waitForElement(page, selector, timeout = 5000) {
  try {
    await page.waitForSelector(selector, { timeout });
    return true;
  } catch (error) {
    return false;
  }
}

// 填充输入框
async function fillInput(page, selector, value) {
  try {
    await page.waitForSelector(selector, { timeout: 5000 });
    await page.$eval(selector, (el) => el.value = '');
    await page.type(selector, String(value), { delay: 50 });
    console.log(`  ✅ 填充 ${selector} = "${value}"`);
    return true;
  } catch (error) {
    console.log(`  ⚠️  无法填充 ${selector}: ${error.message}`);
    return false;
  }
}

// 填充文本域
async function fillTextarea(page, selector, value) {
  return fillInput(page, selector, value);
}

// 选择单选按钮
async function selectRadio(page, selector) {
  try {
    const radio = await page.$(selector);
    if (radio) {
      await radio.click();
      console.log(`  ✅ 选择单选按钮 ${selector}`);
      return true;
    }
    console.log(`  ⚠️  未找到单选按钮 ${selector}`);
    return false;
  } catch (error) {
    console.log(`  ⚠️  无法选择单选按钮 ${selector}: ${error.message}`);
    return false;
  }
}

// 选择复选框
async function selectCheckbox(page, selector, checked = true) {
  try {
    const checkbox = await page.$(selector);
    if (checkbox) {
      const isChecked = await checkbox.isChecked();
      if (isChecked !== checked) {
        await checkbox.click();
      }
      console.log(`  ✅ ${checked ? '选中' : '取消选中'}复选框 ${selector}`);
      return true;
    }
    console.log(`  ⚠️  未找到复选框 ${selector}`);
    return false;
  } catch (error) {
    console.log(`  ⚠️  无法操作复选框 ${selector}: ${error.message}`);
    return false;
  }
}

// 选择下拉框
async function selectDropdown(page, selector, value) {
  try {
    await page.select(selector, String(value));
    console.log(`  ✅ 选择下拉框 ${selector} = "${value}"`);
    return true;
  } catch (error) {
    console.log(`  ⚠️  无法选择下拉框 ${selector}: ${error.message}`);
    return false;
  }
}

// 填充多选组件 (基于自定义Vue组件)
async function fillMultiselect(page, triggerSelector, values) {
  try {
    // 点击触发器打开下拉框
    await page.click(triggerSelector);
    await page.waitForTimeout(300);

    // 选择每个值
    for (const value of values) {
      // 查找对应选项并点击
      const options = await page.$$('.multiselect__option');
      for (const option of options) {
        const label = await option.$eval('.multiselect__option-label', el => el.textContent.trim());
        if (label.includes(String(value)) || String(value).includes(label)) {
          await option.click();
          await page.waitForTimeout(100);
          break;
        }
      }
    }

    // 点击其他地方关闭下拉框
    await page.click('body');
    console.log(`  ✅ 填充多选组件 ${triggerSelector} = [${values.join(', ')}]`);
    return true;
  } catch (error) {
    console.log(`  ⚠️  无法填充多选组件 ${triggerSelector}: ${error.message}`);
    return false;
  }
}

// 根据字段类型填充
async function fillField(page, field) {
  const { selector, type, value } = field;

  switch (type) {
    case 'input':
      return fillInput(page, selector, value);
    case 'textarea':
      return fillTextarea(page, selector, value);
    case 'radio':
      return selectRadio(page, selector);
    case 'checkbox':
      return selectCheckbox(page, selector, value);
    case 'select':
      return selectDropdown(page, selector, value);
    case 'multiselect':
      return fillMultiselect(page, selector, value);
    default:
      console.log(`  ⚠️  未知字段类型: ${type}`);
      return false;
  }
}

// 执行页面表单填充前的操作
async function executePreActions(page, actions) {
  if (!actions) return;

  // 例如：选择表单类型
  if (actions.selectFormType) {
    const select = await page.$('select');
    if (select) {
      await select.select(actions.selectFormType);
      await page.waitForTimeout(500);
      console.log(`  ✅ 选择表单类型: ${actions.selectFormType}`);
    }
  }
}

// 填充单个页面的表单
async function fillPageForm(page, route, pageConfig) {
  console.log(`\n🌐 正在处理: ${route}`);
  console.log(`   描述: ${pageConfig.description}`);

  const { formConfig } = pageConfig;
  if (!formConfig) {
    console.log(`   ⚠️  该页面没有表单配置`);
    return;
  }

  // 执行预操作
  if (formConfig.actions) {
    await executePreActions(page, formConfig.actions);
  }

  // 等待表单加载
  const formSelector = formConfig.formSelector || 'form';
  const formExists = await waitForElement(page, formSelector, 5000);
  if (!formExists) {
    console.log(`   ⚠️  未找到表单: ${formSelector}`);
    return;
  }
  console.log(`   📝 开始填充表单...`);

  // 填充每个字段
  for (const field of formConfig.fields) {
    await fillField(page, field);
  }

  console.log(`   ✅ 页面表单填充完成`);
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const config = loadConfig();
  const { globalSettings, pages } = config;

  // 解析命令行参数
  if (args.includes('--list')) {
    listPages(config);
    return;
  }

  // 获取目标页面
  let targetPage = null;
  const pageIndex = args.indexOf('--page');
  if (pageIndex !== -1 && args[pageIndex + 1]) {
    targetPage = args[pageIndex + 1];
    if (!pages[targetPage]) {
      console.error(`❌ 未找到页面配置: ${targetPage}`);
      listPages(config);
      process.exit(1);
    }
  }

  // 启动浏览器
  console.log('🚀 启动浏览器...');
  const browser = await puppeteer.launch({
    headless: globalSettings.headless ? 'new' : false,
    slowMo: globalSettings.slowMo || 0,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // 设置视口
  await page.setViewport({ width: 1280, height: 800 });

  // 获取项目启动的URL (默认本地开发服务器)
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

  try {
    // 访问首页
    console.log(`\n📍 访问: ${baseUrl}`);
    await page.goto(baseUrl, { waitUntil: 'networkidle0', timeout: globalSettings.timeout });

    if (targetPage) {
      // 填充指定页面
      const fullUrl = `${baseUrl}/#/${targetPage}`;
      await page.goto(fullUrl, { waitUntil: 'networkidle0', timeout: globalSettings.timeout });
      await fillPageForm(page, targetPage, pages[targetPage]);
    } else {
      // 填充所有配置的页面
      for (const [route, pageConfig] of Object.entries(pages)) {
        const fullUrl = `${baseUrl}/#/${route}`;
        try {
          await page.goto(fullUrl, { waitUntil: 'networkidle0', timeout: globalSettings.timeout });
          await page.waitForTimeout(1000); // 等待页面渲染
          await fillPageForm(page, route, pageConfig);
        } catch (error) {
          console.log(`\n   ❌ 页面访问失败: ${error.message}`);
        }
      }
    }

    console.log('\n\n✨ 所有表单填充完成!');

  } catch (error) {
    console.error('\n❌ 执行失败:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// 运行
main();
