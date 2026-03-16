# 📚 小说发布平台 - 项目规划

## 项目名称
**小牛马小说平台** (NovelHub)

## 🎯 核心功能

### 1. 用户系统
- [ ] 用户注册/登录（支持手机号、邮箱）
- [ ] 个人中心（头像、昵称、简介）
- [ ] 作者认证
- [ ] 读者/作者双角色

### 2. 小说管理
- [ ] 创建小说（标题、简介、封面、分类、标签）
- [ ] 章节管理（草稿、发布、定时发布）
- [ ] 批量上传（支持 Markdown、TXT）
- [ ] 数据统计（阅读量、收藏、评论）

### 3. 阅读体验
- [ ] 在线阅读（分页、目录导航）
- [ ] 阅读设置（字体、背景、夜间模式）
- [ ] 书签功能
- [ ] 阅读历史记录
- [ ] 加入书架

### 4. 互动功能
- [ ] 章节评论（支持楼中楼）
- [ ] 点赞/推荐
- [ ] 收藏/书架
- [ ] 打赏系统
- [ ] 书评区

### 5. 搜索与发现
- [ ] 全文搜索（标题、作者、内容）
- [ ] 分类浏览（玄幻、都市、言情等）
- [ ] 排行榜（阅读、收藏、推荐）
- [ ] 新书推荐
- [ ] 标签系统

### 6. 后台管理
- [ ] 内容审核
- [ ] 用户管理
- [ ] 数据统计
- [ ] 推荐位管理

---

## 🛠️ 技术栈

### 前端
- **框架**: Next.js 14 (React 18)
- **UI 库**: TailwindCSS + shadcn/ui
- **状态管理**: Zustand
- **富文本编辑器**: TipTap / MDX

### 后端
- **框架**: Node.js + Express / Next.js API Routes
- **数据库**: PostgreSQL + Prisma ORM
- **缓存**: Redis
- **搜索**: Meilisearch / Elasticsearch

### 存储
- **图片**: 本地存储 / 阿里云 OSS
- **文档**: 本地文件系统

### 部署
- **开发**: Docker Compose
- **生产**: Docker + Nginx

---

## 📁 项目结构

```
novel-platform/
├── apps/
│   ├── web/              # 前端应用 (Next.js)
│   ├── admin/            # 管理后台
│   └── api/              # 后端 API
├── packages/
│   ├── database/         # 数据库配置 + Prisma Schema
│   ├── ui/               # 共享 UI 组件
│   └── utils/            # 工具函数
├── docker/
│   ├── postgres/
│   ├── redis/
│   └── nginx/
├── docs/
│   └── API.md
└── docker-compose.yml
```

---

## 📊 数据库设计

### 核心表

**users** - 用户表
- id, openid, nickname, avatar, bio, role, created_at

**novels** - 小说表
- id, author_id, title, description, cover, category, tags, status, view_count, collect_count, created_at

**chapters** - 章节表
- id, novel_id, title, content, word_count, order, status, published_at, created_at

**comments** - 评论表
- id, user_id, novel_id, chapter_id, content, parent_id, likes, created_at

**collections** - 收藏表
- id, user_id, novel_id, created_at

**reading_history** - 阅读历史
- id, user_id, novel_id, chapter_id, last_read_at

---

## 🚀 开发计划

### Phase 1: MVP (2 周)
- [ ] 项目初始化
- [ ] 用户认证系统
- [ ] 小说 CRUD
- [ ] 章节管理
- [ ] 基础阅读页面

### Phase 2: 互动功能 (1 周)
- [ ] 评论系统
- [ ] 收藏功能
- [ ] 阅读历史
- [ ] 搜索功能

### Phase 3: 优化完善 (1 周)
- [ ] UI/UX优化
- [ ] 性能优化
- [ ] 移动端适配
- [ ] SEO优化

### Phase 4: 高级功能 (可选)
- [ ] 打赏系统
- [ ] 会员系统
- [ ] 推荐算法
- [ ] 数据统计后台

---

## 💡 特色功能

1. **Markdown 优先**: 支持 Markdown 写作，自动渲染
2. **批量导入**: 一键导入现有小说文件
3. **数据统计**: 实时阅读数据、读者画像
4. **多端同步**: 阅读进度云端同步
5. **开放 API**: 支持第三方客户端

---

## 📝 下一步

1. 确认技术栈选择
2. 初始化项目结构
3. 设计数据库 Schema
4. 实现核心功能

---

**创建时间**: 2026-03-15  
**负责人**: 赚钱小牛马
