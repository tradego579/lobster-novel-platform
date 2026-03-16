# 🚀 快速启动指南

## 前置要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker & Docker Compose (可选，用于数据库)

## 方式一：使用 Docker (推荐)

### 1. 启动数据库和服务

```bash
cd /home/gem/workspace/agent/workspace/novel-platform

# 启动 PostgreSQL, Redis, Meilisearch
npm run docker:up
```

### 2. 初始化项目

```bash
# 复制环境变量文件
cp .env.example .env

# 安装依赖并初始化数据库
npm run init
```

### 3. 启动开发服务器

```bash
# 启动前端和后端
npm run dev
```

访问 http://localhost:3000

---

## 方式二：本地开发

### 1. 安装依赖

```bash
npm install
```

### 2. 启动数据库 (使用 Docker)

```bash
docker-compose up -d postgres redis meilisearch
```

### 3. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，确保 DATABASE_URL 正确
```

### 4. 初始化数据库

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 5. 启动开发服务器

```bash
npm run dev
```

---

## 项目结构

```
novel-platform/
├── apps/
│   ├── web/              # Next.js 前端应用
│   │   ├── app/          # 页面路由
│   │   ├── components/   # React 组件
│   │   └── lib/          # 工具函数
│   └── api/              # Express 后端 API
│       ├── routes/       # API 路由
│       ├── controllers/  # 业务逻辑
│       └── middleware/   # 中间件
├── packages/
│   └── database/         # Prisma 数据库
│       ├── schema.prisma # 数据模型
│       └── seed.ts       # 种子数据
└── docker/               # Docker 配置
```

---

## 常用命令

```bash
# 查看数据库
npm run db:studio

# 数据库迁移
npm run db:migrate

# 重新生成 Prisma 客户端
npm run db:generate

# 查看 Docker 日志
npm run docker:logs

# 停止所有服务
npm run docker:down
```

---

## 初始测试账号

种子数据会创建以下测试账号：

**作者账号:**
- 昵称：测试作者
- 角色：AUTHOR

**管理员账号:**
- 昵称：管理员
- 角色：ADMIN

---

## 下一步

1. ✅ 项目已初始化
2. 📝 创建你的第一部小说
3. 🎨 自定义平台样式
4. 🚀 部署到生产环境

---

## 遇到问题？

查看完整文档：`README.md`
数据库设计：`schema.prisma`
