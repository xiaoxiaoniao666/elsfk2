# 游戏部署指南

## 快速部署方法

### 方法1：Netlify拖拽部署（最简单）

1. **访问** [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. **拖拽** 将整个 `tetris-game` 文件夹拖到页面上
3. **等待** 自动部署完成
4. **获取** 系统会生成一个类似 `https://amazing-game-12345.netlify.app` 的网址

### 方法2：Vercel部署

1. **访问** [https://vercel.com/new](https://vercel.com/new)
2. **选择** "Deploy from Git" 或直接拖拽文件夹
3. **上传** 游戏文件
4. **获取** 部署网址

### 方法3：GitHub Pages（需要GitHub账户）

1. **创建仓库** 在GitHub上创建新仓库
2. **上传文件** 将所有游戏文件上传到仓库
3. **设置Pages** 在仓库设置中找到 "Pages" 选项
4. **选择分支** 选择 main/master 分支作为源
5. **访问** `https://[你的用户名].github.io/[仓库名]`

## 部署前检查清单

✅ 所有文件都在 `tetris-game` 文件夹中：
- `index.html`
- `style.css` 
- `tetris.js`
- `package.json`
- `README.md`

✅ 游戏在本地测试正常
✅ 移动端触摸控制工作正常

## 部署后测试

部署完成后，请测试：
- [ ] 游戏可以正常加载
- [ ] 键盘控制正常工作
- [ ] 移动端触摸按钮可用
- [ ] 滑动控制功能正常
- [ ] 分数系统正常工作
- [ ] 排行榜功能正常

## 自定义域名（可选）

如果您有自己的域名，可以在部署服务中设置自定义域名：
- Netlify: 在项目设置中添加自定义域名
- Vercel: 在项目设置中配置域名
- GitHub Pages: 在仓库设置中添加CNAME文件

## 技术支持

如果部署过程中遇到问题：
1. 检查浏览器控制台是否有错误
2. 确保所有文件路径正确
3. 验证网络连接正常
4. 清除浏览器缓存重新测试

## 推荐部署平台

**Netlify** - 最适合静态网站，部署最简单
**Vercel** - 性能优秀，支持自动部署
**GitHub Pages** - 适合开发者，与GitHub集成

选择任意一个平台，按照上述步骤操作，您的游戏就可以在互联网上访问了！