# Mistral AI Internship Project

A chatbot application powered by Mistral AI with user authentication and rate limiting capabilities.

## Live Demo

- **Frontend**: [https://mistral.grasset.dev](https://mistral.grasset.dev)
- **API**: [https://api.mistral.grasset.dev](https://api.mistral.grasset.dev)

The production deployment runs on a Kubernetes cluster hosted on a VPS and is managed using [Argo CD](https://argo-cd.readthedocs.io/). Argo CD enables GitOps-based continuous delivery, automatically synchronizing the cluster state with the configuration defined in the repository. This ensures that deployments are reproducible and easy to manage.

## Architecture

```
mistralai-internship/
├── .github/           # GitHub Actions workflows
│   └── workflows/
│       ├── backend.yml
│       └── frontend.yml
├── frontend/          # Next.js React application
├── backend/           # Go API server
├── postgres/          # PostgreSQL initialization scripts
├── chart/             # Helm chart for Kubernetes deployment
└── docker-compose.yml # Local development setup
```

## Local Development

### Prerequisites

- Docker and Docker Compose
- Git
- OpenSSL (for generating secrets)

### 1. Clone the Repository

```bash
git clone https://github.com/kurama/mistralai-internship
cd mistralai-internship
```

### 2. Environment Configuration

Create `.env` files in each directory using the examples provided:

#### Frontend Configuration (`frontend/.env`)

```bash
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env` with your values:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_ENVIRONMENT=development
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://postgresuser:postgrespassword@mistral-postgres:5432/mistralai?schema=public
```

#### Backend Configuration (`backend/.env`)

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your values:

```env
MISTRAL_API_KEY=your_mistral_api_key_here
DATABASE_URL=postgresql://postgresuser:postgrespassword@mistral-postgres:5432/mistralai?sslmode=disable
```

#### PostgreSQL Configuration (`postgres/.env`)

```bash
cp postgres/.env.example postgres/.env
```

You can keep the default values or customize them:

```env
POSTGRES_USER=postgresuser
POSTGRES_PASSWORD=postgrespassword
POSTGRES_DB=mistralai
```

⚠️ **Important**: Make sure the database credentials match across all `.env` files.

### 3. Generate Required Secrets

#### NextAuth Secret

Generate a secure secret for NextAuth:

```bash
openssl rand -base64 32
```

Copy the output and paste it as `NEXTAUTH_SECRET` in `frontend/.env`.

#### GitHub OAuth Application

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - **Application name**: Mistral AI Chatbot (Local)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Copy the **Client ID** to `GITHUB_CLIENT_ID` in `frontend/.env`
6. Generate a new client secret and copy it to `GITHUB_CLIENT_SECRET` in `frontend/.env`

#### Mistral API Key

1. Go to [Mistral AI Console](https://console.mistral.ai/)
2. Sign up or log in to your account
3. Navigate to "API Keys" section
4. Create a new API key
5. Copy the key and paste it as `MISTRAL_API_KEY` in `backend/.env`

### 4. Launch the Application

Start all services with Docker Compose:

```bash
docker-compose up -d
```

The application will be available at:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8080](http://localhost:8080)
- Database: `localhost:5432`

### 5. Verify Installation

Check if all services are running:

```bash
docker-compose ps
```

Test the API health endpoint:

```bash
curl http://localhost:8080/health
```

## Kubernetes Deployment (chart/)

The `chart/` directory contains a Helm chart for deploying the application to a Kubernetes cluster. To deploy using the Helm chart:

```bash
helm install mistral-app ./chart
```

Be sure to configure the necessary values in `chart/values.yaml` before deployment.

## GitHub Actions

The project includes automated CI/CD pipelines using GitHub Actions:

### Frontend Workflow ([`.github/workflows/frontend.yml`](.github/workflows/frontend.yml))

- **Triggers**: Push to main branch and pull requests affecting frontend code
- **Process**:
  - Builds the Next.js application
  - Creates Docker image
  - Pushes to Docker Hub: [`rapidement/mistralai-internship-frontend`](https://hub.docker.com/repository/docker/rapidement/mistralai-internship-frontend/general)

### Backend Workflow ([`.github/workflows/backend.yml`](.github/workflows/backend.yml))

- **Triggers**: Push to main branch and pull requests affecting backend code
- **Process**:
  - Builds the Go application
  - Creates Docker image
  - Pushes to Docker Hub: [`rapidement/mistralai-internship-backend`](https://hub.docker.com/repository/docker/rapidement/mistralai-internship-backend/general)

The images are then used by Argo CD to automatically deploy updates to the Kubernetes cluster when new versions are pushed to the repositories.
