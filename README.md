# 非遗工坊体验预约平台

汇聚非遗传承人工坊，支持课程发布、学员预约、学习记录和评价反馈，让传统文化触手可及。

## Docker 快速启动

```bash
cp .env.example .env
docker compose up -d --build
```

访问地址：

- 前端：http://localhost:28032
- 后端健康检查：http://localhost:29070/health
- MySQL：localhost:38103

默认演示账号，密码均为 `demo123`：

- 传承人：`13800000001`
- 学员：`13800000002`
- 管理员：`13800000003`

## 主要功能

- 工坊列表筛选：按标签、评分、地区筛选，展示工坊卡片与传承人信息。
- 工坊详情：展示工坊介绍、传承人、课程列表和评价列表。
- 课程预约：选择日期、时段、人数并提交预约。
- 我的预约：按待体验、已完成、已取消三个 Tab 管理预约。
- 传承人工作台：查看工坊、课程、预约和评价统计，支持预约签到。
- JWT 认证与角色切换：后端 JWT 中间件、角色守卫，前端路由守卫与 `useAuth()`。
- 全局错误处理：后端统一异常过滤器，前端 axios 拦截器和 `ErrorBoundary`。

## 本地开发

后端：

```bash
cd backend
npm install
npm run start:dev
```

前端：

```bash
cd frontend
npm install
npm run dev
```

本地开发时，前端仍调用 `/api`，由 Vite 代理转发到 `http://localhost:29070`。

## 技术栈

| 层级 | 技术 |
| --- | --- |
| 前端 | Vue 3、TypeScript、Vite、Vant、Pinia、Vue Router、Axios、dayjs |
| 后端 | NestJS、TypeScript、TypeORM、JWT、class-validator、dayjs |
| 数据库 | MySQL 8.0 |
| 部署 | Docker Compose、Nginx 反向代理 |

## 项目结构

```text
.
├── frontend/
│   ├── src/api/
│   ├── src/stores/
│   ├── src/types/
│   ├── src/components/common/
│   ├── src/hooks/
│   ├── src/pages/
│   ├── src/router/
│   └── src/utils/
├── backend/
│   └── src/
│       ├── modules/workshop/
│       ├── modules/course/
│       ├── modules/booking/
│       ├── modules/review/
│       ├── modules/user/
│       ├── modules/auth/
│       ├── common/enums/
│       ├── common/middlewares/
│       ├── common/filters/
│       ├── config/
│       └── utils/
├── database/
├── docker-compose.yml
├── .env.example
└── README.md
```

## 环境变量

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `COMPOSE_PROJECT_NAME` | Compose 英文项目名，避免中文目录名导致启动失败 | `cyheritage` |
| `DB_NAME` | MySQL 数据库名 | `heritage` |
| `DB_USER` | MySQL 用户 | `heritage` |
| `DB_PASSWORD` | MySQL 用户密码 | `heritage_pwd` |
| `DB_ROOT_PASSWORD` | MySQL root 密码 | `root_pwd` |
| `JWT_SECRET` | JWT 签名密钥 | `change_me_to_a_long_random_string` |
| `FRONTEND_PORT` | 前端端口映射 | `28032` |
| `BACKEND_PORT` | 后端端口映射 | `29070` |
| `DB_PORT` | 数据库端口映射 | `38103` |

## 枚举出现位置

预约状态 `BookingStatus = pending / confirmed / completed / cancelled / no_show`：

- 后端：`backend/src/common/enums/booking-status.enum.ts`
- 后端引用：`backend/src/modules/booking/entity/booking.entity.ts`、`backend/src/modules/booking/dto/update-booking-status.dto.ts`、`backend/src/modules/booking/booking.service.ts`、`backend/src/modules/booking/booking.controller.ts`、`backend/src/modules/review/review.service.ts`
- 前端：`frontend/src/types/enums.ts`
- 前端引用：`frontend/src/types/entities.ts`、`frontend/src/stores/booking.ts`、`frontend/src/pages/MyBookingsPage.vue`、`frontend/src/pages/InstructorDashboardPage.vue`、`frontend/src/components/common/StatusBadge.vue`

工坊标签 `WorkshopTag = pottery / embroidery / paper_cutting / wood_carving / tie_dye / lacquer / calligraphy / tea_ceremony`：

- 后端：`backend/src/common/enums/workshop-tag.enum.ts`
- 后端引用：`backend/src/modules/workshop/entity/workshop.entity.ts`、`backend/src/modules/workshop/dto/create-workshop.dto.ts`、`backend/src/modules/workshop/workshop.service.ts`、`backend/src/modules/workshop/workshop.controller.ts`、`backend/src/utils/seed-data.ts`
- 前端：`frontend/src/types/enums.ts`
- 前端引用：`frontend/src/types/entities.ts`、`frontend/src/api/workshop.ts`、`frontend/src/stores/workshop.ts`、`frontend/src/components/common/WorkshopCard.vue`、`frontend/src/components/common/TagFilter.vue`、`frontend/src/pages/WorkshopsPage.vue`、`frontend/src/pages/WorkshopDetailPage.vue`

## Docker 部署说明

- `docker-compose.yml` 不使用废弃的 `version` 字段，顶层 `name: cyheritage` 作为兜底项目名。
- 容器名统一带 `${COMPOSE_PROJECT_NAME:-cyheritage}` 前缀。
- MySQL 数据使用命名卷 `db_data` 持久化，避免中文路径绑定挂载问题。
- 前端 Nginx 将 `/api/` 反向代理到 `http://backend:29070/`，前端代码不硬编码后端地址。
- 后端依赖 MySQL `healthcheck`，前端依赖后端健康检查。
- 如端口冲突，修改 `.env` 中的 `FRONTEND_PORT`、`BACKEND_PORT`、`DB_PORT` 后重新执行 `docker compose up -d`。

## License

MIT
