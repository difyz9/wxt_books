# 🎵 简洁版 Bilibili Chrome 扩展

一个极简、轻量的 Chrome 扩展模板，专为 Bilibili 网站设计。基于现代 Web 技术构建，提供干净的代码结构和最佳实践。

## 🚀 技术栈

- **WXT**: 下一代 Web 扩展开发框架
- **TypeScript**: 类型安全的 JavaScript
- **React**: 现代 UI 库 (仅用于弹窗)
- **Tailwind CSS**: 实用优先的 CSS 框架
- **Vite**: 极速构建工具

## ✨ 核心特性

### 🎯 简洁设计
- **单一按钮**: 页面右上角显示一个简单的蓝色按钮
- **响应式交互**: 悬停动画和点击反馈
- **防重复创建**: 智能检测避免重复添加按钮
- **兼容性**: 完美支持 Bilibili SPA 页面切换

### 📦 轻量级
- **代码量**: 仅 60 行核心代码
- **包大小**: 构建后仅 4.72 kB
- **启动快**: 毫秒级加载时间
- **内存友好**: 最小资源占用

### � 开发友好
- **TypeScript 支持**: 完整的类型定义
- **热重载**: 开发时实时更新
- **模块化**: 清晰的项目结构
- **可扩展**: 易于添加新功能

## 🛠️ 快速开始

### 环境要求

- Node.js (v18 或更高版本)
- npm 或 yarn 包管理器

### 安装依赖

```bash
npm install
```

### 开发模式

启动开发服务器：
```bash
npm run dev
```

### 生产构建

构建扩展：
```bash
npm run build
```

构建结果位于 `dist/chrome-mv3/` 目录。

## 📁 项目结构

```
├── entrypoints/          # 扩展入口点
│   ├── background.ts     # 后台脚本 (Service Worker)
│   ├── content.ts        # 内容脚本 (主要逻辑 - 仅60行)
│   └── popup/            # 弹窗界面
│       ├── App.tsx       # React 弹窗组件
│       ├── main.tsx      # 弹窗入口点
│       └── style.css     # 样式文件
├── assets/               # 静态资源
├── public/               # 公共文件 (图标等)
├── wxt.config.ts         # WXT 配置
├── tailwind.config.js    # Tailwind 配置
└── package.json          # 项目配置
```

## 📦 安装到 Chrome

### 方法一：开发模式
1. 运行 `npm run dev`
2. 打开 Chrome，访问 `chrome://extensions/`
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 `.wxt/chrome-mv3-dev/` 文件夹

### 方法二：生产版本
1. 运行 `npm run build`
2. 打开 Chrome，访问 `chrome://extensions/`
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 `dist/chrome-mv3/` 文件夹

## � 使用方法

1. **安装扩展**：按照上述步骤在 Chrome 中加载扩展
2. **访问 Bilibili**：打开任意 Bilibili 视频页面
3. **查看按钮**：在页面右上角会出现 "🎵 简单按钮"
4. **点击测试**：点击按钮会弹出提示框显示 "🎉 按钮被点击了！"

## 🎨 自定义扩展

### 修改按钮文本
在 `entrypoints/content.ts` 中修改：
```typescript
🎵 简单按钮  →  您的自定义文本
```

### 修改按钮样式
```typescript
background: #00aeec;  →  您的颜色值
```

### 修改点击行为
```typescript
button.addEventListener('click', () => {
  // 添加您的自定义逻辑
  alert('自定义功能')
})
```

### 修改按钮位置
```css
top: 20px;     →  您的位置
right: 20px;   →  您的位置
```

## 📊 性能数据

- **构建时间**: < 1 秒
- **代码行数**: 60 行 (content.ts)
- **包大小**: 4.72 kB (content.js)
- **总大小**: 214.61 kB (包含 React 弹窗)
- **启动时间**: < 10ms

## 🎯 支持的页面

- `https://www.bilibili.com/video/*` - 视频播放页面
- `https://www.bilibili.com/list/*` - 播放列表页面

## 🔧 扩展权限

- **activeTab**: 访问当前活动标签页
- **scripting**: 注入内容脚本
- **host_permissions**: 访问 Bilibili 网站

## 🚀 扩展建议

基于此模板，您可以轻松扩展以下功能：

### 🎵 音频相关
- 音频播放控制
- 音量调节
- 播放速度控制

### 📝 字幕相关
- 字幕下载
- 字幕翻译
- 字幕样式修改

### 🎨 界面增强
- 暗黑模式
- 自定义主题
- 布局调整

### 📊 数据处理
- 观看历史记录
- 数据统计
- 用户偏好设置

## 🛠 开发技巧

- **调试**: 使用浏览器开发者工具查看控制台输出
- **热重载**: 开发模式下代码修改会自动重新加载
- **类型检查**: 运行 `npm run compile` 进行 TypeScript 检查
- **代码格式**: 建议使用 Prettier 和 ESLint

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'Add amazing feature'`
4. 推送分支: `git push origin feature/amazing-feature`
5. 创建 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源。

## 🙏 致谢

- [WXT](https://wxt.dev/) - 现代化的扩展开发框架
- [React](https://react.dev/) - UI 组件库
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架

---

**这是一个简洁、可扩展的 Chrome 扩展模板，适合快速开发和学习使用。** ✨
