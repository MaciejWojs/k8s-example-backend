# k8s-app Backend API

A simple RESTful API built with TypeScript and Bun. This application implements a clean architecture pattern with well-defined layers: domain, application, infrastructure, and API. The backend manages posts functionality and uses PostgreSQL for data persistence.

## Features

- **Clean Architecture**: Modular design separating concerns across domain entities, business logic (use cases), and infrastructure implementations
- **TypeScript**: Full type safety with modern TypeScript features
- **PostgreSQL Database**: Robust data persistence with Drizzle ORM for migrations
- **API Routes**: RESTful API endpoints for CRUD operations on posts
- **Database Seeding**: Pre-populated sample data for development

## Prerequisites

- [Bun](https://bun.sh/) runtime (v1.0+)
- Docker & Docker Compose (optional, for local database)

## Quick Start with Docker Compose

The easiest way to run this application locally is using Docker Compose:

```bash
# Clone the repository and navigate to the app directory
cd app

# Build and start all services (PostgreSQL + API)
docker-compose up -d

# Or just start the database for development
docker-compose up -d db

# Then run migrations and seed data
bun run migrate
bun run seed

# Start the development server
bun run dev
```

The application will be available at `http://localhost:3000`

## Manual Setup (Without Docker)

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Environment Variables

Copy and edit the environment configuration file:

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL connection details:

```bash
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/some_database"
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=some_database
PERFORM_DATABASE_MIGRATIONS=true
PERFORM_DATABASE_SEEDING=false
```

### 3. Run Database Migrations and Seed Data

```bash
# Apply database migrations
bun run db:migrate

# Load sample data (optional)
bun run seed
```

## Running the Application

### Development Mode

```bash
# Start development server with hot-reload
bun run dev
```

The application will automatically restart on file changes.

### Production Build

```bash
# Build for production
bun run build && bun run prod
```

This creates an optimized bundle ready for deployment.

## Docker

### Building the Docker Image

```bash
docker build -t k8s-app:latest .
```

### Running with Docker Compose (Recommended)

The `compose.yml` file defines two services:

- **db**: PostgreSQL database container using the `postgres:18.3-alpine3.23` image
- **app**: Your backend API container mapped to port 3000

```bash
# Start all services
docker-compose up -d

# Or just start the app service (requires external DB)
docker-compose up -d app
```

### Running with Docker (Manual)

```bash
# Run container manually
docker run -d \
  --name k8s-app-backend \
  -p 3000:3000 \
  -e DATABASE_URL=postgresql://postgres:your_password@db:5432/some_database \
  k8s-app:latest
```

## Environment Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgresPassword@localhost:5432/some_database` |
| `POSTGRES_USER` | Database username | `postgres` |
| `POSTGRES_PASSWORD` | Database password | `postgresPassword` |
| `POSTGRES_DB` | Database name | `some_database` |
| `PERFORM_DATABASE_MIGRATIONS` | Run migrations on startup | `true` |
| `PERFORM_DATABASE_SEEDING` | Seed sample data on startup | `true` |

## Project Structure

```
app/
├── src/
│   ├── config/           # Application configuration (environment, providers)
│   ├── infrastructure/   # Infrastructure layer implementations
│   │   └── db/           # Database schema and client setup
│   ├── modules/          # Business logic modules
│   │   └── posts/        # Posts module example
│   │       ├── domain/   # Entities, Value Objects (pure business logic)
│   │       ├── application/ # Use Cases (business rules)
│   │       └── infrastructure/ # DAOs and external integrations
│   └── shared/           # Shared types, mappers, utilities
├── drizzle/              # Database migrations
├── Dockerfile            # Container image configuration
├── compose.yml           # Docker Compose orchestration
└── README.md
```

## Useful Commands

### Database Operations

```bash
# Apply database migrations
bun run db:migrate

# Reset and recreate the database
bun run reset-db

# Load sample data for development
bun run seed
```

### Development

```bash
# Start development server with auto-reload
bun run dev

# Build production bundle
bun run build && bun run prod
```

## API Endpoints

The application provides RESTful endpoints for managing posts:

- `GET /api/posts` - List all posts (paginated)
- `GET /api/posts/:id` - Get a specific post by ID
- `POST /api/posts` - Create a new post

For detailed API documentation, refer to the route definitions in `src/modules/posts/api/`.

## Technology Stack

| Layer | Technology |
|-------|------------|
| Runtime | Bun |
| Language | TypeScript |
| Database | PostgreSQL 18.3 |
| ORM | Drizzle |
| Architecture | Clean Architecture |

## Publishing to GitHub Container Registry (GHCR)

When you push a tag in the format `v*` (e.g., `v1.0.0`), the CI workflow automatically:

- Logs into GitHub Container Registry
- Builds the Docker image from the `Dockerfile`
- Publishes the image with tags:
  - `latest` (default branch)
  - Semver tags (`v1.0.0`, `v1.0.1`, etc.)

The published image will be available at:
```
ghcr.io/<repo-owner>/k8s-app-backend:<tag>