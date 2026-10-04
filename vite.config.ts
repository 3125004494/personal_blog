import { defineConfig } from 'vite';

// GitHub 项目站点部署在仓库子路径；页面动态引用的成果图也必须使用此 base。
export default defineConfig({ base: '/personal_blog/' });
