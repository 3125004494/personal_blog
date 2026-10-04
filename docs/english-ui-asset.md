# 英语练习系统界面素材

- 文件：`public/assets/english-practice.png`，2189 × 1329（浏览器原始像素，CSS 视口为 1459 × 886）。
- 来源：用户 C 课设项目中的真实 Flask Web 扩展，运行原 `web/app.py` 与模板、样式、前端脚本，截图页面为“学习总览”。
- 图中题量、答题次数、平均分与分数分布均来自专门生成的**示例数据**，仅展示界面与功能，不代表真实教学使用规模或真实成绩。
- 所有题目、示例专业、示例班级和演示学生均由截图脚本生成在本作品集 `.cache/english-preview-data` 中。未读取源项目的 `stu.txt`、`key.txt`、`.env`，未复制真实学生信息，未登录教师端。
- 原项目只读导入；Python 以 `-B` 和 `sys.dont_write_bytecode` 防止向源项目写入缓存，服务仅监听 `127.0.0.1:5183`。
- 截图通过现有浏览器 CDP 创建的独立后台页，等待四个指标与分数图表完成加载；仅隐藏浏览器扩展浮层，不修改应用布局。
- 复现：使用已安装 Flask 的 `python -B scripts/capture-english-preview.py` 启动本地服务，再执行 `node scripts/capture-english-preview.mjs`。源课设 `.venv` 的 Flask 安装不完整，本轮使用系统现有 Python / Flask，未安装依赖。截图完成后停止 Python 服务。
- 验证：四项指标与五组分数段已渲染；人工检查截图完整、字体清晰、无横向溢出。服务已停止，独立截图标签页已关闭。
- 功能边界：Web 扩展独立实现文本数据格式及业务逻辑，此截图不表示 Flask 调用了 C EXE。
