# 📖 API 文档

## 基础信息

- **Base URL**: `http://localhost:4000/api` (开发环境)
- **生产 URL**: `https://your-domain.com/api`
- **认证方式**: JWT Token

---

## 认证相关

### 1. 用户登录

**POST** `/auth/login`

```json
// Request
{
  "openid": "ou_xxx",
  "nickname": "用户昵称",
  "avatar": "头像 URL"
}

// Response
{
  "token": "jwt_token_xxx",
  "user": {
    "id": "user_id",
    "openid": "ou_xxx",
    "nickname": "用户昵称",
    "role": "READER"
  }
}
```

### 2. 获取当前用户

**GET** `/auth/me`

Headers: `Authorization: Bearer <token>`

```json
// Response
{
  "id": "user_id",
  "openid": "ou_xxx",
  "nickname": "用户昵称",
  "avatar": "头像 URL",
  "bio": "个人简介",
  "role": "AUTHOR"
}
```

---

## 小说相关

### 1. 获取小说列表

**GET** `/novels`

**参数**:
- `category` (可选): 分类，如 FANTASY, URBAN
- `page` (可选): 页码，默认 1
- `limit` (可选): 每页数量，默认 20
- `search` (可选): 搜索关键词
- `sort` (可选): 排序方式，newest/views/collects

```json
// Response
{
  "data": [
    {
      "id": "novel_id",
      "title": "小说标题",
      "description": "简介",
      "category": "FANTASY",
      "tags": ["标签 1", "标签 2"],
      "wordCount": 100000,
      "chapterCount": 50,
      "viewCount": 10000,
      "collectCount": 500,
      "author": {
        "id": "author_id",
        "nickname": "作者名"
      },
      "createdAt": "2026-03-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### 2. 获取小说详情

**GET** `/novels/:id`

```json
// Response
{
  "id": "novel_id",
  "title": "小说标题",
  "description": "简介",
  "cover": "封面 URL",
  "category": "FANTASY",
  "tags": ["标签 1"],
  "status": "PUBLISHED",
  "wordCount": 100000,
  "chapterCount": 50,
  "viewCount": 10000,
  "collectCount": 500,
  "likeCount": 300,
  "author": {
    "id": "author_id",
    "nickname": "作者名",
    "avatar": "头像 URL",
    "bio": "作者简介"
  },
  "chapters": [
    {
      "id": "chapter_id",
      "title": "章节标题",
      "order": 1,
      "wordCount": 3000,
      "publishedAt": "2026-03-15T10:00:00Z"
    }
  ],
  "createdAt": "2026-03-15T10:00:00Z",
  "publishedAt": "2026-03-15T10:00:00Z"
}
```

### 3. 创建小说

**POST** `/novels`

Headers: `Authorization: Bearer <token>`

```json
// Request
{
  "title": "小说标题",
  "description": "简介",
  "category": "FANTASY",
  "tags": ["标签 1", "标签 2"]
}

// Response
{
  "id": "novel_id",
  "title": "小说标题",
  "status": "DRAFT"
}
```

### 4. 更新小说

**PUT** `/novels/:id`

Headers: `Authorization: Bearer <token>`

```json
// Request
{
  "title": "新标题",
  "description": "新简介",
  "category": "URBAN",
  "tags": ["新标签"]
}
```

### 5. 删除小说

**DELETE** `/novels/:id`

Headers: `Authorization: Bearer <token>`

---

## 章节相关

### 1. 获取章节列表

**GET** `/novels/:novelId/chapters`

```json
// Response
{
  "chapters": [
    {
      "id": "chapter_id",
      "title": "章节标题",
      "order": 1,
      "wordCount": 3000,
      "status": "PUBLISHED",
      "publishedAt": "2026-03-15T10:00:00Z",
      "createdAt": "2026-03-15T10:00:00Z",
      "updatedAt": "2026-03-15T10:00:00Z"
    }
  ]
}
```

### 2. 获取章节内容

**GET** `/novels/:novelId/chapters/:chapterId`

```json
// Response
{
  "id": "chapter_id",
  "title": "章节标题",
  "content": "章节内容（Markdown）",
  "wordCount": 3000,
  "order": 1,
  "status": "PUBLISHED",
  "viewCount": 1000,
  "novel": {
    "id": "novel_id",
    "title": "小说标题"
  }
}
```

### 3. 创建章节

**POST** `/novels/:novelId/chapters`

Headers: `Authorization: Bearer <token>`

```json
// Request
{
  "title": "章节标题",
  "content": "章节内容（Markdown）"
}

