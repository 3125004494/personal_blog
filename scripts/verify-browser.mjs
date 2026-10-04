import { spawn } from 'node:child_process';
import { access, mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { connectBrowser, pause } from './cdp-client.mjs';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'output/browser');
const appUrl = process.env.PORTFOLIO_URL ?? 'http://127.0.0.1:4173/personal_blog/';
await mkdir(resolve(root, '.cache'), { recursive: true });
await mkdir(output, { recursive: true });
const profile = await mkdtemp(resolve(root, '.cache/edge-qa-'));
const edgePath = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
await access(edgePath);
const edge = spawn(edgePath, ['--headless=new', '--disable-gpu', '--disable-extensions', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
const results = [];
let browser;
try {
  let endpoint;
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      const [port, path] = (await readFile(resolve(profile, 'DevToolsActivePort'), 'utf8')).trim().split(/\r?\n/);
      endpoint = `ws://127.0.0.1:${port}${path}`;
      break;
    } catch { await pause(200); }
  }
  if (!endpoint) throw new Error('隔离 Edge 调试端口未就绪');
  browser = await connectBrowser(endpoint);
  for (const [width, height] of [[1440, 900], [768, 1024], [390, 844], [320, 780]]) {
    const page = await browser.newPage(width, height, width < 720);
    try {
      await page.call('Page.bringToFront');
      await page.call('Emulation.setTouchEmulationEnabled', { enabled: width < 720 });
      await page.call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      await page.navigate(appUrl);
      console.log(`${width}px：页面已加载`);
      // QA 主动加载所有成果图，避免后台标签节流使懒加载等待失去进展。
      await page.evaluate(`[...document.querySelectorAll('.image-preview img')].forEach(img => { img.loading = 'eager'; }); true`);
      for (let attempt = 0; attempt < 40; attempt++) {
        if (await page.evaluate(`[...document.querySelectorAll('.image-preview img')].every(i=>i.complete && i.naturalWidth>0)`)) break;
        await pause(150);
      }
      await page.evaluate(`Promise.all([...document.querySelectorAll('.image-preview img')].map(i=>i.decode())).then(()=>true)`);
      await pause(150);
      await page.call('DOM.enable');
      await page.call('CSS.enable');
      const { root: documentRoot } = await page.call('DOM.getDocument');
      const { nodeId: paragraphNode } = await page.call('DOM.querySelector', {nodeId:documentRoot.nodeId,selector:'.hero-description'});
      const renderedFonts = await page.call('CSS.getPlatformFontsForNode', {nodeId:paragraphNode});
      const state = await page.evaluate(`(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, projects: document.querySelectorAll('.project-row').length, images: [...document.querySelectorAll('.image-preview img')].map(i => ({loaded: i.complete && i.naturalWidth > 0, alt: i.alt})), unpublished: document.querySelectorAll('.unpublished').length, githubLinks: [...document.querySelectorAll('.project-links a')].filter(a => a.href.includes('github.com')).length, firstProjectHeadingY: document.querySelector('.project-wrapper__text-title').getBoundingClientRect().top, sectionHeadingY: document.querySelector('#projects-title').getBoundingClientRect().top, overflow: [...document.querySelectorAll('main *')].filter(e => { const r=e.getBoundingClientRect(); return r.width>0 && (r.left < -1 || r.right>innerWidth+1); }).map(e => ({tag:e.tagName,class:e.className})), reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches }))()`);
      if (state.scrollWidth > width || state.overflow.length) throw new Error(`${width}px 横向溢出`);
      if (state.projects !== 5 || state.unpublished !== 3 || state.githubLinks !== 2 || state.images.some(i => !i.loaded)) throw new Error(`${width}px 项目、图片或链接状态不正确`);
      if (state.sectionHeadingY >= height) throw new Error(`${width}px 首屏未露出项目区`);
      const systemAccess = await page.evaluate(`(() => {const link=document.querySelector('#openpangu .project-links a');return {href:link?.href,needsLogin:link?.textContent.includes('需登录'),label:link?.getAttribute('aria-label')};})()`);
      if (systemAccess.href !== 'https://gcgj.ngsk.tech:7001/login' || !systemAccess.needsLogin || !systemAccess.label?.includes('openPangu')) throw new Error('openPangu 实际系统入口或登录提示不正确');
      const publicDemoLoginVisible = await page.evaluate(`(() => {const info=document.querySelector('#openpangu .demo-credentials');const values=[...info?.querySelectorAll('code')??[]].map(e=>e.textContent);return !!info&&info.getBoundingClientRect().height>0&&values[0]==='admin'&&values[1]==='123456';})()`);
      if (!publicDemoLoginVisible) throw new Error('用户确认的系统登录信息未完整显示');
      await page.screenshot(resolve(output, `${width}-hero.png`));
      await page.evaluate(`window.scrollTo({top:document.querySelector('#openpangu').offsetTop - 30,behavior:'instant'})`);
      await pause(150);
      await page.screenshot(resolve(output, `${width}-project.png`));
      if (width === 1440) {
        await page.evaluate(`window.scrollTo({top:document.querySelector('#photo-collection').offsetTop - 40,behavior:'instant'})`);
        await pause(150);
        await page.screenshot(resolve(output, '1440-photo.png'));
        await page.evaluate(`window.scrollTo({top:document.querySelector('#english-practice').offsetTop - 40,behavior:'instant'})`);
        await pause(150);
        await page.screenshot(resolve(output, '1440-english.png'));
        await page.evaluate(`window.scrollTo({top:document.querySelector('#openpangu').offsetTop - 30,behavior:'instant'})`);
      }
      const point = await page.evaluate(`(() => { const r=document.querySelector('.image-preview').getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; })()`);
      await page.call('Input.dispatchMouseEvent', { type: 'mousePressed', x: point.x, y: point.y, button: 'left', clickCount: 1 });
      await page.call('Input.dispatchMouseEvent', { type: 'mouseReleased', x: point.x, y: point.y, button: 'left', clickCount: 1 });
      const opened = await page.evaluate(`document.querySelector('dialog').open && document.querySelector('.dialog-image').src === document.querySelector('#openpangu .image-preview img').src`);
      if (!opened) throw new Error('成果图弹窗未打开');
      if (width === 390) { await pause(150); await page.screenshot(resolve(output, '390-dialog.png')); }
      await page.call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
      await page.call('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
      await pause(50);
      const closed = await page.evaluate(`!document.querySelector('dialog').open && !document.body.classList.contains('dialog-open') && document.activeElement.classList.contains('image-preview')`);
      if (!closed) throw new Error(`弹窗关闭或焦点恢复失败：${JSON.stringify(await page.evaluate('({open:document.querySelector("dialog").open, body:document.body.className,active:document.activeElement.outerHTML.slice(0,250)})'))}`);
      const source = await page.evaluate(`({links:[...document.querySelectorAll('a[target="_blank"]')].map(a=>({href:a.href,secure:a.rel.includes('noopener')})), missingAlt:[...document.querySelectorAll('img')].some(i=>!i.alt), imageButtons:document.querySelectorAll('button.image-preview[aria-label]').length})`);
      if (source.links.some(a=>!a.secure) || source.missingAlt || source.imageButtons!==5) throw new Error('外链或图像可访问性检查失败');
      results.push({ viewport: `${width}x${height}`, ...state, systemAccess, publicDemoLoginVisible, renderedFonts, dialogOpen: opened, escapeCloseAndFocus: closed, accessibility: source });
    } finally { await page.close(); }
  }
  await writeFile(resolve(output, 'verification.json'), JSON.stringify({date:'2026-10-04',url:appUrl,browser:'isolated headless Edge via CDP',results},null,2));
  console.log(JSON.stringify({passed:true,viewports:results.map(r=>r.viewport),screenshots:output},null,2));
} finally {
  if (browser) { await browser.send('Browser.close').catch(() => {}); browser.close(); }
  edge.kill();
}
