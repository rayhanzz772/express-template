# 🚀 Express Template (Node.js + Express 5 + Sequelize + Zod)

Production-ready **Express.js backend template** with modular architecture, **Sequelize ORM**, **Zod validation**, **JWT cookie authentication**, and **role-based access control (RBAC)** with a permission registry and audit log.

---

## ✨ Features

- Modular architecture: every domain lives in `src/modules/<name>/` (router + controller + schema)
- Sequelize ORM with CLI migrations, models, and seeders under `/db/`
- PostgreSQL (default) or MySQL — both drivers installed
- JWT authentication (httpOnly cookie or `Authorization: Bearer` header)
- RBAC: `roles` ↔ `permissions` many-to-many, enforced per route via `requirePermission('<key>')`
- Zod request validation with normalized 422 error messages
- Centralized API response formatter (`src/utils/api.js`)
- Global error handler that renders every `next(err)` as the same JSON envelope
- Audit log for every create/update/delete (`audit_logs` table)
- Argon2 password hashing
- Rate limiting per module (2000 requests / 15 minutes)
- Helmet, CORS with origin allow-list, Morgan request logging
- Generators for model + migration + seeder in a single command
- Health check endpoint with database connectivity probe

---

## 🧰 Tech Stack

| Layer | Package |
| --- | --- |
| Runtime | Node.js |
| HTTP | `express` ^5.1.0 |
| ORM | `sequelize` ^6.37.7, `sequelize-cli` ^6.6.3 |
| Database | `pg` ^8.16.3, `mysql2` ^3.15.3 |
| Validation | `zod` ^4.1.12 |
| Auth | `jsonwebtoken`, `cookie-parser`, `argon2` |
| Security | `helmet`, `cors`, `express-rate-limit` |
| Utilities | `axios` (HTTP status enums), `cuid` (ID generation), `dotenv`, `morgan` |
| Dev | `nodemon` |

---

## 📂 Folder Structure

```
express-template/
├── index.js                    # Entry point: app setup, /health, mounts /api/v1
├── config/
│   └── config.js               # Sequelize config per NODE_ENV (local/development/staging/production)
├── db/
│   ├── models/                 # Sequelize models + loader (index.js)
│   │   ├── index.js
│   │   ├── user.js
│   │   ├── role.js
│   │   ├── permission.js
│   │   ├── role-permission.js
│   │   └── audit-log.js
│   ├── migrations/
│   └── seeders/
├── src/
│   ├── routes.js               # /api/v1 router
│   ├── middleware/
│   │   ├── authMiddleware.js       # Verifies JWT, populates req.user
│   │   ├── permissionMiddleware.js # requirePermission('<key>')
│   │   ├── roleMiddleware.js       # adminOnly (available, not wired to routes)
│   │   └── errorMiddleware.js      # Global JSON error handler
│   ├── modules/
│   │   ├── auth/                   # index.js, controller.js
│   │   ├── user/                   # index.js, controller.js, schema.js
│   │   ├── role/                   # index.js, controller.js, schema.js
│   │   └── permission/             # index.js, controller.js
│   ├── scripts/
│   │   └── make-all.js             # Generates model + migration + seeder
│   └── utils/
│       ├── api.js                  # Response formatter + pagination helpers
│       ├── validation.js           # Zod wrapper (validateRequest, validationFiles)
│       ├── argon.js                # hashPassword / compare
│       ├── auditLog.js             # createAuditLog
│       ├── limiter.js              # Module-level rate limiter
│       ├── jwt.js                  # generateToken / verifyToken / decodeToken (optional)
│       ├── redis.js                # Cache helpers (requires config/redis, optional)
│       ├── helper.js               # Redis-backed rate limiter factory (optional)
│       ├── csrf.js                 # csurf middleware (optional)
│       ├── s3.js                   # S3 upload helpers (optional)
│       ├── bcrypt.js               # bcrypt helpers (optional, argon2 is used)
│       └── formatLog.js            # Human-readable field diff (optional)
├── .env.example
├── .sequelizerc
├── .prettierrc
├── package.json
└── README.md
```

