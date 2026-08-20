# EthioService

Online service booking platform for the Ethiopian market. Book service providers (plumbers, electricians, cleaners), doctors, and tutors with secure payment processing via Telebirr and Chapa.

## Features

- **User Authentication** - JWT-based auth with customer, provider, and admin roles
- **Service Booking** - Book doctors, tutors, and service providers
- **Payment Processing** - Telebirr and Chapa payment integration
- **Provider Management** - Registration with certificate verification
- **Admin Panel** - Dashboard with stats, provider verification, complaints
- **Messaging** - Real-time chat between customers and providers
- **Reviews & Ratings** - Rate and review service providers
- **Nearby Search** - Find services by location
- **Dark/Light Mode** - Theme toggle with persistent preference
- **Complaints System** - Submit and manage complaints
- **Input Validation** - Server-side validation on all endpoints
- **Security** - Helmet.js, rate limiting, CORS, auth-protected uploads

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Axios, Lucide React |
| Backend | Node.js, Express 4, JWT, bcryptjs |
| Database | PostgreSQL via Sequelize ORM |
| Payments | Telebirr API, Chapa API |
| Security | Helmet.js, express-rate-limit, express-validator |
| Logging | Winston |
| Deployment | Vercel (frontend), Render (backend), Supabase (database), Docker |

## Installation

### Prerequisites
- Node.js 20+
- PostgreSQL 14+
- npm or yarn

### Setup

```bash
git clone https://github.com/samson12-art/ethioservice.git
cd ethioservice

# Install backend dependencies
cd backend
cp .env.example .env
# Edit .env with your database credentials and secrets
npm install

# Install frontend dependencies
cd ../frontend
cp .env.example .env
npm install

# Seed the database (optional)
cd ../backend
npm run seed
```

### Running Locally

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Frontend: http://localhost:3000  
Backend API: http://localhost:5000  
Health Check: http://localhost:5000/api/health

## Environment Variables

See `backend/.env.example` for all required variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `DB_HOST` | PostgreSQL host | Yes |
| `DB_PORT` | PostgreSQL port | Yes |
| `DB_NAME` | Database name | Yes |
| `DB_USER` | Database user | Yes |
| `DB_PASSWORD` | Database password | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `JWT_EXPIRE` | Token expiration | No (default: 30d) |
| `CORS_ORIGIN` | Allowed origins | No (default: *) |
| `CHAPA_SECRET_KEY` | Chapa API secret | For payments |
| `CHAPA_PUBLIC_KEY` | Chapa API public key | For payments |
| `TELEBIRR_APP_ID` | Telebirr app ID | For payments |

## Cloud Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variable:
   - `VITE_API_URL` = `https://your-app.onrender.com/api`
5. Deploy

### Backend (Render)

1. Go to [render.com](https://render.com) and create a new **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: ethioservice-api
   - **Runtime**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && node server.js`
   - **Health Check Path**: `/api/health`
4. Add environment variables:
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`
   - `JWT_SECRET` = (generate a strong random secret)
   - `CORS_ORIGIN` = `https://your-app.vercel.app`
   - `CHAPA_SECRET_KEY`, `CHAPA_PUBLIC_KEY`, etc.
5. Deploy

### Database (Supabase)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to **Settings** → **Database** → **Connection string**
3. Copy the **URI** (under Pooler) and use it as `DATABASE_URL` in Render
4. Run migrations on first deploy:
   ```bash
   cd backend
   npx sequelize-cli db:migrate
   ```
5. Optionally seed the database:
   ```bash
   node seed.js
   ```

## Docker Deployment

```bash
# Copy and configure environment
cp backend/.env.example .env

# Start all services
docker-compose up -d

# Run migrations
docker-compose exec api npx sequelize-cli db:migrate

# Seed database
docker-compose exec api node seed.js
```

## PM2 Deployment

```bash
cd backend
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Customer registration |
| POST | `/api/auth/register-provider` | No | Provider registration |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/services` | No | List services |
| GET | `/api/services/doctors` | No | List doctors |
| GET | `/api/tutors` | No | List tutors |
| POST | `/api/bookings` | Yes | Create booking |
| GET | `/api/bookings/my-bookings` | Yes | User's bookings |
| POST | `/api/payments/initiate` | Yes | Process payment |
| POST | `/api/payments/remaining` | Yes | Remaining payment |
| POST | `/api/messages/send` | Yes | Send message |
| GET | `/api/messages/conversations` | Yes | Get conversations |
| POST | `/api/reviews` | Yes | Submit review |
| POST | `/api/complaints` | Yes | Submit complaint |
| GET | `/api/admin/stats` | Admin | Dashboard stats |
| GET | `/api/health` | No | Health check |

## Database Migrations

```bash
cd backend

# Create a migration
npx sequelize-cli migration:generate --name migrate-users

# Run migrations
npm run migrate

# Undo last migration
npm run migrate:undo
```

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Project Structure

```
ethioservice/
├── backend/
│   ├── config/          # Database, logger, Sequelize config
│   ├── controllers/     # Route handlers
│   ├── middleware/       # Auth, validation
│   ├── models/          # Sequelize models
│   ├── routes/          # Express routes
│   ├── tests/           # Jest + Supertest tests
│   ├── uploads/         # User uploaded files
│   ├── logs/            # Application logs
│   ├── migrations/      # Sequelize migrations
│   ├── server.js        # Express entry point
│   └── seed.js          # Database seeder
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React Context providers
│   │   ├── pages/       # Page components
│   │   └── services/    # API client
│   └── vite.config.js
├── docker-compose.yml
├── Dockerfile
└── nginx.conf
```

## License

MIT
