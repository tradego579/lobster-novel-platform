# 📦 部署指南

## 生产环境部署

### 前置准备

1. 服务器要求：
   - CPU: 2 核+
   - 内存：4GB+
   - 存储：20GB+
   - 系统：Ubuntu 20.04+ / CentOS 7+

2. 软件要求：
   - Docker 20.10+
   - Docker Compose 2.0+
   - Node.js 18+ (本地开发)

---

## 方式一：Docker 部署（推荐）

### 1. 准备服务器

```bash
# 安装 Docker
curl -fsSL https://get.docker.com | bash -s docker

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker --version
docker-compose --version
```

### 2. 克隆项目

```bash
git clone <your-repo-url> novel-platform
cd novel-platform
```

### 3. 配置环境变量

```bash
cp .env.example .env

# 编辑 .env 文件，修改以下关键配置：
# DATABASE_URL=postgresql://user:password@postgres:5432/novel_platform
# JWT_SECRET=<生成一个强随机字符串>
# NODE_ENV=production
```

### 4. 启动服务

```bash
# 构建并启动所有服务
docker-compose -f docker-compose.prod.yml up -d

# 查看日志
docker-compose logs -f
```

### 5. 初始化数据库

```bash
# 进入容器执行迁移
docker-compose exec app npm run db:migrate:prod
docker-compose exec app npm run db:seed
```

---

## 方式二：手动部署

### 1. 安装依赖

```bash
# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装项目依赖
npm install
```

### 2. 启动数据库

```bash
# 使用 Docker 启动 PostgreSQL 和 Redis
docker-compose up -d postgres redis meilisearch
```

### 3. 构建应用

```bash
# 生成 Prisma 客户端
npm run db:generate

# 数据库迁移
npm run db:migrate:prod

# 构建前端
npm run build
```

### 4. 配置 Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. 使用 PM2 管理进程

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start npm --name "novel-web" -- run start
pm2 start npm --name "novel-api" -- run start:api

# 设置开机自启
pm2 startup
pm2 save
```

---

## 环境变量说明

### 必需配置

```bash
# 数据库
DATABASE_URL="postgresql://user:password@host:5432/database"

# Redis
REDIS_URL="redis://host:6379"

# JWT
JWT_SECRET="your-secret-key-change-in-production"

# 应用
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### 可选配置

```bash
# 对象存储（图片上传）
OSS_ENDPOINT="https://oss-cn-hangzhou.aliyuncs.com"
OSS_BUCKET="your-bucket"
OSS_ACCESS_KEY="your-access-key"
OSS_ACCESS_SECRET="your-access-secret"

# 邮件服务（用户通知）
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-password"

# 飞书集成（登录认证）
FEISHU_APP_ID="cli_xxx"
FEISHU_APP_SECRET="xxx"
```

---

## 性能优化

### 1. 数据库优化

```sql
-- 添加索引
CREATE INDEX idx_novels_category ON novels(category);
CREATE INDEX idx_novels_status ON novels(status);
CREATE INDEX idx_novels_author ON novels(author_id);
CREATE INDEX idx_chapters_novel ON chapters(novel_id);
```

### 2. Redis 缓存

- 缓存热门小说列表
- 缓存用户会话
- 缓存章节内容

### 3. CDN 加速

- 静态资源使用 CDN
- 图片使用对象存储 + CDN

---

## 监控与日志

### 1. 应用监控

```bash
# 使用 PM2 监控
pm2 monit

# 查看日志
pm2 logs
```

### 2. 数据库监控

```bash
# PostgreSQL 慢查询日志
# 在 postgresql.conf 中配置：
log_min_duration_statement = 1000
```

### 3. 错误追踪

建议集成：
- Sentry（错误追踪）
- LogRocket（用户行为回放）

---

## 备份策略

### 1. 数据库备份

```bash
# 每天备份
0 2 * * * pg_dump -U novel novel_platform > /backup/novel_$(date +\%Y\%m\%d).sql

# 保留 7 天
find /backup -name "novel_*.sql" -mtime +7 -delete
```

### 2. 文件备份

- 用户上传的图片
- 日志文件

---

## 安全建议

1. **启用 HTTPS**
   ```bash
   # 使用 Let's Encrypt
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

2. **配置防火墙**
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw allow 22/tcp
   sudo ufw enable
   ```

3. **定期更新**
   ```bash
   # 系统更新
   sudo apt update && sudo apt upgrade -y

   # 依赖更新
   npm audit fix
   ```

4. **限制 API 请求**
   - 使用 rate limiting
   - 配置 CORS

---

## 常见问题

### Q: 数据库连接失败？
A: 检查 DATABASE_URL 配置，确保 PostgreSQL 容器正常运行

### Q: 前端页面 404？
A: 检查 Next.js 构建是否成功，查看 .next 目录

### Q: 图片上传失败？
A: 检查 uploads 目录权限，或配置对象存储

---

## 技术支持

遇到问题？查看：
- 项目文档：README.md
- 快速启动：QUICKSTART.md
- 项目状态：PROJECT_STATUS.md