**Module convention**

| File | Responsibility |
| --- | --- |
| `index.js` | Express router: mounts paths, attaches middleware/permission guard |
| `controller.js` | Static-method class of request handlers |
| `schema.js` | Zod schemas for that module |

---

## ⚙️ Installation

```bash
git clone https://github.com/rayhanzz772/express-template.git
cd express-template
npm install
```

---

## 🧾 Environment Setup

Copy `.env.example` to `.env`:

```env
NODE_ENV=development
APP_PORT=8000
PORT=8000
JWT_KEY=xxxxxxxxxxxxxxxxx
JWT_EXP=1d
APP_IV=xxxxxxxxxxxxxxxx
APP_SIGNATURE_KEY=xxxxxxxxxxxx

DB_USER=postgres
DB_PASS=postgres
DB_NAME=postgres
DB_HOST='127.0.0.1'
DB_PORT=5432
DB_CONNECTION=postgresql
DB_SSL=false

JWT_SECRET=jxx871kr59
```

| Variable | Used by | Notes |
| --- | --- | --- |
| `NODE_ENV` | `index.js`, `config/config.js`, `db/models/index.js` | Selects the config block and enables production security flags |
| `PORT` | `index.js` | Listen port (default `8000`) |
| `JWT_KEY` | `auth/controller.js`, `authMiddleware.js` | Signing secret for auth tokens |
| `DB_USER`, `DB_PASS`, `DB_NAME`, `DB_HOST`, `DB_PORT`, `DB_CONNECTION` | `config/config.js` | `DB_CONNECTION` is the Sequelize dialect (`postgresql` or `mysql`) |
| `ALLOWED_ORIGINS` | `index.js` | Comma-separated origin allow-list; `*` allows all |
| `APP_PORT`, `JWT_EXP`, `APP_IV`, `APP_SIGNATURE_KEY`, `JWT_SECRET` | optional utils (`src/utils/jwt.js`) | Reserved for the optional JWT helper |

---

## 🧩 Database Setup

`.sequelizerc` points the CLI at `config/config.js`, `db/models`, `db/seeders`, and `db/migrations` — no `sequelize init` needed.

```bash
npm run migrate          # run all migrations
npm run seed             # run all seeders

npm run migrate:undo     # rollback last migration
npm run migrate:undo:all # rollback everything
npm run seed:undo        # undo all seeders
```

### Schema

| Table | Model | Key columns |
| --- | --- | --- |
| `users` | `User` | `id` (string PK), `email`, `username` (unique), `password` (argon2 hash), `role_id` → `roles.id`, `status`, `created_at`, `updated_at`, `deleted_at` (paranoid) |
| `roles` | `Role` | `id` (cuid PK), `code` (unique), `name` (unique), `description`, `status`, `deleted_at` |
| `permissions` | `Permission` | `id` (cuid PK), `key` (e.g. `user.read`), `resource`, `action`, `description` |
| `role_permissions` | `RolePermission` | `id` (cuid PK), `role_id` → `roles.id`, `permission_id` → `permissions.id` (both `ON DELETE CASCADE`) |
| `audit_logs` | `AuditLog` | `id` (cuid PK), `user_id` → `users.id`, `action` (`CREATE`/`UPDATE`/`DELETE`), `entity`, `entity_id`, `old_data` (JSONB), `new_data` (JSONB), `created_at` |

### Associations

```
Role      hasMany   User            (as: 'users',       foreignKey: role_id)
User      belongsTo Role            (as: 'role',        foreignKey: role_id)
Role      belongsToMany Permission  (as: 'permissions', through: RolePermission)
Permission belongsToMany Role       (as: 'roles',       through: RolePermission)
AuditLog  belongsTo User            (as: 'user',        foreignKey: user_id)
```

