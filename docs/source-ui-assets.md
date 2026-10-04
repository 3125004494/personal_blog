# 前端项目截图来源

核验日期：2026-10-04。源项目只读，截图文件仅写入本作品集项目。

当前 openPangu 项目图已替换为用户指定广船知识应用的实际首页 `public/assets/openpangu-system.png`，来源和授权边界见 `assets.md`。下文 openPangu 原型图是未被当前页面引用的旧素材记录，捕获脚本不会生成实际系统截图。

| 文件 | 来源 | 截图状态与尺寸 |
| --- | --- | --- |
| `public/assets/openpangu-prototype.png` | `D:/personal file/Project/openPangu领域知识增强/frontend` 的既有 HTML/CSS/JS | 问答原型示例，1380 × 1000 |
| `public/assets/probability-practice.png` | `D:/personal file/Project/Problem-slovingWeb` 的既有 HTML/CSS/JS/题库 | 2022-2023-2 第 3 题作答与解析，1380 × 1000 |

## 内容边界

- openPangu 在页面脚本执行前拦截全部 `fetch`，返回本地演示响应；未连接模型、内网或真实 API。回答和连接状态都明确标注原型示例，不能作为真实模型效果或部署验证证据。
- openPangu 展示来源项目已有的知识库名称、界面和通用示例问题，没有企业文档、企业截图、凭据或真实用户数据。
- 概率练习展示已有题库与实际判题解析 UI；截图选用独立事件并集概率题，不据此宣称整套题库或判题逻辑准确无误。
- 概率练习的演示进度仅写入本次临时随机端口对应的浏览器 localStorage，不修改源项目文件或用户正常浏览来源。
- 两张图原视口均为 1440 × 1000；Tabbit 右侧悬浮控件位于浏览器原生覆盖层，页面 DOM 不存在对应节点，因此裁去右侧 60px 空白边。没有遮盖、修改应用正文或界面。

## 核验与复现

- 已用浏览器 CDP 读取真实页面状态并截图，MathJax 可用后进入练习题；已用图片查看工具逐张检查主内容可读。
- 页面请求由只绑定 `127.0.0.1` 的临时静态服务提供，服务只允许读取展示必需的白名单前端文件。
- 自建标签页与临时服务在完成后关闭，用户原有标签页未操作。
- 可用既有 CDP 浏览器时运行 `node scripts/capture-project-previews.mjs` 复现。脚本依赖 Node.js 22+ 和已连接的 `scripts/cdp-client.mjs`，不安装全局依赖。
