/** 只读源项目，用临时本地端口截取脱敏展示图；不连接模型或修改源文件。 */
import http from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { connectBrowser, pause } from './cdp-client.mjs';

const outputRoot = new URL('../public/assets/', import.meta.url);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };

async function captureCleanGutter(page, name, height = 1000) {
  // Tabbit 原生悬浮控件不在页面 DOM 内；仅裁掉右侧 60px 空白边，不改变应用内容。
  const {data} = await page.call('Page.captureScreenshot', {
    format:'png', captureBeyondViewport:true,
    clip:{x:0,y:0,width:1380,height,scale:1},
  });
  await mkdir(fileURLToPath(outputRoot), {recursive:true});
  await writeFile(fileURLToPath(new URL(name, outputRoot)), Buffer.from(data,'base64'));
}

async function serve(root, names) {
  // 白名单限定到展示所需前端文件，避免整个项目目录成为 HTTP 可访问资源。
  const server = http.createServer(async (request, response) => {
    const name = new URL(request.url, 'http://localhost').pathname.slice(1) || 'index.html';
    if (!names.includes(name)) { response.writeHead(404); response.end(); return; }
    try {
      const body = await readFile(join(root, name));
      const ext = name.slice(name.lastIndexOf('.'));
      response.writeHead(200, { 'Content-Type': mime[ext], 'Cache-Control': 'no-store' });
      response.end(body);
    } catch { response.writeHead(404); response.end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return { server, url: `http://127.0.0.1:${server.address().port}/` };
}

const panguServer = await serve('D:/personal file/Project/openPangu领域知识增强/frontend', ['index.html', 'styles.css', 'app.js']);
const problemServer = await serve('D:/personal file/Project/Problem-slovingWeb', ['index.html', 'styles.css', 'app.js', 'questions.js']);
const browser = await connectBrowser();
const pages = [];
try {
  const pangu = await browser.newPage(1440, 1000);
  pages.push(pangu);
  // 在原脚本启动前阻断 fetch，示例回答只用于 UI 展示，避免内网请求与误标真实推理。
  await pangu.call('Page.addScriptToEvaluateOnNewDocument', { source: `
    window.fetch = async (url) => new Response(JSON.stringify(
      String(url).endsWith('/health') ? {status:'prototype'} : {
        text:'【原型示例 · 非模型推理结果】\\n\\n请先确认适用的工艺文件、材料与结构条件，再核对装配顺序、焊接参数及现场记录。\\n\\n此回答仅用于展示问答界面的交互效果，具体工艺处理应依据正式规范并由专业人员复核。'
      }
    ), {status:200,headers:{'Content-Type':'application/json'}});
  ` });
  await pangu.navigate(panguServer.url);
  await pangu.evaluate(`document.querySelector('#prompt').value='焊接薄板时，如何控制角变形？'; document.querySelector('#askForm').requestSubmit(); true`);
  await pause(300);
  await pangu.evaluate(`document.querySelector('#connectionLabel').textContent='原型示例 · 离线展示'; document.querySelector('.composer-note').textContent='原型示例界面 · 示例回答不代表真实模型结果'; true`);
  console.log('pangu', await pangu.evaluate(`({title:document.title,text:document.querySelector('#messages').innerText,extensions:[...document.querySelectorAll('*')].filter(x=>x.shadowRoot).map(x=>({tag:x.tagName,id:x.id,class:x.className,html:x.shadowRoot.innerHTML.slice(0,300)})),height:document.documentElement.scrollHeight})`));
  await captureCleanGutter(pangu, 'openpangu-prototype.png');

  const problem = await browser.newPage(1440, 1000);
  pages.push(problem);
  await problem.navigate(problemServer.url);
  for (let i=0; i<60; i++) {
    if (await problem.evaluate(`typeof window.MathJax?.typesetPromise === 'function'`)) break;
    await pause(250);
  }
  await problem.evaluate(`startPaper('2022-2023-2'); next(); next(); document.querySelector('#text-answer').value='0.44'; submitAnswer(); true`);
  await pause(400);
  console.log('problem', await problem.evaluate(`({title:document.title,text:document.querySelector('#question-card').innerText,extensions:[...document.querySelectorAll('body > *')].map(x=>({tag:x.tagName,id:x.id,class:x.className})),height:document.documentElement.scrollHeight})`));
  await captureCleanGutter(problem, 'probability-practice.png');
} finally {
  for (const page of pages) await page.close().catch(() => {});
  browser.close();
  await Promise.all([panguServer, problemServer].map(({server}) => new Promise(resolve => {server.close(resolve); server.closeAllConnections();})));
}
