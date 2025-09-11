# Mistral AI Internship Application

A full-stack web application built with Next.js frontend and Go backend, designed to showcase modern containerization and Kubernetes deployment practices.

## Project Structure

```
mistralai-internship/
├── backend/                    # Go backend service
│   ├── main.go                # Main application entry point
│   ├── go.mod                 # Go module dependencies
│   ├── go.sum                 # Go module checksums
│   ├── Dockerfile             # Backend container configuration
│   └── .env.example           # Environment variables template
├── frontend/                  # Next.js frontend application
│   ├── docker-compose.yml     # Local development with Docker
│   └── Dockerfile             # Frontend container configuration
├── chart/                     # Helm chart for Kubernetes deployment
│   ├── Chart.yaml             # Chart metadata
│   ├── values.yaml            # Default configuration values
│   └── templates/             # Kubernetes manifest templates
│       ├── backend/
│       │   ├── deployment.yaml
│       │   └── service.yaml
│       ├── frontend/
│       │   ├── deployment.yaml
│       │   └── service.yaml
│       ├── _helpers.tpl       # Template helpers
│       └── ingress.yaml       # Ingress configuration
└── README.md                  # This file
```

## Quick Start with Docker Compose

### Prerequisites
- Docker and Docker Compose installed
- Mistral API key

### 1. Clone and Setup
```bash
git clone https://github.com/kurama/mistralai-internship
cd mistralai-internship
```

### 2. Configure Environment
Create environment file for backend

```bash
cp backend/.env.example backend/.env
```

Edit backend/.env and add your MISTRAL_API_KEY

### 3. Run the Application
```bash
# Start both frontend and backend
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Health Check**: http://localhost:8080/health

### 5. Stop the Application
```bash
docker-compose down
```

## Kubernetes Deployment with Helm

### Prerequisites
- Kubernetes cluster (k3s, minikube, or cloud provider)
- Helm 3.x installed
- kubectl configured

### 1. Create Kubernetes Secret

```bash
# Create secret for Mistral API key
kubectl create secret generic mistral-secrets \
  --from-literal=api-key=your-mistral-api-key-here
```

### 2. Deploy with Helm

```bash
# Deploy to Kubernetes
helm install mistral-app ./chart
```

### 3. Port Forwarding for Local Access

```bash
kubectl port-forward svc/mistral-app-mistralai-internship-frontend 3000:3000 &
kubectl port-forward svc/mistral-app-mistralai-internship-backend 8080:8080 &
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Health Check**: http://localhost:8080/health

### 5. Cleanup

```bash
# Stop port forwarding
pkill -f "kubectl port-forward"

# Remove the deployment
helm uninstall mistral-app

# Remove the secret
kubectl delete secret mistral-secrets
```