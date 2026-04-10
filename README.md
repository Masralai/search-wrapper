# SearchWrapper

A high-performance, full-stack search interface powered by the Google Search API (via SerpApi). Built with a modern, production-grade architecture focusing on type safety, scalability, and developer experience.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker)

## 🚀 Key Features

- **Modern Search UI**: Built with Next.js 15 and Shadcn UI (Radix UI + Tailwind) for a sleek, responsive experience.
- **Persistent History**: Automatically saves search queries and results to MongoDB for quick access.
- **Efficient Data Fetching**: Utilizes TanStack Query (React Query) for smart caching and loading states.
- **Type-Safe Backend**: Robust Express server written entirely in TypeScript with centralized error handling.
- **DevOps Optimized**: Multi-stage Docker builds using Next.js "standalone" mode for ultra-lightweight production images.
- **Security First**: Implements Helmet, Rate Limiting, and non-privileged Docker users.

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: TanStack Query (React Query)
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **Database**: MongoDB (via Mongoose)
- **API**: SerpApi (Google Search Engine)

### DevOps
- **Containerization**: Docker & Docker Compose
- **Optimization**: Multi-stage builds & Standalone output
- **Environment**: Dotenv management

---

## Getting Started

### Prerequisites
- [Docker](https://www.docker.com/) and Docker Compose
- A [SerpApi](https://serpapi.com/) API Key

### Quick Start (Docker - Recommended)

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd search-wrapper
   ```

2. **Set up Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   SERP_API_KEY=your_serp_api_key_here
   ```

3. **Launch the stack**:
   ```bash
   docker-compose up --build
   ```
   The application will be available at:
   - **Frontend**: `http://localhost:3000`
   - **Backend API**: `http://localhost:5000/api`
   - **MongoDB**: `mongodb://localhost:27017`

---

### Manual Development Setup

#### Backend
```bash
cd server
npm install
# Create .env with MONGO_URI, PORT, and SERP_API_KEY
npm run dev
```

#### Frontend
```bash
cd client
npm install
# Create .env.local with NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm run dev
```

---

## Project Structure

```text
search-wrapper/
├── client/                # Next.js 15 Frontend
│   ├── src/app/           # App Router pages & layouts
│   ├── src/components/    # Shadcn UI & custom components
│   ├── src/lib/           # API clients & utilities
│   └── Dockerfile         # Multi-stage standalone build
├── server/                # Express TypeScript Backend
│   ├── src/controllers/   # Business logic
│   ├── src/models/        # Mongoose schemas
│   ├── src/services/      # External API integrations
│   └── Dockerfile         # Multi-stage production build
└── docker-compose.yml     # Full stack orchestration
```

## Security & Best Practices
- **Non-privileged Users**: Docker containers run as `nextjs` or `node` users, not root.
- **Layer Caching**: Dockerfiles are optimized to leverage layer caching for faster builds.
- **Standalone Mode**: Next.js images only include files needed for production runtime.
- **Validation**: Centralized middleware for error handling and request processing.
