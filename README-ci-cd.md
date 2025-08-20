
# Travel Planner Backend CI/CD — Step-by-Step

> Copy this pack into your repo root. Ensure your project uses this layout:
>
> ```
> your-repo/
>   backend/              # Node/Express app
>   .github/
>     workflows/
>     actions/make-test-log/
>   docs/
> ```

## 1) Prerequisites

- **AWS** account in `ap-southeast-2` (Brisbane).  
- **ECR** repository for the backend image (e.g., `backend-api`).  
- **S3** bucket for persistent logs (e.g., `travelplanner-ci-logs-<acct>`).
- **App Runner** service that deploys from the ECR repository (auto-deploy on image update _recommended_).  
- In GitHub repo **Secrets and variables → Actions**, set:
  - `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
  - `AWS_REGION` = `ap-southeast-2`
  - `ECR_REPOSITORY` = your ECR repo name (e.g., `backend-api`)
  - `APP_RUNNER_SERVICE_ARN` = your App Runner service ARN (optional if auto-deploy on image update is ON)
  - `LOG_BUCKET` = your S3 bucket for logs

## 2) Testing Requirements

Inside `backend/package.json`, add a CI test script that emits machine-readable results and coverage:

```jsonc
{
  "scripts": {
    "test:ci": "jest --ci --reporters=default --json --outputFile=reports/jest-results.json --coverage --coverageReporters=json-summary"
  },
  "devDependencies": {
    "jest": "^29.7.0"
  }
}
```

If you already have Jest, ensure it outputs **`reports/jest-results.json`** and **`coverage/coverage-summary.json`** as above.

## 3) What the workflows do

### 3.1 CI - Backend (`.github/workflows/ci-backend.yml`)

- **Triggers**: `push` (main & develop), `pull_request` (to main), `schedule` (daily), and `workflow_dispatch` (manual).  
- **Services**: spins up a MongoDB 7 container for tests.  
- **Tests**: runs `npm run test:ci` to produce JSON results and coverage summary.  
- **Custom plugin**: uses the composite action **`.github/actions/make-test-log`** to build a human-readable `custom-test-log.txt`.  
- **Persistence**: uploads artifacts AND copies logs to **S3** for long-term storage.  
- **Failure handling**: log steps run even if tests fail; job fails at the end if tests failed.

### 3.2 CD - Backend (`.github/workflows/cd-backend.yml`)

- **Trigger**: `workflow_run` → fires automatically when **CI - Backend** completes **successfully** on the **main** branch.  
- **Builds** & **pushes** a Docker image to **ECR** (`latest` and commit-SHA tags).  
- **Preserves deployment revision**: stores a `deploy-metadata.json` record in S3 (timestamp, commit, image).  
- **Deploys**: triggers **App Runner** to deploy (if auto-deploy is off; otherwise App Runner redeploys on new image).

### 3.3 Tools - Export Workflow Files (`.github/workflows/tools-export-workflows.yml`)

- **Triggers**: manual and weekly schedule.  
- Zips `.github/workflows` and uploads as an artifact so you can **download the exact YAMLs** used in your repo.

## 4) Architecture Diagrams

### 4.1 CI/CD Flow

```mermaid
flowchart LR
  dev[Developer push/PR] --> CI[CI - Backend]
  schedule[Daily schedule] --> CI
  manual[Manual dispatch] --> CI

  subgraph CI Job
    A[Checkout] --> B[Mongo service]
    B --> C[Install & Test (jest --json --coverage)]
    C --> D[Composite Action: Make Custom Test Log]
    D --> E[Upload Artifacts]
    D --> F[S3: Persist Logs]
  end

  CI -->|success on main| CD[CD - Backend]
  CD --> G[Login ECR]
  G --> H[Build & Push Image]
  H --> I[S3: Save deploy metadata]
  I --> J[App Runner Deploy]
```

### 4.2 Runtime Architecture (Backend)

```mermaid
flowchart TB
  client[Frontend / API Client] --> apprunner[App Runner Service]
  apprunner --> ecr[ECR Image]
  apprunner --> atlas[MongoDB (Atlas or managed DB)]
```

## 5) Why these choices (and alternatives)

- **GitHub Actions** for CI/CD: native to GitHub, simple secrets, powerful runners.  
  - Alternatives: GitLab CI, CircleCI, Bitbucket Pipelines.  
- **App Runner** for deployment: managed build+run for containers, HTTPS out of the box, easy autoscaling.  
  - Alternatives: ECS Fargate (more control, more config), Elastic Beanstalk (PaaS), EC2 (full DIY).  
- **S3 for logs**: durable, cheap, browsable.  
  - Alternatives: GitHub Artifacts (90-day retention), CloudWatch Logs, third-party log stores.
- **Mongo service in CI**: reproduces DB-dependent tests reliably.  
  - Alternative: mock DB, in-memory adapters, or MongoDB Atlas Test cluster.

## 6) Next steps

1. Create an **ECR** repo (e.g., `backend-api`) and an **S3** bucket for logs.  
2. Set the **secrets** listed above.  
3. Ensure the backend has a **Dockerfile** (builds and listens on `$PORT`, default 8080).  
4. Create an **App Runner** service pointing at your ECR repo (enable auto-deploy on image update).  
5. Push to `develop` or open a PR → CI runs. Merge to `main` → CD runs.

> If you need a sample `Dockerfile` and `jest.config.cjs`, ping the assistant’s message—templates are available.
