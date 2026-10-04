# 项目素材与内容来源

核验日期：2026-10-04。所有素材仅用于本地作品集，原项目未修改。

| 展示文件 | 来源与边界 |
| --- | --- |
| `public/assets/openpangu-system.png` | 用户指定的 `https://gcgj.ngsk.tech:7001/login`，授权登录后截取广船知识应用 `/scenes/knowledgeQA` 空白首页；无历史对话、企业文档或账号信息。仅隐藏登录成功的瞬时提示及浏览器扩展控件；未改变应用正文或提交问答。 |
| `public/assets/photo-collection.png` | `D:/personal file/Project/photo_collection/output/playwright/final-hero.png`；已有摄影网站桌面截图，页面含用户自己的摄影作品。 |
| `public/assets/stock-forecast.png` | `D:/personal file/Project/time_series_prediction/outputs_final/AAPL_price_sentiment_forecast.png`；真实实验图表。实验没有超过简单基线，不宣传性能提升或投资收益。 |
| `public/assets/probability-practice.png` | 已有概率练习网页与实际题库；截图展示作答解析，不代表整套题库准确性已经验证。详见 `source-ui-assets.md`。 |
| `public/assets/english-practice.png` | 已有 Flask 前端，使用隔离目录中的合成题库和演示学生；图中统计数值是演示数据。详见 `english-ui-asset.md`。 |

## 内容约定
- 用户已确认 openPangu 的职责为模型部署、微调测试和协助总体推进。
- 其他四个项目为独立完成、AI 辅助开发；网页保留这一表述。
- openPangu 的界面不是 RAG、检索能力或团队模型指标的完成证据。
- 原 `openpangu-prototype.png` 为本地模拟回答素材，当前页面不再引用；旧截图脚本只用于原模拟素材复现。
- 英语系统的 Flask 适配层独立实现相同数据格式与业务逻辑，未调用 C EXE。
- 真实学生信息、成绩、企业文档、远程服务器凭据和企业项目金额不进入本作品集；用户已明确确认将指定广船系统登录信息作为公开展示内容。

## 链接核验
以下公开地址于本轮返回 HTTP 200：
- https://github.com/3125004494/photo-collection
- https://github.com/3125004494/English-Practice-System
- https://photo-collection-2l3.pages.dev/

另三个项目由用户确认暂无 GitHub 仓库，显示“代码未公开”，没有占位链接。

用户指定的广船系统于 2026-10-04 经浏览器登录后进入实际知识问答首页。根据用户对公开凭据的明确确认，作品集发布登录入口和指定登录信息；登录成功不代表所有场景功能已测试。
