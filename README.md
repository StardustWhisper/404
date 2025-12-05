# 多功能信息展示应用

这是一个基于React和Vite构建的现代化Web应用，集成了多种实用功能，包括天气信息、新闻、汇率和名言展示。

## 功能特性

- 🌤️ **实时天气信息**：基于用户地理位置显示当地天气，或默认显示北京天气
- 📰 **新闻资讯**：展示最新新闻标题和摘要
- 💱 **汇率信息**：显示USD/CNY实时汇率
- 💭 **励志名言**：随机展示励志名言
- 🖼️ **随机图片**：展示高质量随机图片
- 📱 **响应式设计**：适配各种设备屏幕
- 🔄 **错误处理**：完善的API错误处理和fallback机制

## 技术栈

- **前端框架**：React 19
- **构建工具**：Vite 6.2
- **UI组件库**：Ant Design 5.24
- **HTTP客户端**：Axios
- **日期处理**：Day.js
- **样式**：CSS

## 部署

本项目已配置为可以轻松部署到Cloudflare Pages。详细的部署说明请参考[DEPLOYMENT.md](./DEPLOYMENT.md)。

### 部署问题解决
如果部署后页面没有显示，请参考DEPLOYMENT_FIX.md中的解决方案。主要原因是Cloudflare Pages需要正确配置构建设置。

### 快速部署到Cloudflare Pages

1. 将代码推送到Git仓库
2. 在Cloudflare Dashboard中创建新的Pages项目
3. 连接到你的Git仓库
4. 使用以下构建设置：
   - 构建命令：`npm run build`
   - 构建输出目录：`dist`
5. 点击"保存并部署"

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 项目结构

```
├── src/
│   ├── App.jsx          # 主应用组件
│   ├── App.css          # 应用样式
│   ├── main.jsx         # 应用入口
│   └── index.css        # 全局样式
├── public/              # 静态资源
├── dist/                # 构建输出目录
├── vite.config.js       # Vite配置
└── package.json         # 项目配置
```

## API使用

本项目使用了以下免费API服务：

- **天气数据**：OpenMeteo API
- **新闻数据**：JSONPlaceholder API
- **汇率数据**：ExchangeRate.host API
- **名言数据**：Quotable API
- **图片数据**：Lorem Picsum API

所有API调用都实现了错误处理和fallback机制，确保在API服务不可用时应用仍能正常运行。
