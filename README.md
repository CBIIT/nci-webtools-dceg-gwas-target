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
| `APP_BASE_URL` | Base URL of the application | `https://example.com/gwas-target` |
| `APP_NAME` | Application name | `gwas-target` |
| `APP_PORT` | Backend server port | `9000` |
| `APP_TIER` | Deployment tier/environment | `dev`, `qa`, `stage`, `prod` |
| `LOG_LEVEL` | Logging level | `debug`, `info`, `warn`, `error` |
| `DATA_FOLDER` | Root data directory path | `/data` |
| `INPUT_FOLDER` | User input files directory | `/data/input` |
| `OUTPUT_FOLDER` | Analysis results directory | `/data/output` |
| `EMAIL_ADMIN` | Admin email address | `admin@example.com` |
| `EMAIL_SMTP_HOST` | SMTP server hostname | `smtp.example.com` |
| `EMAIL_SMTP_PORT` | SMTP server port | `587` |
| `VPC_ID` | AWS VPC ID for worker tasks | `vpc-xxxxx` |
| `SUBNET_IDS` | Comma-separated subnet IDs | `subnet-xxx,subnet-yyy` |
| `SECURITY_GROUP_IDS` | Comma-separated security group IDs | `sg-xxx,sg-yyy` |
| `ECS_CLUSTER` | ECS cluster name for workers | `analysis-cluster` |
| `WORKER_TASK_NAME` | ECS task definition name | `gwas-target-worker` |
| `WORKER_TYPE` | Worker execution type | `fargate`, `local` |

#### Optional Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Node environment | `production` |
| `SERVER_TIMEOUT` | Server timeout in milliseconds | `900000` (15 min) |
| `EMAIL_SMTP_USER` | SMTP authentication username | (no auth) |
| `EMAIL_SMTP_PASSWORD` | SMTP authentication password | (no auth) |
| `AWS_DEFAULT_REGION` | AWS region | `us-east-1` |
| `AWS_ACCESS_KEY_ID` | AWS access key (use IAM roles in production) | (none) |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key (use IAM roles in production) | (none) |

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
- **Frontend Service**: React app built and served via Apache HTTP Server (httpd)

#### Production Deployment

The application is deployed on AWS ECS/Fargate:

1. **Frontend Container**: React app built and served via Apache HTTP Server (httpd) on port 80
2. **Backend Container**: Node.js Express API managed by PM2, running in cluster mode
3. **Worker Tasks**: On-demand ECS Fargate tasks for compute-intensive MAGMA analysis
4. **Storage**: Amazon EFS for persistent data storage (input/output files)
5. **Logging**: Datadog via AWS FireLens for centralized logging

### Environment Mapping

| Environment | APP_TIER | Purpose | Infrastructure |
|-------------|----------|---------|----------------|
| **Development** | `dev` | Development and initial testing | AWS ECS/Fargate |
| **QA** | `qa` | Quality assurance and integration testing | AWS ECS/Fargate |
| **Staging** | `stage` | Pre-production validation | AWS ECS/Fargate |
| **Production** | `prod` | Live production environment | AWS ECS/Fargate |

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

The project uses GitHub Actions for automated deployment (`.github/workflows/deploy.yml`):

1. **Trigger** → Workflow dispatch with tier selection (dev, qa, stage, prod)
2. **Environment Setup**
   - Configure AWS credentials via OIDC
   - Set environment variables based on deployment tier
   - Retrieve secrets from AWS Systems Manager Parameter Store
3. **Build Docker Images**
   - Build frontend image with React app bundled in httpd container
   - Build backend image with Node.js application and dependencies
   - Tag images with git tag and timestamp
   - Push to Amazon ECR with inline cache
4. **Deploy to ECS**
   - Render ECS task definitions from templates (web and worker)
   - Register new task definitions
   - Update ECS service to trigger deployment
5. **Cleanup**
   - Deregister old task definitions (keep last 3 revisions)

### Worker Task Execution

The application supports two worker execution modes:

- **Local Mode** (`WORKER_TYPE=local`): Executes MAGMA jobs directly on the backend server
- **Fargate Mode** (`WORKER_TYPE=fargate`): Launches on-demand ECS Fargate tasks for each analysis job

#### Fargate Worker Configuration

When `WORKER_TYPE=fargate`, each analysis job triggers a new ECS task:

1. Backend receives job submission and writes `params.json` to EFS input folder
2. Backend invokes ECS RunTask API with job ID as command argument
3. Worker task starts, reads `params.json` from input folder via job ID
4. Worker executes MAGMA analysis and writes results to EFS output folder
5. Worker updates `status.json` and sends email notification on completion
6. Worker task terminates automatically

Worker task requirements:
- MAGMA binaries for the platform (`server/bin/linux/magma`)
- Reference data files mounted via EFS
- Network access via specified VPC, subnets, and security groups
- Same environment variables as backend for AWS/EFS access

### Monitoring and Logging

- **Application Logs**: Winston logger with configurable log levels
- **API Monitoring**: Express middleware for request/response logging
- **Worker Jobs**: Job status tracked in JSON files (status.json)
- **Email Notifications**: Sent on job completion/failure to users

### Data Persistence

- **Input Files**: User-uploaded GWAS summary statistics stored in EFS
- **Output Files**: MAGMA analysis results (gene scores, pathway results) stored in EFS
- **Job Status**: JSON files storing job state and metadata
- **Query Results**: SQLite databases for efficient querying of MAGMA output
- **Gene Mappings**: SQLite database for Ensembl ID to gene symbol lookups

### Security Considerations

- **Secrets Management**: All sensitive configuration stored in AWS Systems Manager Parameter Store
- **AWS Authentication**: Uses OIDC-based GitHub Actions role assumption (no long-lived credentials)
- **IAM Roles**: ECS tasks use IAM roles for AWS service access (no embedded credentials)
- **SMTP Authentication**: Optional - configure `EMAIL_SMTP_USER` and `EMAIL_SMTP_PASSWORD` only if required
- **Environment Variables**: Never commit `.env` files to version control; use `.env.example` as template
- **Input Validation**: All user uploads validated using express-validator
- **Network Security**: ECS tasks run in private subnets with security group restrictions