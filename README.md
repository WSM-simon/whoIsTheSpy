# 谁是卧底 (Who is the Spy)

一个基于 Next.js 和 ChatGPT API 的"谁是卧底"游戏网页应用。

## 功能特点

- 🎮 使用 ChatGPT API 自动生成游戏词语
- 🎭 演示模式（无需 API 密钥）- 使用预设词语对
- 📸 玩家查看词语时自动调用摄像头拍照
- 🎨 精美的界面设计（使用 Tailwind CSS）
- 🎯 完整的游戏流程：设置 → 揭示 → 游戏 → 结果
- 👥 支持 3-12 名玩家，可自定义卧底数量
- 💪 容错性强：摄像头不可用时仍可正常游戏

## 游戏截图

### 游戏设置界面
![Game Setup](https://github.com/user-attachments/assets/88351c31-f865-41be-84af-e85396dace20)

### 卡牌揭示阶段
![Card Reveal](https://github.com/user-attachments/assets/04206315-4db1-4d81-b7d1-0aefe9275418)

### 词语显示
![Word Display](https://github.com/user-attachments/assets/d5c16ce4-cab8-457b-9188-9a3a02465164)

## 游戏规则

1. **游戏设置**：选择玩家数量和卧底数量
2. **查看词语**：每位玩家依次点击查看自己的词语，同时拍照留念
3. **游戏进行**：所有玩家查看完词语后，可以点击卡牌投票出局或标记忘词
4. **胜利条件**：
   - 卧底全部出局 → 好人胜利
   - 卧底人数 ≥ 好人数量 → 卧底胜利

## 安装和运行

### 前置要求

- Node.js 18.0 或更高版本
- (可选) OpenAI API Key - 演示模式下无需 API 密钥

### 安装步骤

1. 克隆项目
```bash
git clone https://github.com/WSM-simon/whoIsTheSpy.git
cd whoIsTheSpy
```

2. 安装依赖
```bash
npm install
```

3. (可选) 配置环境变量

如需使用 ChatGPT API，创建 `.env.local` 文件并添加你的 OpenAI API Key：

```env
OPENAI_API_KEY=your_openai_api_key_here
```

4. 运行开发服务器
```bash
npm run dev
```

5. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 构建生产版本

```bash
npm run build
npm start
```

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **AI**: OpenAI GPT-3.5-turbo
- **摄像头**: Navigator MediaDevices API

## 项目结构

```
whoIsTheSpy/
├── app/
│   ├── api/
│   │   ├── generate-words/      # ChatGPT API 路由
│   │   └── generate-words-demo/ # 演示模式 API 路由
│   ├── page.tsx                 # 主页面和游戏状态管理
│   ├── layout.tsx               # 根布局
│   └── globals.css              # 全局样式
├── components/
│   ├── GameSetup.tsx            # 游戏设置组件
│   ├── CardReveal.tsx           # 卡牌揭示组件（含摄像头）
│   ├── GamePlay.tsx             # 游戏进行组件
│   └── GameResult.tsx           # 游戏结果组件
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 使用说明

### 演示模式（推荐用于测试）

1. 打开应用，确保"演示模式"开关已打开（默认开启）
2. 设置玩家数量和卧底数量
3. 点击"开始游戏"
4. 系统会自动从预设的词语对中随机选择（如：西瓜/冬瓜、包子/饺子等）

### ChatGPT 模式

1. 配置 OpenAI API Key
2. 关闭"演示模式"开关
3. 开始游戏，系统将调用 ChatGPT API 生成新的词语对

### 游戏流程

1. **开始游戏**：在首页设置玩家数量和卧底数量，点击"开始游戏"
2. **查看词语**：每位玩家依次点击"查看我的词语"按钮，系统会启动摄像头
3. **拍照确认**：查看词语后点击"确认并拍照"，系统会拍摄玩家照片
4. **游戏投票**：所有玩家查看完后进入游戏，点击玩家卡牌进行投票或标记忘词
5. **查看结果**：游戏结束后显示胜负结果和所有玩家信息

## 特性说明

### 摄像头功能
- 首次使用时浏览器会请求摄像头权限
- 如果摄像头不可用，游戏仍可继续但不会拍照
- 拍摄的照片仅存储在本地，不会上传到服务器

### 游戏平衡
- 系统会自动验证玩家和卧底数量的合理性
- 确保至少有 2 名好人才能开始游戏
- 防止不平衡的游戏配置

### 界面设计
- 渐变背景色（紫色到蓝色）
- 流畅的悬停动画和过渡效果
- 基于卡片的界面设计
- 表情符号状态指示器
- 响应式设计，支持移动设备

## 注意事项

- 需要在支持摄像头的设备上运行（可选）
- 建议使用 Chrome、Firefox 或 Safari 等现代浏览器
- 演示模式无需网络连接即可运行
- ChatGPT 模式需要稳定的网络连接

## 安全性

- 所有依赖包均已通过安全审查
- 代码通过 CodeQL 安全扫描
- 没有已知的安全漏洞
- 用户数据仅存储在客户端

## 开发说明

### 运行测试

```bash
npm run build  # 构建并检查类型错误
```

### 代码风格

- 使用 TypeScript 进行类型检查
- 遵循 Next.js 最佳实践
- 使用 Tailwind CSS 进行样式管理

## License

MIT