All models use `underscored: true` and `timestamps: true`; `Role` and `User` are soft-deleted (`deleted_at`).

### Seeded data

- **Role**: `ADMIN` (code `ADM`) with every permission attached.
- **Permissions**: `dashboard.read`, `user.read`, `user.create`, `user.update`, `user.delete`, `role.read`, `role.create`, `role.update`, `role.delete`, `role.permission.assign`.
- **Users**: `admin@example.com` and `john@example.com`, username `superadmin` / `john_doe`, password `Password123!` (argon2 hash), role `ADMIN`.

Seeders are idempotent — they skip rows that already exist.

---

## 🔐 Authentication

`POST /api/v1/auth/login` verifies the Argon2 hash and signs a JWT:

```js
{ userId, role, status }   // expiresIn: '7d'
```

The token is returned **and** set as a cookie named `token` (`httpOnly`, `sameSite: 'strict'`, `secure` in production, `maxAge` 7 days).

`authMiddleware` resolves the token from `req.cookies.token` first, then `req.headers.authorization` (`Bearer <token>`), and populates:

```js
req.user = { id, role, type, status }
```

Requests with `status === false` are rejected with `403`.

---

## 🛡️ RBAC (Roles & Permissions)

`requirePermission('<key>')` reloads the user with role + permissions on every guarded request and then:

1. `401` if the authenticated user no longer exists
2. `403` if the user or the role is inactive
3. `403` if the role does not hold the required permission key
4. otherwise sets `req.user.role` / `req.user.status` and continues

To protect a new endpoint, add the guard in the module router:

```js
router.get('/', requirePermission('user.read'), Controller.getUser)
```

`src/middleware/roleMiddleware.js` exports `adminOnly` (hard `ADMIN` role check) — available, currently unused by any route.

---

## 🌐 API Endpoints

Base path: `/api/v1`

### Health & status

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/health` | — | Runs `sequelize.authenticate()`; `200` when the DB responds, `503` when it does not |
| `GET` | `/api/v1/status` | — | Plain-text liveness probe (`Running ⚡`) |

### Auth — `/api/v1/auth`

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/login` | — | Body `{ email, password }`. Returns `{ id, token, email, role, permissions }` and sets the `token` cookie |
| `POST` | `/logout` | — | Clears the `token` cookie |
| `GET` | `/get-me` | JWT | Returns `{ id, email, status, role, permissions }` of the current user |

### Users — `/api/v1/users`

All routes run the rate limiter and require a valid JWT.

| Method | Path | Permission | Description |
| --- | --- | --- | --- |
| `GET` | `/` | `user.read` | Paginated list. Query: `per_page` (max 100), `page`, `q` (email search), `role` (`ADMIN`/`HR`/`EMPLOYEE`), `status` (`true`/`false`), `sort_by` (`email`/`role`/`status`/`created_at`), `sort_order` (`ASC`/`DESC`) |
| `GET` | `/:id/detail` | `user.read` | Single user with role |
| `POST` | `/create` | `user.create` | Body `{ email, username, password (min 8), role?, status? }` — `role` defaults to `EMPLOYEE` |
| `PUT` | `/:id/update` | `user.update` | Partial update; at least one of `email`, `password`, `role`, `status` |
| `DELETE` | `/:id/delete` | `user.delete` | Soft delete (`deleted_at`) |
| `PATCH` | `/:id/status` | `user.update` | Toggles `status` |
| `GET` | `/get-all-roles` | `role.read` | Active roles only |

Passwords are hashed with Argon2 before insert/update; `password` and `role_id` are stripped from responses.

### Roles — `/api/v1/roles`

All routes run the rate limiter and require a valid JWT.