// Response
{
  "id": "chapter_id",
  "title": "章节标题",
  "order": 1,
  "status": "DRAFT"
}
```

### 4. 更新章节

**PUT** `/novels/:novelId/chapters/:chapterId`

Headers: `Authorization: Bearer <token>`

```json
// Request
{
  "title": "新标题",
  "content": "新内容",
  "status": "PUBLISHED"
}
```

### 5. 删除章节

**DELETE** `/novels/:novelId/chapters/:chapterId`

Headers: `Authorization: Bearer <token>`

---

## 互动相关

### 1. 收藏小说

**POST** `/novels/:novelId/collect`

Headers: `Authorization: Bearer <token>`

### 2. 取消收藏

**DELETE** `/novels/:novelId/collect`

Headers: `Authorization: Bearer <token>`

### 3. 点赞小说

**POST** `/novels/:novelId/like`

Headers: `Authorization: Bearer <token>`

### 4. 取消点赞

**DELETE** `/novels/:novelId/like`

Headers: `Authorization: Bearer <token>`

### 5. 添加评论

**POST** `/novels/:novelId/comments`

Headers: `Authorization: Bearer <token>`

```json
// Request
{
  "content": "评论内容",
  "chapterId": "章节 ID（可选，小说评论则不传）"
}

// Response
{
  "id": "comment_id",
  "content": "评论内容",
  "likes": 0,
  "createdAt": "2026-03-15T10:00:00Z"
}
```

### 6. 获取评论列表

**GET** `/novels/:novelId/comments`

**参数**:
- `chapterId` (可选): 章节 ID，不传则获取小说总评论
- `page` (可选): 页码
- `limit` (可选): 每页数量

```json
// Response
{
  "data": [
    {
      "id": "comment_id",
      "content": "评论内容",
      "likes": 10,
      "user": {
        "id": "user_id",
        "nickname": "用户名",
        "avatar": "头像"
      },
      "replies": [],
      "createdAt": "2026-03-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "total": 50
  }
}
```

### 7. 点赞评论

**POST** `/comments/:commentId/like`

Headers: `Authorization: Bearer <token>`

---

## 书架相关

### 1. 获取我的书架

**GET** `/shelf`

Headers: `Authorization: Bearer <token>`

```json
// Response
{
  "collections": [
    {
      "id": "collection_id",
      "novel": {
        "id": "novel_id",
        "title": "小说标题",
        "cover": "封面",
        "chapterCount": 50
      },
      "lastReadChapter": {
        "id": "chapter_id",
        "title": "章节标题",
        "order": 10
      },
      "createdAt": "2026-03-15T10:00:00Z"
    }
  ]
}
```

### 2. 添加到书架

**POST** `/shelf/:novelId`

Headers: `Authorization: Bearer <token>`

### 3. 移除书架

**DELETE** `/shelf/:novelId`

Headers: `Authorization: Bearer <token>`

---

## 阅读历史

### 1. 获取阅读历史

**GET** `/history`

Headers: `Authorization: Bearer <token>`

```json
// Response
{
  "history": [
    {
      "novel": {
        "id": "novel_id",
        "title": "小说标题",
        "cover": "封面"
      },
      "lastChapter": {
        "id": "chapter_id",
        "title": "章节标题",
        "order": 10
      },
      "lastReadAt": "2026-03-15T10:00:00Z"
    }
  ]
}
```

### 2. 记录阅读进度

**POST** `/history/:novelId`

Headers: `Authorization: Bearer <token>`

```json
// Request
{
  "chapterId": "chapter_id"
}
```

---

## 搜索相关

### 1. 搜索小说

**GET** `/search`

**参数**:
- `q` (必填): 搜索关键词
- `type` (可选): 搜索类型，novel/chapter/all
- `category` (可选): 分类过滤
- `page` (可选): 页码
- `limit` (可选): 每页数量

```json
// Response
{
  "data": [
    {
      "type": "novel",
      "id": "novel_id",
      "title": "小说标题",
      "description": "简介",
      "highlight": "高亮显示的匹配内容"
    }
  ],
  "pagination": {
    "page": 1,
    "total": 100
  }
}
```

---

## 排行榜

### 1. 获取排行榜

**GET** `/rankings`

**参数**:
- `type` (可选): 类型，views/collects/likes/newest
- `category` (可选): 分类过滤
- `limit` (可选): 返回数量，默认 10

```json
// Response
[
  {
    "id": "novel_id",
    "title": "小说标题",
    "viewCount": 10000,
    "collectCount": 500,
    "author": {
      "nickname": "作者名"
    }
  }
]
```

---

## 错误响应

所有错误返回统一格式：

```json
{
  "error": "错误信息",
  "code": "错误代码"
}
```

### 常见错误代码

- `400`: 请求参数错误
- `401`: 未授权（Token 无效或过期）
- `403`: 禁止访问（权限不足）
- `404`: 资源不存在
- `500`: 服务器内部错误

---

## 速率限制

- 未认证用户：100 请求/小时
- 认证用户：1000 请求/小时
- 写操作：60 请求/分钟

超过限制返回 `429 Too Many Requests`

---

## 版本

当前 API 版本：v1

版本通过 URL 前缀标识：`/api/v1/...`
