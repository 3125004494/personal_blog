import './styles/main.scss';
import { projects } from './data/projects';

const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const external = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
const githubProfile = 'https://github.com/3125004494';
const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

// 改造 Simplefolio 的项目行结构：内容保持可见，交互只承担导航与图片预览。
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <header class="site-header container">
    <a class="wordmark" href="#home" aria-label="郑泽韩，返回顶部">郑泽韩<span>.</span></a>
    <nav aria-label="主导航">
      <a href="#projects">项目作品</a>
      <a href="${githubProfile}" target="_blank" rel="noopener noreferrer">GitHub ${external}</a>
    </nav>
  </header>
  <main id="home">
    <section class="hero container" aria-labelledby="hero-title">
      <h1 id="hero-title">你好，我是<span>郑泽韩。</span></h1>
      <p class="hero-description">广东工业大学软件工程学生。<br />关注 AI 应用、Web 开发与数据实验。</p>
      <a class="cta-btn cta-btn--hero" href="#projects">浏览项目 ${arrow}</a>
    </section>
    <section class="projects-section container" id="projects" aria-labelledby="projects-title">
      <div class="section-heading">
        <h2 id="projects-title">项目作品<span>.</span></h2>
        <p>AI 应用、Web 产品与数据实验</p>
      </div>
      <div class="project-wrapper">
        ${projects.map((project, index) => `
          <article class="row project-row" id="${project.id}" aria-labelledby="${project.id}-title">
            <div class="project-wrapper__text">
              <span class="project-index" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
              <h3 class="project-wrapper__text-title" id="${project.id}-title">${escapeHtml(project.title)}</h3>
              <p class="project-summary">${escapeHtml(project.summary)}</p>
              <p class="project-contribution">${escapeHtml(project.contribution)}</p>
              <ul class="tech-stack" aria-label="${escapeHtml(project.title)}技术栈">${project.technologies.map((technology) => `<li>${escapeHtml(technology)}</li>`).join('')}</ul>
              <div class="project-links">
                ${project.demo ? `<a class="cta-btn cta-btn--hero" href="${project.demo}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(project.title)}：${escapeHtml(project.demoLabel ?? '在线体验')}">${escapeHtml(project.demoLabel ?? '在线体验')} ${external}</a>` : ''}
                ${project.github ? `<a class="source-link" href="${project.github}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(project.title)} GitHub 仓库">GitHub ${external}</a>` : '<span class="unpublished">代码未公开</span>'}
              </div>
              ${project.demoCredentials ? `<p class="demo-credentials">登录账号：<code>${escapeHtml(project.demoCredentials.account)}</code><span>密码：<code>${escapeHtml(project.demoCredentials.password)}</code></span></p>` : ''}
            </div>
            <figure class="project-wrapper__image">
              <button class="image-preview" data-project-index="${index}" type="button" aria-label="放大查看${escapeHtml(project.title)}成果图">
                <img src="${assetUrl(project.image)}" alt="${escapeHtml(project.imageAlt)}" width="1440" height="900" ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" />
                <span class="image-affordance">查看大图 ${external}</span>
              </button>
              <figcaption>${escapeHtml(project.imageCaption)}</figcaption>
            </figure>
          </article>
        `).join('')}
      </div>
    </section>
    <section class="contact-section" aria-labelledby="contact-title">
      <div class="container contact-content">
        <div><h2 id="contact-title">保持联系<span>.</span></h2><p>更多代码与项目，见我的 GitHub。</p></div>
        <a class="cta-btn cta-btn--hero" href="${githubProfile}" target="_blank" rel="noopener noreferrer">访问 GitHub ${external}</a>
      </div>
    </section>
  </main>
  <footer class="container site-footer"><span>© ${new Date().getFullYear()} 郑泽韩</span><a href="https://github.com/cobiwave/simplefolio" target="_blank" rel="noopener noreferrer">基于 Simplefolio 改造 ${external}</a></footer>
  <dialog class="image-dialog" aria-labelledby="image-dialog-title">
    <div class="dialog-heading"><h2 id="image-dialog-title"></h2><button class="dialog-close" type="button" aria-label="关闭成果图">关闭 <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></button></div>
    <img class="dialog-image" alt="" /><p class="dialog-caption"></p>
  </dialog>
`;

const dialog = document.querySelector<HTMLDialogElement>('.image-dialog')!;
const dialogImage = dialog.querySelector<HTMLImageElement>('.dialog-image')!;
const dialogTitle = dialog.querySelector<HTMLHeadingElement>('#image-dialog-title')!;
const dialogCaption = dialog.querySelector<HTMLParagraphElement>('.dialog-caption')!;

document.querySelectorAll<HTMLButtonElement>('.image-preview').forEach((button) => {
  button.addEventListener('click', () => {
    const project = projects[Number(button.dataset.projectIndex)];
    dialogTitle.textContent = project.title;
    dialogImage.src = assetUrl(project.image);
    dialogImage.alt = project.imageAlt;
    dialogCaption.textContent = project.imageCaption;
    dialog.showModal();
    document.body.classList.add('dialog-open');
  });
});
dialog.querySelector('.dialog-close')!.addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
// 只在点击背景、而非弹窗内部空白区域时关闭，避免误关大图。
dialog.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const rectangle = dialog.getBoundingClientRect();
  if (event.clientX < rectangle.left || event.clientX > rectangle.right || event.clientY < rectangle.top || event.clientY > rectangle.bottom) dialog.close();
});
