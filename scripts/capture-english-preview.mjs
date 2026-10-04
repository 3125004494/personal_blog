import { connectBrowser, pause } from './cdp-client.mjs';
import { fileURLToPath } from 'node:url';

let browser;
let page;
try {
  browser = await connectBrowser();
  page = await browser.newPage(1440, 1000);
} catch (error) {
  // 浏览器桥接只允许现有 Proxy 连接时，复用其独立页 API。
  browser?.close();
  console.warn(`直连不可用，使用现有 CDP Proxy：${error.message}`);
  const request = async (path, options) => {
    const response = await fetch(`http://127.0.0.1:3456${path}`, options);
    if (!response.ok) throw new Error(`CDP Proxy 请求失败：${response.status}`);
    return response.json();
  };
  const { targetId } = await request('/new', {method:'POST', body:'about:blank'});
  browser = {close() {}};
  page = {
    async navigate(url) { await request(`/navigate?target=${targetId}`, {method:'POST',body:url}); },
    async evaluate(expression) { return (await request(`/eval?target=${targetId}`, {method:'POST',body:expression})).value; },
    async screenshot(path) { await request(`/screenshot?target=${targetId}&file=${encodeURIComponent(path)}`); },
    async close() { await request(`/close?target=${targetId}`); },
  };
}
try {
  await page.navigate('http://127.0.0.1:5183/');
  for (let attempt = 0; attempt < 60; attempt++) {
    const ready = await page.evaluate("document.querySelectorAll('#overview-cards .metric-card').length === 4 && document.querySelectorAll('#band-chart .bar-item').length === 5");
    if (ready) break;
    if (attempt === 59) throw new Error('英语系统概览未完成加载');
    await pause(200);
  }
  console.log(await page.evaluate("JSON.stringify({title: document.title, cards: document.querySelector('#overview-cards').innerText, chart: document.querySelector('#band-chart').innerText, overflow: document.documentElement.scrollWidth > innerWidth})"));
  // 扩展浮层不属于课设界面，仅在此新建页面隐藏已确认的扩展节点。
  await page.evaluate("document.querySelectorAll('plasmo-csui, #immersive-translate-popup').forEach(el => { el.style.display = 'none'; })");
  await pause(300);
  await page.screenshot(fileURLToPath(new URL('../public/assets/english-practice.png', import.meta.url)));
} finally {
  await page.close();
  browser.close();
}
