#!/usr/bin/env node

/**
 * 简化版表单自动化填充脚本
 * 
 * 功能：根据JSON配置自动填充HTML表单
 * 
 * 使用方法：
 *   node form-auto-filler.js              # 使用默认配置填充
 *   node form-auto-filler.js --config custom.json  # 使用自定义配置
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// 默认测试配置
const defaultConfig = {
  url: 'file://' + path.resolve(__dirname, 'form-auto-test.html'),
  formData: {
    username: 'zhang_san',
    email: 'zhangsan@example.com',
    phone: '13800138000',
    gender: 'male',
    department: 'tech',
    skills: ['js', 'vue', 'node'],
    reason: '申请参加前端技术培训，提升专业技能。'
  },
  headless: false,
  slowMo: 50
};

// 填充输入框
async function fillInput(page, selector, value) {
  await page.waitForSelector(selector, { timeout: 5000 });
  await page.$eval(selector, el => el.value = '');
  await page.type(selector, String(value), { delay: 30 });
}

// 填充文本域
async function fillTextarea(page, selector, value) {
  await page.waitForSelector(selector, { timeout: 5000 });
  await page.$eval(selector, el => el.value = '');
  await page.type(selector, String(value), { delay: 30 });
}

// 选择单选按钮
async function selectRadio(page, value) {
  await page.click(`input[type="radio"][value="${value}"]`);
}

// 选择下拉框
async function selectDropdown(page, selector, value) {
  await page.select(selector, value);
}

// 选择复选框
async function selectCheckboxes(page, values) {
  for (const value of values) {
    await page.click(`input[type="checkbox"][value="${value}"]`);
    await page.waitForTimeout(100);
  }
}

// 主函数
async function main() {
  // 解析命令行参数
  const args = process.argv.slice(2);
  let config = { ...defaultConfig };
  
  if (args.includes('--config')) {
    const configIndex = args.indexOf('--config');
    const configPath = args[configIndex + 1];
    if (configPath && fs.existsSync(configPath)) {
      const customConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      config = { ...config, ...customConfig };
    }
  }

  console.log('\n🚀 启动浏览器...');
  console.log(`📍 访问页面: ${config.url}\n`);

  const browser = await puppeteer.launch({
    headless: config.headless ? 'new' : false,
    slowMo: config.slowMo || 0,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  try {
    // 访问页面
    await page.goto(config.url, { waitUntil: 'networkidle0', timeout: 10000 });
    console.log('✅ 页面加载成功\n');

    const { formData } = config;

    // 填充表单
    console.log('📝 开始填充表单...\n');

    await fillInput(page, '#username', formData.username);
    console.log(`  ✅ username: ${formData.username}`);

    await fillInput(page, '#email', formData.email);
    console.log(`  ✅ email: ${formData.email}`);

    await fillInput(page, '#phone', formData.phone);
    console.log(`  ✅ phone: ${formData.phone}`);

    await selectRadio(page, formData.gender);
    console.log(`  ✅ gender: ${formData.gender}`);

    await selectDropdown(page, '#department', formData.department);
    console.log(`  ✅ department: ${formData.department}`);

    await selectCheckboxes(page, formData.skills);
    console.log(`  ✅ skills: [${formData.skills.join(', ')}]`);

    await fillTextarea(page, '#reason', formData.reason);
    console.log(`  ✅ reason: ${formData.reason.slice(0, 30)}...`);

    console.log('\n✅ 表单填充完成!');
    console.log('\n你可以:');
    console.log('  1. 查看页面确认填充结果');
    console.log('  2. 点击"提交审批"按钮测试表单提交\n');

    // 等待一会儿让用户查看
    await page.waitForTimeout(2000);

  } catch (error) {
    console.error('\n❌ 执行失败:', error.message);
    process.exit(1);
  } finally {
    // 不关闭浏览器，让用户查看结果
    console.log('按 Ctrl+C 退出...\n');
  }
}

main();
