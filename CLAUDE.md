# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目
广播电视编导专业学生作品集网站，纯静态 HTML/CSS/JS，极简黑白灰风格。

## 目录约定
- `index.html` — 单页主文件
- `css/style.css` — 全部样式
- `js/main.js` — 全部交互逻辑
- `assets/ai/` — AI 作品素材
- `assets/film/` — 实拍作品素材
- `assets/placeholder/` — 开发用占位图

## 新增作品
在 index.html 的对应区域添加卡片结构：
```html
<div class="card" data-title="作品名" data-desc="描述" data-img="assets/ai/xxx.jpg">
  <img src="assets/ai/xxx.jpg" alt="作品名" loading="lazy">
  <div class="card-info">
    <h3>作品名</h3>
    <p>简述</p>
  </div>
</div>
```

## 设计规范
- 色彩：#fff / #f5f5f5 / #999 / #333 / #000
- 字体：Inter (英文) + 系统默认 (中文)
- 间距基准：8px 网格
- 响应式断点：768px / 1024px

## 验证
浏览器直接打开 index.html，检查：卡片展示、模态框、响应式、滚动导航。
