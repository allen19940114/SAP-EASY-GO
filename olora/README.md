# OLORA - SAP AI Agent

> Enterprise AI Assistant for SAP Business Operations

OLORA is an intelligent business assistant that helps enterprise users complete SAP operations through natural language conversations. It combines knowledge base management (RAG), unified action execution engine, data security gateway, and intelligent analysis capabilities.

## Features

- **AI Dialogue & Knowledge Base (RAG)** - Natural language interaction, intent recognition, knowledge base management, anti-hallucination mechanism
- **Action Execution Engine** - Unified `action_id + payload` execution route, permission validation, audit trail
- **Report Templates & BI** - Template reports, BI dashboards, visualization summaries, data traceability
- **Interface Management** - Subscription authorization, field rules, extension fields, interface version management
- **Data Security Gateway** - PII detection, data sanitization/restoration, sensitive data never leaves the premises

## Architecture

OLORA adopts a five-layer architecture:

```
① Interaction Layer (Next.js) - Chat UI, Knowledge Management, Interface Management
                ↓
② Intelligence Layer (NestJS) - Intent Recognition, Planning, Reasoning, Data Security Gateway
                ↓
③ Capability Layer - SAP Adapter, Document Service, Email, RPA, BI
                ↓
④ Governance Layer - Permission Management, Risk Control, Approval Process, Audit Log
                ↓
⑤ System of Record - SAP S/4HANA, PostgreSQL, Redis, Qdrant
```

## Tech Stack

### Backend
- **Framework**: NestJS 10 + TypeScript 5
- **Database**: PostgreSQL (Prisma ORM)
- **Cache**: Redis
- **Vector DB**: Qdrant (RAG)
- **LLM**: OpenAI GPT-4 / DeepSeek / Google Gemini (支持动态切换)

### Frontend
- **Framework**: Next.js 14 + React 18
- **UI Library**: Ant Design 5
- **State Management**: Zustand
- **Real-time**: Socket.IO

## Quick Start

### Prerequisites

- Node.js >= 18
- Docker & Docker Compose
- PostgreSQL 15
- Redis 7
- (Optional) Qdrant vector database

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd olora
```

2. **Install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env and fill in your configuration
```

4. **Start infrastructure services**
```bash
docker-compose up -d
```

5. **Run database migrations**
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

6. **Start development servers**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

7. **Access the application**
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- API Docs: http://localhost:3000/api/docs
- Qdrant Dashboard: http://localhost:6333/dashboard

## Project Structure

```
olora/
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # Authentication
│   │   │   ├── user/          # User Management
│   │   │   ├── chat/          # Chat Management
│   │   │   ├── rag/           # RAG Knowledge Base
│   │   │   ├── action/        # Action Execution Engine
│   │   │   ├── security/      # Data Security Gateway
│   │   │   ├── sap/           # SAP Integration
│   │   │   ├── template/      # Report Templates
│   │   │   ├── interface/     # Interface Management
│   │   │   └── audit/         # Audit Log
│   │   ├── common/            # Shared utilities
│   │   └── config/            # Configuration
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   └── package.json
│
├── frontend/                   # Next.js Frontend
│   ├── app/
│   │   ├── page.tsx           # Chat Interface (Main Entry)
│   │   ├── knowledge/         # Knowledge Base Management
│   │   ├── interface/         # Interface Management
│   │   ├── templates/         # Report Templates
│   │   └── settings/          # Settings
│   ├── components/
│   ├── services/              # API clients
│   └── package.json
│
├── docker-compose.yml          # Docker services
├── .env.example                # Environment template
└── README.md
```

## Core Workflows

### Scenario 1: Generate Monthly Report from Template

**User Input**: "Generate the monthly operating report for January 2026, company code 1000, profit center A01."

**Execution Flow**:
1. Intent recognition: `REPORT_TEMPLATE_RUN`
2. Parameter extraction: template_id, period, company_code, profit_center
3. Knowledge base query: Get template caliber documentation
4. Generate Action: `action_id: RPT_TEMPLATE_RUN`
5. Call ABAP Function: `Z_OLORA_EXECUTE_ACTION`
6. Data fetching: Revenue/Cost/Expense/Inventory
7. Fill template: Excel/CSV
8. Return result: File + Key metrics + Data traceability
9. Audit log

### Scenario 2: Conversational Analysis

**User Input**: "Why did gross profit decline this month? Let's look at division A."

**Execution Flow**:
1. Intent recognition: `ANALYSIS_RUN`
2. Clarify dimensions: Period, division, gross profit caliber
3. Knowledge base query: Gross profit calculation formula
4. Generate Action group: GM bridge analysis, revenue by segment, COGS by segment, purchase price trend
5. Call ABAP Function (batch)
6. Attribution analysis: TOP contributing factors
7. Warning judgment: Threshold triggered
8. Return result: Conclusion + Evidence + Recommendations
9. Audit log

### Scenario 3: Data Change Operation

**User Input**: "Extend the start/end dates of WBS 1.2 in project P-1001 by two weeks."

**Execution Flow**:
1. Intent recognition: `DATA_CHANGE` (WBS)
2. Generate change draft: Fields, old values, new values, impact scope, risk warnings
3. User confirmation: Display change card
4. Permission check: SAP authorization check
5. Generate Action: `action_id: PS_WBS_CHANGE`
6. Call ABAP Function: Internal call `BAPI_BUS2054_CHANGE_MULTI`
7. Return result: Success/Failure + Message
8. Audit log

## Security & Compliance

### Data Classification

- **L1 (Public)**: Operation types, general terms → Can be sent to cloud LLM
- **L2 (Internal)**: Project names, department names → Sanitized before sending
- **L3 (Confidential)**: Contract amounts, customer names → Processed locally only
- **L4 (Secret)**: Passwords, API keys → Encrypted storage, no processing

### Data Sanitization Flow

```
User Input → PII Detection → Replace with placeholders → Store mapping (Redis) → Send to cloud LLM
                                                                                         ↓
                                              Return real data ← Restore from mapping ← LLM Response
```

## Development

### Run Tests
```bash
# Backend unit tests
cd backend
npm test

# Backend E2E tests
npm run test:e2e

# Frontend tests
cd frontend
npm test
```

### Database Management
```bash
# Create new migration
npx prisma migrate dev --name your_migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# View database in Prisma Studio
npx prisma studio
```

### Code Quality
```bash
# Linting
npm run lint

# Format code
npm run format

# Type checking
npm run type-check
```

## Deployment

### Production Build
```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
npm run start
```

### Docker Deployment
```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start all services
docker-compose -f docker-compose.prod.yml up -d
```

## API Documentation

Once the backend is running, access the Swagger API documentation at:
- http://localhost:3000/api/docs

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please contact:
- Email: support@olora.com
- Documentation: https://docs.olora.com
- Issue Tracker: https://github.com/your-org/olora/issues

## Roadmap

See [OLORA_ARCHITECTURE.md](OLORA_ARCHITECTURE.md) for detailed architecture documentation and development roadmap.
