# k8s-app Backend API

A simple RESTful API built with TypeScript and Bun. This application implements a clean architecture pattern with well-defined layers: domain, application, infrastructure, and API. The backend manages posts functionality and uses PostgreSQL for data persistence.

The application is designed to run locally (Docker Compose), as a container image, and on Kubernetes with optional [HashiCorp Vault](https://www.vaultproject.io/) integration for secrets management.

## Features

- **Clean Architecture**: Modular design separating concerns across domain entities, business logic (use cases), and infrastructure implementations
- **TypeScript**: Full type safety with modern TypeScript features
- **PostgreSQL Database**: Robust data persistence with Drizzle ORM and Atlas migrations
- **API Routes**: RESTful API endpoints for CRUD operations on posts
- **Database Seeding**: Pre-populated sample data for development
- **HashiCorp Vault**: Optional runtime configuration loaded from Vault via Kubernetes auth
- **Kubernetes-ready**: Container image published to GHCR; cluster deployment handled by a separate IaC repository

## Prerequisites

- [Bun](https://bun.sh/) runtime (v1.0+)
- Docker & Docker Compose (optional, for local database)
- [Atlas](https://atlasgo.io/) CLI (for local database migrations)

For Kubernetes deployment, see the companion repository [k8s-example-iac](https://github.com/MaciejWojs/k8s-example-iac).

## Quick Start with Docker Compose

The easiest way to run this application locally is using Docker Compose:

```bash
# Clone the repository and navigate to the app directory
cd app

# Build and start all services (PostgreSQL + API)
docker compose up -d

# Or just start the database for development
docker compose up -d db

# Apply database migrations
atlas migrate apply --env local --url "$DATABASE_URL"

# Load sample data (optional)
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

Edit `.env` with your settings:

```bash
USE_VAULT=false

DATABASE_URL="postgresql://postgres:your_password@localhost:5432/some_database"
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=some_database

DEVELOPMENT=true
PERFORM_DATABASE_MIGRATIONS=true
PERFORM_DATABASE_SEEDING=true
```

When `USE_VAULT=true`, the application authenticates to Vault at startup and loads configuration from a KV v2 secret path. See [Vault integration](#hashicorp-vault-integration) below.

### 3. Run Database Migrations and Seed Data

```bash
# Apply database migrations
atlas migrate apply --env local --url "$DATABASE_URL"

# Load sample data (optional, requires DEVELOPMENT=true)
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
bun run minify && bun run prod
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
docker compose up -d

# Or just start the app service (requires external DB)
docker compose up -d app
```

### Running with Docker (Manual)

```bash
# Run container manually
docker run -d \
  --name k8s-app-backend \
  -p 3000:3000 \
  -e USE_VAULT=false \
  -e DEVELOPMENT=false \
  -e PERFORM_DATABASE_MIGRATIONS=false \
  -e PERFORM_DATABASE_SEEDING=false \
  -e DATABASE_URL=postgresql://postgres:your_password@db:5432/some_database \
  k8s-app:latest
```

## Environment Variables

Configuration is validated at startup with Zod (`src/config/env.ts`). Boolean values accept `true`, `false`, `1`, or `0`.

### Bootstrap (always required)

| Variable | Description | Default (local) |
|----------|-------------|-----------------|
| `USE_VAULT` | Load application config from Vault instead of plain env vars | `false` |

### Application config (when `USE_VAULT=false`)

| Variable | Description | Default (`.env.example`) |
|----------|-------------|--------------------------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgresPassword@localhost:5432/some_database` |
| `DEVELOPMENT` | Enables development-only behaviour (e.g. seeding) | — |
| `PERFORM_DATABASE_MIGRATIONS` | Run migrations on application startup | `true` |
| `PERFORM_DATABASE_SEEDING` | Seed sample data on application startup | `true` |

`POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB` are used by Docker Compose for the database container only; the application reads `DATABASE_URL`.

### Vault connection (when `USE_VAULT=true`)

| Variable | Description | Example (Kubernetes) |
|----------|-------------|----------------------|
| `VAULT_ADDR` | Vault server URL | `http://k8s-example-vault.vault.svc.cluster.local:8200` |
| `VAULT_ROLE` | Kubernetes auth role configured in Vault | `myapp` |
| `VAULT_SECRET_PATH` | KV v2 secret path | `secret/data/myapp` |

When Vault is enabled, the app logs in with the pod's ServiceAccount JWT (`/var/run/secrets/kubernetes.io/serviceaccount/token`), reads the secret at `VAULT_SECRET_PATH`, and merges it with the process environment. Values from Vault override variables with the same name.

| Workload | `VAULT_ROLE` | `VAULT_SECRET_PATH` |
|----------|--------------|---------------------|
| Backend Deployment | `myapp` | `secret/data/myapp` |
| ArgoCD migrate Job | `migrate` | `secret/data/migrate` |
| ArgoCD seed Job | `seed` | `secret/data/seed` |

The secret in Vault should contain at least:

```json
{
  "DATABASE_URL": "postgresql://user:password@postgres-service:5432/example_database",
  "DEVELOPMENT": "true",
  "PERFORM_DATABASE_MIGRATIONS": "false",
  "PERFORM_DATABASE_SEEDING": "false"
}
```

## HashiCorp Vault Integration

Vault integration is implemented in `src/config/EnvProvider.ts` and `src/config/VaultProvider.ts`.

**Local development** — keep `USE_VAULT=false` and set variables in `.env`.

**Kubernetes** — the pod authenticates to Vault using the ServiceAccount JWT mounted at `/var/run/secrets/kubernetes.io/serviceaccount/token`. Vault must have Kubernetes auth configured with a role matching `VAULT_ROLE`. Connection settings (`USE_VAULT`, `VAULT_ADDR`, `VAULT_ROLE`, `VAULT_SECRET_PATH`) are typically provided as environment variables; sensitive values such as `DATABASE_URL` can be stored in Vault and loaded at startup.

Vault deployment and cluster configuration are managed in the [k8s-example-iac](https://github.com/MaciejWojs/k8s-example-iac) repository.

## Kubernetes Deployment

Kubernetes manifests, ArgoCD applications, PostgreSQL infrastructure, and Vault Helm configuration live in a separate repository:

**[github.com/MaciejWojs/k8s-example-iac](https://github.com/MaciejWojs/k8s-example-iac)**

That repository contains everything needed to deploy the full stack (frontend, backend, PostgreSQL, Ingress, ArgoCD, Vault) on a local Kind cluster or any Kubernetes environment. Follow its [README](https://github.com/MaciejWojs/k8s-example-iac#readme) for step-by-step instructions.

### Expected runtime behaviour on Kubernetes

When deployed via k8s-example-iac, the backend typically runs with:

- `USE_VAULT=true` — configuration loaded from Vault at startup
- `PERFORM_DATABASE_MIGRATIONS=false` and `PERFORM_DATABASE_SEEDING=false` — migrations (`atlas migrate apply` in a PreSync Job, with `DATABASE_URL` from Vault Agent Injector) and seeding (`bun seed`, Vault via `EnvProvider`) run before the Deployment is updated.
- Image from GHCR: `ghcr.io/maciejwojs/k8s-example-backend:<tag>`

The application itself does not ship Kubernetes manifests — only the container image and the environment contract documented above.

## Project Structure

```
app/
├── src/
│   ├── config/           # Environment validation, EnvProvider, VaultProvider
│   ├── infrastructure/   # Infrastructure layer implementations
│   │   └── db/           # Database schema and client setup
│   ├── modules/          # Business logic modules
│   │   └── posts/        # Posts module example
│   │       ├── domain/   # Entities, Value Objects (pure business logic)
│   │       ├── application/ # Use Cases (business rules)
│   │       └── infrastructure/ # DAOs and external integrations
│   └── shared/           # Shared types, mappers, utilities
├── atlas/                # Atlas SQL migrations
├── Dockerfile            # Container image configuration
├── compose.yml           # Docker Compose orchestration
└── README.md
```

## Useful Commands

### Database Operations

```bash
# Apply database migrations
atlas migrate apply --env local --url "$DATABASE_URL"

# Reset and recreate the database
bun run reset

# Load sample data for development
bun run seed
```

### Development

```bash
# Start development server with auto-reload
bun run dev

# Build production bundle
bun run minify && bun run prod
```

## API Endpoints

The application provides RESTful endpoints for managing posts:

- `GET /api/v1/posts` - List posts (supports `page` and `limit` query parameters)

For detailed API documentation, refer to the route definitions in `src/modules/posts/api/posts.routes.ts`.

## Technology Stack

| Layer | Technology |
|-------|------------|
| Runtime | Bun |
| Language | TypeScript |
| Database | PostgreSQL 18.3 |
| ORM | Drizzle |
| Migrations | Atlas |
| Secrets | HashiCorp Vault (optional) |
| Architecture | Clean Architecture |

## Publishing to GitHub Container Registry (GHCR)

When you push a tag in the format `v*` (e.g., `v1.0.0`), the CI workflow automatically:

- Logs into GitHub Container Registry
- Builds the Docker image from the `Dockerfile`
- Publishes the image with tags:
  - `latest` (default branch)
  - Semver tags (`v1.0.0`, `v1.0.1`, etc.)
- Opens a pull request in [k8s-example-iac](https://github.com/MaciejWojs/k8s-example-iac) to bump the backend image tag in Kubernetes manifests

The published image will be available at:

```
ghcr.io/<repo-owner>/k8s-example-backend:<tag>
```
