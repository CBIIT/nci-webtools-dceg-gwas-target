# nci-webtools-dceg-gwas-target

GWAS Target is a web application for gene-based and pathway analysis using MAGMA software, designed to identify target genes and pathways associated with GWAS results.

## CI/CD Process and Environment Mapping

### Project Structure

This application consists of three main components:
- **Frontend**: React-based client application (`client/`)
- **Backend**: Node.js/Express API server (`server/`)
- **Worker**: Background job processing for MAGMA analysis (`server/worker.js`)

### Environment Configuration

The application uses environment-specific configurations managed through `.env` files:

#### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Node environment | `production`, `development` |
| `APP_BASE_URL` | Base URL of the application | `https://example.com/gwas-target` |
| `APP_NAME` | Application name | `gwas-target` |
| `APP_PORT` | Backend server port | `9000` |
| `APP_TIER` | Deployment tier/environment | `dev`, `stage`, `prod` |
| `LOG_LEVEL` | Logging level | `debug`, `info`, `warn`, `error` |
| `DATA_FOLDER` | Root data directory path | `/path/to/data` |
| `INPUT_FOLDER` | User input files directory | `/path/to/data/input` |
| `OUTPUT_FOLDER` | Analysis results directory | `/path/to/data/output` |
| `EMAIL_ADMIN` | Admin email address | `admin@example.com` |
| `EMAIL_SMTP_HOST` | SMTP server hostname | `smtp.example.com` |
| `EMAIL_SMTP_PORT` | SMTP server port | `587` |
| `VPC_ID` | AWS VPC ID for worker tasks | `vpc-xxxxx` |
| `SUBNET_IDS` | Comma-separated subnet IDs | `subnet-xxx,subnet-yyy` |
| `SECURITY_GROUP_IDS` | Comma-separated security group IDs | `sg-xxx,sg-yyy` |
| `ECS_CLUSTER` | ECS cluster name for workers | `analysis-cluster` |
| `WORKER_TASK_NAME` | ECS task definition name | `gwas-target-worker` |
| `WORKER_TYPE` | Worker execution type | `ecs`, `local` |

#### Optional AWS Configuration

| Variable | Description |
|----------|-------------|
| `AWS_DEFAULT_REGION` | AWS region |
| `AWS_ACCESS_KEY_ID` | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |

### Deployment Architecture

#### Local Development
```bash
# Install dependencies
npm install
cd client && npm install
cd ../server && npm install

# Start development servers
cd client && npm start  # Frontend on port 3000
cd server && npm run start:dev  # Backend on port 9000
```

#### Docker Compose
```bash
# Build and run all services
docker-compose up --build

# Services:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:9000
```

The Docker setup includes:
- **Backend Service**: Node.js API server with mounted data volumes
- **Frontend Service**: React app served via HTTP server, proxied to backend

#### Production Deployment

The application is designed for deployment on AWS infrastructure:

1. **Frontend**: Built React static files served via web server (Apache/Nginx)
2. **Backend API**: Node.js application managed by PM2
3. **Worker Tasks**: ECS Fargate tasks for compute-intensive MAGMA analysis

### Environment Mapping

| Environment | APP_TIER | Purpose | Infrastructure |
|-------------|----------|---------|----------------|
| **Development** | `dev` | Local development and testing | Local or Docker Compose |
| **Staging** | `stage` | Pre-production testing | AWS ECS/Fargate |
| **Production** | `prod` | Live application | AWS ECS/Fargate with production data |

### Build Process

#### Frontend Build
```bash
cd client
npm run build  # Creates optimized production build in client/build/
```

#### Backend Build
No build step required (Node.js application)

#### Docker Images
```bash
# Build frontend image
docker build -f docker/frontend.dockerfile -t gwas-target-frontend .

# Build backend image
docker build -f docker/backend.dockerfile -t gwas-target-backend .
```

### Deployment Pipeline

Recommended CI/CD workflow:

1. **Code Commit** → Version control (Git)
2. **Continuous Integration**
   - Install dependencies
   - Run linters (`npm run lint`)
   - Run formatters (`npm run format`)
   - Run tests (`npm test`)
3. **Build Artifacts**
   - Build frontend React app
   - Create Docker images (if using containerized deployment)
4. **Deploy to Environment**
   - Update environment variables for target tier
   - Deploy backend API server
   - Deploy frontend static assets
   - Update ECS task definitions for worker tasks
5. **Smoke Testing**
   - Verify API endpoints
   - Test analysis job submission
   - Verify email notifications

### Worker Task Execution

The application uses AWS ECS for executing compute-intensive MAGMA analysis:

- **Local Mode** (`WORKER_TYPE=local`): Executes jobs on the same server
- **ECS Mode** (`WORKER_TYPE=ecs`): Launches ECS Fargate tasks for each analysis job

ECS task configuration requirements:
- Task definition must include MAGMA binaries and reference data
- Network configuration uses specified VPC, subnets, and security groups
- Tasks receive job parameters via environment variables

### Monitoring and Logging

- **Application Logs**: Winston logger with configurable log levels
- **API Monitoring**: Express middleware for request/response logging
- **Worker Jobs**: Job status tracked in SQLite database
- **Email Notifications**: Sent on job completion/failure to users

### Data Persistence

- **Input Files**: User-uploaded GWAS summary statistics
- **Output Files**: MAGMA analysis results (gene scores, pathway results)
- **Database**: SQLite database for job tracking and metadata
- **Data Retention**: Configurable per environment tier

### Security Considerations

- Environment variables should never be committed to version control
- Use `.env.example` as a template for required configurations
- AWS credentials should use IAM roles when possible
- SMTP credentials should be stored securely (AWS Secrets Manager, etc.)
- Input validation on all user uploads and API endpoints

### Scaling Considerations

- **API Server**: Horizontal scaling via load balancer
- **Worker Tasks**: Auto-scaling ECS tasks based on job queue depth
- **Data Storage**: Consider S3 for large-scale deployments
- **Database**: Migrate to RDS for multi-instance deployments