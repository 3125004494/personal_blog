# 个人求职作品集

郑泽韩的中文项目作品集，采用白底、青绿色点缀和左文右图的项目展示方式。

包含全部五个项目，使用用户选择的浏览器方案。用户已确认将当前网页发布至 GitHub Pages，并公开指定系统的登录信息。

## 运行

需要 Node.js 22.12+ 或更新的受支持版本、pnpm。当前环境使用 Node 24.19.0、pnpm 10.34.5。

```powershell
pnpm install --frozen-lockfile
pnpm dev
```

生产构建与预览：

```powershell
pnpm build
pnpm preview --port 4173 --strictPort
```

预览地址：<http://127.0.0.1:4173/personal_blog/>；开发地址为 <http://localhost:5173/personal_blog/>。

## GitHub Pages

- 仓库：<https://github.com/3125004494/personal_blog>
- 站点：<https://3125004494.github.io/personal_blog/>
- 2026-10-04 已发布，首次 [Actions 构建与部署](https://github.com/3125004494/personal_blog/actions/runs/37182193059) 成功；线上页面 HTTP 200，五个项目、四种视口、实际系统入口、公开登录说明、图片放大和 Esc 关闭均通过检查。
- `main` 分支推送触发 `.github/workflows/pages.yml`，通过 pnpm 安装锁定依赖、类型检查和 Vite 构建，将 `dist/` 发布到 GitHub Pages。
- 首次发布须将仓库 Settings → Pages → Source 设为 GitHub Actions；可通过已认证 GitHub CLI 的 Pages API 完成。本地 GitHub 凭据仅由系统 keyring / credential helper 使用，不提交到仓库。
- Vite `base` 固定为 `/personal_blog/`，成果图使用 `import.meta.env.BASE_URL`，兼容 GitHub 仓库子路径。更换仓库名称时同步调整该配置。
- Workflow 使用官方 Vite 部署指南中的固定 Action commit，并将安装与构建步骤改为 pnpm；参考 <https://vite.dev/guide/static-deploy.html#github-pages>（2026-10-04 核验）。

## 页面与维护

- 项目顺序：openPangu、摄影作品集、股票时序预测、概率统计练习、英语练习系统。
- `src/data/projects.ts` 集中维护简介、个人职责、技术栈、图片及公开仓库地址。
- `src/styles/main.scss` 定义配色、字体、项目行与响应式布局。
- `public/assets/` 是可公开展示的项目成果图。
- 点击成果图打开大图；Esc、关闭按钮或背景可关闭。未公开项目显示状态文字。
- 静态页面使用 Vite + TypeScript + Sass。布局与 CTA 样式适配自 Simplefolio，许可见 `THIRD_PARTY_NOTICES.md`。

## 验证

`pnpm build` 已通过类型检查和生产构建。浏览器 QA 已检查 1440×900、768×1024、390×844、320×780：五张图片加载、无横向溢出、三个未公开状态、两个仓库入口、成果图弹窗、Esc 关闭与焦点恢复、图片说明及安全外链。

当前 QA 使用系统已安装的 Edge，独立浏览器 profile 写在本项目 `.cache/`。无需安装全局浏览器或 Playwright 依赖：

```powershell
# 先保持生产预览服务运行
pnpm verify:browser
```

可通过 `PORTFOLIO_URL` 指定不同预览端口或线上地址；浏览器测试不会提交远端问答。线上检查示例：

```powershell
$env:PORTFOLIO_URL = 'https://3125004494.github.io/personal_blog/'
pnpm verify:browser
```

截图与结果位于 `output/browser/`（不进入生产构建）。测试脚本默认查找 Windows 标准 Edge 安装路径；其他系统需调整该路径。

两个 GitHub 仓库和摄影 Demo 于 2026-10-04 返回 HTTP 200。手机检查使用浏览器模拟视口，尚未在实体手机验收。

## 素材与内容边界

openPangu 图片为用户指定的广船知识应用实际知识问答首页，访问入口为 `https://gcgj.ngsk.tech:7001/login`，需登录；仅查看首页，未发送问答，截图不作为模型效果或全部功能验证。用户已明确确认该系统登录信息作为公开展示内容，可在 `src/data/projects.ts` 维护。其他凭据和真实企业数据不进入仓库。英语图片是实际前端使用合成演示数据；LSTM 实验不宣传超越基线。具体来源见 `docs/assets.md`。

所有源项目只读，未读取真实学生数据或本地凭据文件；广船系统仅使用用户本次提供的凭据登录和截取空白首页。联系方式暂使用 GitHub，不猜测邮箱或手机号。

## 文档
- [PRD](./PRD.md)：已确认的目标、内容和验收要求。
- [AGENTS](./AGENTS.md)：工具编排、授权范围和素材安全边界。
- [视觉规格](./docs/visual-spec.md)：当前浏览器原型的设计与文案约定。
- [素材来源](./docs/assets.md)：成果图和公开链接核验。
- [视觉复查](./docs/visual-review.md)：需求对照、修复及工具使用情况。
- [验证结果](./docs/verification.json)：最新四种视口检查结果。
- `design/`：保存用于用户审阅的桌面、手机与图片弹窗截图。

用户已授权创建上述公开仓库、提交、推送与 GitHub Pages 发布。构建缓存、浏览器 profile、输出目录、依赖和环境文件由 `.gitignore` 排除。