| Method | Path | Permission | Description |
| --- | --- | --- | --- |
| `GET` | `/` | `role.read` | Paginated list. Query: `per_page`, `page`, `q` (name/description search), `status`, `sort_by` (`name`/`status`/`created_at`/`updated_at`), `sort_order` |
| `GET` | `/:id/detail` | `role.read` | Role with its permissions |
| `GET` | `/:id/permissions` | `role.read` | Permission list of the role |
| `POST` | `/create` | `role.create` | Body `{ code, name, description?, status? }` — `code` is stored uppercase |
| `PUT` | `/:id/update` | `role.update` | Partial update of `name`, `description`, `status` |
| `PUT` | `/:id/permissions` | `role.permission.assign` | Body `{ permission_ids: [] }`. Replaces the whole set in a transaction |
| `DELETE` | `/:id/delete` | `role.delete` | `409` when the role is still assigned to users |
| `PATCH` | `/:id/status` | `role.update` | Toggles `status`; `ADMIN` role only, and the `ADMIN` role itself cannot be toggled |

### Permissions — `/api/v1/permissions`

| Method | Path | Permission | Description |
| --- | --- | --- | --- |
| `GET` | `/` | `role.read` | List all permissions |

Unknown paths fall through to a `404` JSON handler. Every list/detail/create/update/delete of `User` and `Role` writes an `audit_logs` row.

---

## 📦 API Response Format

Every JSON body is produced by `api(data, code, { req, err })` from `src/utils/api.js`:

```json
{
  "success": true,
  "message": "success",
  "metadata": {},
  "data": { }
}
```

- `success` is `code >= 200 && code < 300`.
- `message` is `"success"`, or the error message when `err` is passed (`ZodError`, Sequelize `ValidationError`/`DatabaseError`/`UniqueConstraintError`/`ForeignKeyConstraintError` are mapped to readable text).
- `metadata` carries pagination when `data` is `{ count, rows }` or `{ data, per_page, page }`:

```json
{
  "success": true,
  "message": "success",
  "metadata": { "per_page": 10, "current_page": 1, "total_row": 42, "total_page": 5 },
  "data": [ ]
}
```

Health check example:

```json
{
  "success": true,
  "message": "success",
  "metadata": {},
  "data": { "status": "ok", "database": "connected", "timestamp": "2026-01-01T00:00:00.000Z" }
}
```

Helpers exported: `api` (alias `results`), `sequelizePaginate(page, perPage)`, `paginateArray(array, pageSize, pageNumber)`.

---

## 🧠 Validation (Zod)

Schemas live beside the controller that uses them (`src/modules/user/schema.js`, `src/modules/role/schema.js`) and are applied through `validateRequest` from `src/utils/validation.js`.

```js
const { z } = require('zod')

const createUserSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['ADMIN', 'HR', 'EMPLOYEE']).default('EMPLOYEE'),
  status: z.boolean().default(true)
})

module.exports = { createUserSchema }
```

Controller usage:

```js
const { validateRequest } = require('../../utils/validation')
const { createUserSchema } = require('./schema')

const payload = validateRequest(createUserSchema, { body: req.body })
```

A `ZodError` is converted into `{ code: 422, message: '<field>: <message>' }` and forwarded with `next(err)`.

### Controller pattern

```js
class Controller {
  static async getUser(req, res, next) {
    try {
      const result = await db.sequelize.query(/* parameterized SQL */, {
        type: db.Sequelize.QueryTypes.SELECT,
        replacements
      })

      return res.status(HttpStatusCode.Ok).json(api(result, HttpStatusCode.Ok, { req }))
    } catch (err) {
      return next(err)
    }
  }
}

module.exports = Controller
```

Handlers are `static async`, always wrap in `try/catch`, and forward errors with `next(err)`. Throw plain objects shaped like `{ code, message }` for expected failures (the shape the `api()` error mapper understands).

### Router pattern

