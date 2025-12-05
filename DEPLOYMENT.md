# Cloudflare Pages 部署指南

本项目已配置为可以轻松部署到 Cloudflare Pages。

## 部署步骤

### 方法一：通过 Git 仓库部署

1. 将代码推送到 GitHub、GitLab 或 Bitbucket 仓库
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. 进入 Pages 部分，点击 "创建项目"
4. 选择 "连接到 Git"
5. 选择你的仓库
6. 配置构建设置：
   - **构建命令**: `npm run build`
   - **构建输出目录**: `dist`
   - **根目录**: `/` (默认)
7. 点击 "保存并部署"

### 方法二：通过 Wrangler CLI 部署

1. 安装 Wrangler CLI:
   ```
   npm install -g wrangler
   ```

2. 登录 Cloudflare:
   ```
   wrangler login
   ```

3. 构建项目:
   ```
   npm run build
   ```

4. 部署到 Cloudflare Pages:
   ```
   wrangler pages deploy dist --project-name=your-project-name
   ```

## 项目配置

- **构建输出目录**: `dist`
- **基础路径**: `./` (相对路径，适用于子目录部署)
- **源映射**: 已启用，便于调试

## 注意事项

1. 确保所有 API 调用都支持 HTTPS（Cloudflare Pages 强制使用 HTTPS）
2. 本项目已配置了适当的错误处理和 fallback 数据，确保在 API 调用失败时页面仍能正常显示
3. 项目使用了相对路径配置，可以部署到任何子目录而不会出现资源加载问题

## 环境变量

如果需要配置环境变量，可以在 Cloudflare Pages 的项目设置中添加：

1. 进入项目设置
2. 找到 "环境变量" 部分
3. 添加所需的环境变量

## 自定义域名

在 Cloudflare Pages 项目设置中，可以轻松配置自定义域名：

1. 进入 "自定义域" 部分
2. 添加你的域名
3. 按照指示配置 DNS 记录

部署完成后，你的应用将在 Cloudflare 的全球网络上运行，享受快速的内容分发和 DDoS 保护。