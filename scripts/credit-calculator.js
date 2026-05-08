#!/usr/bin/env node

/**
 * 订单额度测算自动化脚本 (Playwright版)
 * 手机预览 375x667
 * 支持复用已打开的Chrome窗口
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const CONFIG = {
  homeUrl: 'https://www.baidu.com',
  orderListUrl: 'https://show.langgpt.ai/',
  targetAmount: '20000',
  screenshotDir: path.join(__dirname, 'screenshots'),
  waitTime:  30 * 1000,
  viewport: { width: 375, height: 667 },
  debugPort: 9222,
  userDataDir: path.join(__dirname, '.chrome-data')
};

if (!fs.existsSync(CONFIG.screenshotDir)) fs.mkdirSync(CONFIG.screenshotDir, { recursive: true });

/**
 * 连接已打开的Chrome或启动新的
 * 返回: { context, browser } - context是BrowserContext, browser是可选的Browser
 */
async function getContext() {
  // 尝试连接已有的Chrome实例（通过CDP）
  try {
    const browser = await chromium.connectOverCDP(`http://localhost:${CONFIG.debugPort}`);
    console.log('✅ 已连接到已有Chrome窗口 (port:', CONFIG.debugPort + ')');
    const context = browser.contexts()[0];
    return { context, browser };
  } catch (e) {
    console.log('⚠️ 未找到已打开的Chrome，启动新窗口...');
    const context = await chromium.launchPersistentContext(CONFIG.userDataDir, {
      headless: false,
      viewport: CONFIG.viewport,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        `--remote-debugging-port=${CONFIG.debugPort}`
      ]
    });
    console.log('✅ 新Chrome窗口已启动 (调试端口:', CONFIG.debugPort + ')');
    return { context };
  }
}

/**
 * 截图保存 - 以页面标题命名
 */
async function shot(page) {
  try {
    const title = await page.title().catch(() => '');
    const t = title.replace(/[\/\\:*?"<>|]/g, '_').slice(0, 50);
    const f = `${t}_${Date.now()}.png`;
    await page.screenshot({ path: path.join(CONFIG.screenshotDir, f), fullPage: true });
    console.log(`  📸 ${f}`);
  } catch (e) {
    console.log(`  📸 截图失败:${e.message}`);
  }
}

async function main() {
  console.log('\n🚀 额度测算自动化 Playwright版 (375x667)\n');

  // 复用已有窗口或启动新的
  const { context } = await getContext();

  // 新建页面
  const page = await context.newPage();
  console.log('✅ 新建tab页\n');

  try {
    // 1. 访问首页，等待3分钟
    console.log('[1] 访问首页，等待3分钟...');
    await page.goto(CONFIG.homeUrl, { waitUntil: 'networkidle', timeout: 60000 });
    await shot(page);

    const start = Date.now();
    while (Date.now() - start < CONFIG.waitTime) {
      const s = Math.floor((Date.now() - start) / 1000);
      if (s % 30 === 0) console.log(`  ...${Math.floor(s/60)}分${s%60}秒`);
      await page.waitForTimeout(2000);
    }
    console.log('  ✅ 等待结束\n');

    // 2. 打开订单列表
    console.log('[2] 打开订单列表...');
    await page.goto(CONFIG.orderListUrl, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(3000);
    await shot(page);
    return;

    // 3. 点击处理中订单
    console.log('[3] 查找"处理中"订单...');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);

    const clicked = await page.evaluate(() => {
      for (const el of document.querySelectorAll('*')) {
        if (el.textContent?.includes('处理中') && el.offsetParent !== null) {
          let t = el;
          while (t?.tagName !== 'BODY') {
            if (t.onclick || t.tagName === 'A' || t.tagName === 'BUTTON') {
              t.click(); return true;
            }
            t = t.parentElement;
          }
          el.click(); return true;
        }
      }
      return false;
    });

    if (!clicked) { console.log('  ⚠️ 未找到\n'); }
    else { console.log('  ✅ 已点击\n'); }

    await page.waitForTimeout(3000);
    await shot(page);

    // 4. 切换查看模式
    console.log('[4] 切换查看模式...');
    await page.evaluate(() => {
      for (const b of document.querySelectorAll('button,[class*="mode"]')) {
        if (b.textContent?.includes('查看模式')) { b.click(); return; }
      }
    });
    await page.waitForTimeout(800);
    await page.evaluate(() => {
      for (const e of document.querySelectorAll('*')) {
        if (e.textContent?.includes('客户在场')) { e.click(); return; }
      }
    });
    console.log('  ✅ 已切换\n');
    await page.waitForTimeout(1000);
    await shot(page);

    // 5. 进入额度测算
    console.log('[5] 进入额度测算...');
    await page.evaluate(() => {
      for (const e of document.querySelectorAll('button,a,div,span')) {
        if (e.textContent?.includes('额度测算') && !e.textContent?.includes('按钮')) {
          e.click(); return;
        }
      }
    });
    console.log('  ✅ 已进入\n');
    await page.waitForTimeout(2000);
    await shot(page);

    // 6. 设置金额并测算
    console.log(`[6] 设置金额 ${CONFIG.targetAmount} 并测算...`);
    await page.evaluate((v) => {
      for (const i of document.querySelectorAll('input')) {
        if (i.offsetParent !== null) {
          i.focus();
          i.value = v;
          i.dispatchEvent(new Event('input', { bubbles: true }));
          return;
        }
      }
    }, CONFIG.targetAmount);
    await page.waitForTimeout(500);
    await page.evaluate(() => {
      for (const b of document.querySelectorAll('button')) {
        if (b.textContent?.trim() === '额度测算') { b.click(); return; }
      }
    });
    console.log('  ✅ 已执行\n');
    await page.waitForTimeout(3000);
    await shot(page);

    // 7. 检查结果
    console.log('[7] 检查结果...');
    const r = await page.evaluate(() => {
      const t = document.body.textContent;
      if (t.includes('通过') && /测算|审批/.test(t)) return 'pass';
      if (t.includes('拒绝') || t.includes('不通过')) return 'fail';
      return null;
    });

    if (r === 'pass') {
      console.log('  ✅ 通过! 返回上一页\n');
      await page.goBack();
      await page.waitForTimeout(2000);
      await shot(page);
    } else {
      console.log(r === 'fail' ? '  ❌ 拒绝' : '  ⚠️ 不确定');
      console.log('  📸 截图已保存\n');
      await shot(page);
    }

    console.log('\n✨ 完成!');

  } catch (e) {
    console.error('❌', e.message);
    await shot(page).catch(() => {});
  } finally {
    await page.waitForTimeout(5000);
    // 不关闭浏览器，保持窗口以便复用
    console.log('\n📌 浏览器窗口已保留，下次运行将复用此窗口');
  }
}

main();
