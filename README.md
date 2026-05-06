## Content

- [About BarThunder](#about-barthunder)
- [How to start](#how-to-start)
    - [Prerequisites](#prerequisites)
    - [Run application](#run-application)

## About BarThunder

## How to start

### Prerequisites
- Ensure that Docker engine alongside with Docker Desktop app are installed on your system;
- `docker compose` must be available.

### Run application

```bash
## Install dependencies
npm install --legacy-peer-deps
```

```bash
## Create .env file
cat <<EOF > .env
MEILI_MASTER_KEY=masterKey-make-it-long-for-security
MEILISEARCH_URL=http://localhost:8081
API_URL=http://localhost:8082

ROOT_EMAIL=bar-thunder-01@gmail.com
ROOT_PASSWORD=test123
NEXT_PUBLIC_ROOT_BAR_SLUG=bar-thunder-01
NEXT_PUBLIC_ROOT_NAME=bar-thunder-01
EOF
```

```bash
## Run docker
docker compose up
```

```bash
## Run frontend
npm run dev
```