```js
const Controller = require('./controller')
const router = require('express').Router()
const authMiddleware = require('../../middleware/authMiddleware')
const requirePermission = require('../../middleware/permissionMiddleware')
const limiter = require('../../utils/limiter')

router.use(limiter)
router.use(authMiddleware)
router.get('/', requirePermission('user.read'), Controller.getUser)

module.exports = router
```

Register the module in `src/routes.js`:

```js
router.use('/users', require('./modules/user/index'))
```

---

## 🏗️ Generating a New Module Resource

`src/scripts/make-all.js` scaffolds a model, a migration, and a seeder using the project's naming and ID conventions (`<YYYYMM><0001>-create-<name>.js`, table `<name>s`, cuid IDs).

```bash
npm run make:all -- Invoice
```

Individually:

```bash
npm run model:make -- --name Invoice   # sequelize model:generate
npm run migration:make -- --name add-status-to-invoice
npm run seed:make -- --name demo-invoice
```

Generated files still need the real columns added — templates only include `id`.

---

## 🧰 Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server with Nodemon |
| `npm start` | Production server (`node index.js`) |
| `npm run migrate` | Run all migrations |
| `npm run migrate:undo` | Rollback last migration |
| `npm run migrate:undo:all` | Rollback all migrations |
| `npm run seed` | Run all seeders |
| `npm run seed:undo` | Undo all seeders |
| `npm run model:make -- --name <Name>` | Generate a Sequelize model |
| `npm run migration:make -- --name <name>` | Generate a migration |
| `npm run seed:make -- --name <name>` | Generate a seeder |
| `npm run make:all -- <Name>` | Generate model + migration + seeder together |

---

## 🛡️ Security & Middleware Stack

Order applied in `index.js`:

1. `helmet` (with `hidePoweredBy`) and `app.disable('x-powered-by')`
2. `cors` — dynamic origin check: `*` allows everything, otherwise the request origin must be in `ALLOWED_ORIGINS`; in production, unlisted origins and requests without an origin header are rejected, and credentials are enabled only for allowed origins
3. `morgan('dev')` request logging
4. `cookie-parser`
5. `express.json` / `express.urlencoded` with a `50mb` limit, both capturing `req.rawBody`

Per module: `express-rate-limit` (`windowMs` 15 minutes, limit 2000, JSON handler that forwards `{ statusCode, message: 'Too many requests' }`).

Finally, `errorMiddleware` (registered after the `404` fallback) turns every `next(err)` into the JSON envelope:

- Status code comes from `err.statusCode`, falling back to `err.code`, when it is an integer in the `400–599` range; otherwise `500`.
- Objects without a `message` get a generic one (`Internal server error` for 5xx, `Request failed` otherwise).
- 5xx failures are logged to the console.
- Errors raised as `next({ statusCode, message })` (auth, permission, rate limiter), thrown `{ code, message }` objects, and `ZodError` / Sequelize errors are all rendered as JSON instead of Express's default HTML error page.

---

## ⚠️ Implementation Notes

- `src/utils/redis.js`, `helper.js`, `csrf.js`, and `s3.js` are optional helpers. They import `config/redis` and packages (`rate-limit-redis`, `csurf`, `@aws-sdk/*`) that this template does not install or wire up. `bcrypt.js` is unused — the app uses `argon2.js`.
- `role.permission.assign` was added to `db/seeders/2026020002-demo-permisson.js`. On a database seeded before that change, re-run `npm run seed` so the seeder attaches the new key to the `ADMIN` role.

---

## 🧑💻 Author

**Rayhan Z**
Backend Developer | Node.js & Express Enthusiast
🔗 [GitHub](https://github.com/rayhanzz772)

---

## 🪄 License

This project is licensed under the **MIT License**.
Feel free to use and modify for your own backend projects.

---

> 💡 *Tip:* Fork this repo as your boilerplate backend for all new projects — copy `src/modules/user/` as the reference for a new module (router + controller + schema), then register it in `src/routes.js` and add its permission keys to a seeder.
