/** 用现有 CDP 浏览器核验本地页面，只创建和关闭本脚本自己的标签页。 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

export const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function connectBrowser(webSocketUrl = 'ws://127.0.0.1:9222/devtools/browser') {
  const socket = new WebSocket(webSocketUrl);
  const pending = new Map();
  let nextId = 0;
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    const item = pending.get(message.id);
    if (!item) return;
    clearTimeout(item.timer);
    pending.delete(message.id);
    if (message.error) item.reject(new Error(message.error.message));
    else item.resolve(message.result);
  });
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('CDP 连接超时')), 10000);
    socket.addEventListener('open', () => { clearTimeout(timer); resolve(); }, { once: true });
    socket.addEventListener('error', () => { clearTimeout(timer); reject(new Error('CDP 浏览器不可用')); }, { once: true });
  });
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const id = ++nextId;
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`CDP 超时：${method}`)); }, 15000);
    pending.set(id, { resolve, reject, timer });
    socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
  return {
    send,
    async newPage(width = 1440, height = 1000, mobile = false) {
      const { targetId } = await send('Target.createTarget', { url: 'about:blank', background: true });
      const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
      const call = (method, params = {}) => send(method, params, sessionId);
      await call('Page.enable');
      await call('Runtime.enable');
      await call('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
      return {
        targetId, call,
        async evaluate(expression) {
          const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
          if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
          return result.result.value;
        },
        async navigate(url) {
          const result = await call('Page.navigate', { url });
          if (result.errorText) throw new Error(result.errorText);
          for (let attempt = 0; attempt < 50; attempt++) {
            const ready = await this.evaluate('document.readyState !== "loading" && document.body?.innerText.length > 20');
            if (ready) { await this.evaluate('document.fonts.ready.then(() => true)'); await pause(150); return; }
            await pause(200);
          }
          throw new Error(`页面未就绪：${url}`);
        },
        async screenshot(path, fullPage = false) {
          const params = { format: 'png', captureBeyondViewport: fullPage };
          if (fullPage) {
            const { cssContentSize } = await call('Page.getLayoutMetrics');
            params.clip = { x: 0, y: 0, width: cssContentSize.width, height: cssContentSize.height, scale: 1 };
          }
          const { data } = await call('Page.captureScreenshot', params);
          await mkdir(dirname(path), { recursive: true });
          await writeFile(path, Buffer.from(data, 'base64'));
        },
        async close() { await send('Target.closeTarget', { targetId }); },
      };
    },
    close() { socket.close(); },
  };
}
