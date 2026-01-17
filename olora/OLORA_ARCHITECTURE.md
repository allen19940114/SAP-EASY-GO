# OLORA Architecture Documentation

> Enterprise SAP AI Agent System Architecture

**Last Updated**: 2026-01-17
**Version**: 1.0.0

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Layers](#architecture-layers)
3. [Core Components](#core-components)
4. [Data Security Architecture](#data-security-architecture)
5. [RAG Knowledge Base](#rag-knowledge-base)
6. [Action Execution Engine](#action-execution-engine)
7. [Interface Management](#interface-management)
8. [Database Design](#database-design)
9. [API Design](#api-design)
10. [Deployment Architecture](#deployment-architecture)
11. [Performance & Scalability](#performance--scalability)
12. [Security & Compliance](#security--compliance)

---

## System Overview

OLORA (Operational Intelligence & Reporting Assistant) is an enterprise-grade AI agent system that enables users to interact with SAP systems through natural language. The system combines:

- **Natural Language Processing** - Intent recognition, parameter extraction, multi-turn dialogue
- **Knowledge Base (RAG)** - Document processing, vectorization, semantic search
- **Unified Action Execution** - Single execution route for all SAP operations
- **Data Security Gateway** - PII detection, sanitization, restoration
- **Audit & Governance** - Permission checks, audit logs, compliance tracking

### Key Capabilities

| Capability | Description |
|-----------|-------------|
| **AI Dialogue** | Natural language interaction with SAP systems |
| **Knowledge Management** | RAG-based document processing and retrieval |
| **Action Execution** | Unified execution engine for SAP operations |
| **Report Generation** | Template-based report generation and BI dashboards |
| **Interface Management** | Enterprise-level subscription and field rule management |
| **Data Security** | PII detection, sanitization, and restoration |
| **Audit Trail** | Complete audit log of all operations |

---

## Architecture Layers

OLORA adopts a five-layer architecture pattern:

```
┌─────────────────────────────────────────────────────────────────┐
│              ① Interaction Layer (Frontend)                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ Chat UI  │ │Knowledge │ │Interface │ │Templates │           │
│  │          │ │  Manager │ │  Manager │ │ Manager  │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
│  Next.js 14 + React 18 + Ant Design 5                           │
└───────────────────────────▲─────────────────────────────────────┘
                            │ REST API / WebSocket
┌───────────────────────────┴─────────────────────────────────────┐
│            ② Intelligence Layer (NestJS Backend)                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │             Agent Orchestrator                            │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │   │
│  │  │ Intent  │ │Planning │ │Reasoning│ │Reflection│        │   │
│  │  │ Parser  │ │ Engine  │ │ Engine  │ │ Engine   │        │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │        🔒 Data Security Gateway                          │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │    │
│  │  │ PII Detector │  │  Sanitizer   │  │   Restorer   │  │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │    │
│  └─────────────────────────────────────────────────────────┘    │
│         │                              │                         │
│  ┌──────┴──────┐              ┌────────┴────────┐               │
│  │  Cloud LLM  │              │ Local Processing│               │
│  │ (Sanitized) │              │   (Sensitive)   │               │
│  └─────────────┘              └─────────────────┘               │
└───────────────────────────▲─────────────────────────────────────┘
                            │
┌───────────────────────────┴─────────────────────────────────────┐
│              ③ Capability Layer (Services)                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │   SAP    │ │ Document │ │   Email  │ │    BI    │           │
│  │ Adapter  │ │ Service  │ │ Service  │ │ Service  │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
│  NestJS Services + TypeScript                                   │
└───────────────────────────▲─────────────────────────────────────┘
                            │
┌───────────────────────────┴─────────────────────────────────────┐
│            ④ Governance Layer (Control & Audit)                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │Permission│ │   Risk   │ │ Approval │ │  Audit   │           │
│  │ Manager  │ │ Control  │ │ Workflow │ │   Log    │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
└───────────────────────────▲─────────────────────────────────────┘
                            │
┌───────────────────────────┴─────────────────────────────────────┐
│           ⑤ System of Record (Data Layer)                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │   SAP    │ │PostgreSQL│ │  Redis   │ │  Qdrant  │           │
│  │ S/4HANA  │ │   (DB)   │ │  (Cache) │ │ (Vector) │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. Intent Recognition Service

**Purpose**: Parse user input to identify intent and extract parameters.

**Key Functions**:
- Intent classification (Report, Analysis, Change, Query, Knowledge Search)
- Parameter extraction (Slot filling)
- Multi-turn dialogue context management
- Clarification and correction support

**Intent Types**:
```typescript
enum IntentType {
  REPORT_TEMPLATE_RUN = 'REPORT_TEMPLATE_RUN',
  ANALYSIS_RUN = 'ANALYSIS_RUN',
  DATA_CHANGE = 'DATA_CHANGE',
  DATA_QUERY = 'DATA_QUERY',
  KNOWLEDGE_SEARCH = 'KNOWLEDGE_SEARCH'
}
```

### 2. Knowledge Base (RAG) Service

**Purpose**: Manage enterprise knowledge documents and provide semantic search.

**Components**:
- **Document Service**: Upload, parse, and process documents (PDF, Word, Excel, Markdown)
- **Vectorization Service**: Chunk documents and generate embeddings (OpenAI text-embedding-3-large)
- **Vector Store Service**: Store and index embeddings in Qdrant
- **Retrieval Service**: Semantic search, re-ranking, citation tracking

**Workflow**:
```
Document Upload → Parse → Chunk (1024 tokens) → Embed → Store in Qdrant
                                                              ↓
User Query → Embed query → Similarity Search → Re-rank → Return top-K + citations
```

### 3. Action Execution Engine

**Purpose**: Unified execution route for all SAP operations.

**Core Principle**: All actions follow the `action_id + payload` pattern and call a single ABAP Function (`Z_OLORA_EXECUTE_ACTION`).

**Action Definition**:
```typescript
interface Action {
  id: string;                    // e.g., "RPT_TEMPLATE_RUN"
  name: string;                  // Display name
  category: string;              // report | analysis | change | query
  description: string;
  requiredFields: string[];      // Required parameters
  optionalFields: string[];      // Optional parameters
  sapFunction: string;           // ABAP Function name
  permissions: string[];         // Required SAP permissions
}
```

**Execution Flow**:
```
1. Intent → Action ID
2. Knowledge Base → Parameter Completion
3. Permission Check → SAP Authorization
4. Execute → Call ABAP Function (Z_OLORA_EXECUTE_ACTION)
5. Parse Result → Return structured response
6. Audit Log → Record operation
```

### 4. Data Security Gateway

**Purpose**: Ensure sensitive data never leaves the premises.

**Components**:
- **PII Detector**: Entity recognition (NER), regex patterns, context analysis
- **Sanitizer**: Replace sensitive data with placeholders
- **Restorer**: Restore placeholders to real values from mapping table (Redis)

**Data Classification**:
| Level | Examples | Handling |
|-------|---------|----------|
| L1 (Public) | Operation types, general terms | Can be sent to cloud LLM |
| L2 (Internal) | Project names, department names | Sanitized before sending |
| L3 (Confidential) | Contract amounts, customer names | Processed locally only |
| L4 (Secret) | Passwords, API keys | Encrypted storage, no processing |

**Sanitization Flow**:
```
Input: "Create a Huawei 5G project, contract amount 5 million"
          ↓
PII Detection: Identify "Huawei" (company), "5 million" (amount)
          ↓
Sanitization: Replace with placeholders
  → "Create a [CLIENT_001] project, contract amount [AMOUNT_001]"
          ↓
Mapping Storage (Redis):
  {
    sessionId: "abc123",
    mappings: {
      "[CLIENT_001]": "Huawei",
      "[AMOUNT_001]": "5000000"
    },
    expireAt: <timestamp + 1 hour>
  }
          ↓
Send to Cloud LLM: Sanitized text
          ↓
LLM Response: "Create project, client=[CLIENT_001], budget=[AMOUNT_001]"
          ↓
Restoration: Replace placeholders with real values
  → Call SAP BAPI to create project (Huawei 5G, 5000000)
```

---

## RAG Knowledge Base

### Document Processing Pipeline

```
┌─────────────┐
│   Upload    │ PDF, Word, Excel, Markdown
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Parse    │ Extract text content
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Chunk    │ Split into chunks (1024 tokens, 200 overlap)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Embed     │ OpenAI text-embedding-3-large (3072 dim)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Store     │ Qdrant vector database
└─────────────┘
```

### Retrieval Process

```
┌─────────────┐
│ User Query  │ "What is the WBS structure for 5G projects?"
└──────┬──────┘
       │
       ▼
┌─────────────┐
│Embed Query  │ Convert to vector (3072 dim)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Search    │ Similarity search in Qdrant (top-K = 5)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Re-rank    │ Re-score chunks by relevance
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Return    │ Chunks + Citations + Confidence scores
└─────────────┘
```

### Anti-Hallucination Mechanism

1. **Citation Tracking**: Every generated statement must reference a source document
2. **Confidence Scoring**: Assign confidence scores (0.0-1.0) to each retrieved chunk
3. **Source Attribution**: Display document name, page number, and timestamp
4. **Contradiction Detection**: Cross-check responses against knowledge base
5. **Fallback**: If confidence < threshold, ask user for clarification instead of guessing

---

## Action Execution Engine

### Action Lifecycle

```
┌─────────────┐
│   Intent    │ User: "Generate monthly report for Jan 2026"
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Mapping   │ Intent → Action ID (REPORT_TEMPLATE_RUN)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Parameter  │ Extract: template_id, period, company_code
│ Extraction  │ Fill missing params via dialogue or knowledge base
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Permission  │ Check SAP authorization (user → SAP account)
│   Check     │ Return missing permissions if any
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Payload    │ Build ActionPayload { action_id, session_id, parameters }
│Construction │ Include extension fields if defined
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Execute   │ Call ABAP Function (Z_OLORA_EXECUTE_ACTION)
│             │ Pass payload as JSON
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Parse     │ Parse response (status, data, messages)
│  Response   │ Handle success/failure
└──────┬──────┘
       │
       ▼
┌─────────────┐
│Audit & Log  │ Record: user, timestamp, action, parameters, result
└─────────────┘
```

### Example Actions

| Action ID | Category | Description | SAP Function |
|-----------|---------|-------------|--------------|
| `RPT_TEMPLATE_RUN` | Report | Generate report from template | `Z_OLORA_RPT_EXECUTE` |
| `ANL_GM_BRIDGE` | Analysis | Gross margin bridge analysis | `Z_OLORA_ANL_GM` |
| `PS_WBS_CHANGE` | Change | Update WBS element | `Z_OLORA_PS_WBS_CHANGE` |
| `PS_PROJECT_QUERY` | Query | Query project details | `Z_OLORA_PS_QUERY` |
| `KN_SEARCH` | Knowledge | Search knowledge base | N/A (Local) |

---

## Interface Management

### Tenant-based Subscription Model

**Purpose**: Control which actions each enterprise tenant can access.

```
┌──────────┐      ┌─────────────────┐      ┌──────────┐
│ Tenant A │─────>│ Subscription    │─────>│ Action 1 │
│ (Basic)  │      │ - Action 1      │      │ Action 2 │
└──────────┘      │ - Action 2      │      │ Action 3 │
                  └─────────────────┘      └──────────┘
┌──────────┐      ┌─────────────────┐
│ Tenant B │─────>│ Subscription    │
│ (Pro)    │      │ - Action 1      │
└──────────┘      │ - Action 2      │
                  │ - Action 3      │
                  │ - Action 4      │
                  └─────────────────┘
```

### Field-level Rules

**Purpose**: Customize field behavior per tenant.

```typescript
interface FieldRule {
  tenantId: string;
  actionId: string;
  fieldName: string;
  isRequired: boolean;      // Override default required status
  isReadOnly: boolean;      // Make field read-only
  isHidden: boolean;        // Hide field from UI
  defaultValue?: string;    // Auto-fill default value
  validation?: {            // Custom validation rules
    type: 'regex' | 'enum' | 'range' | 'dependency';
    rule: string | string[] | number[];
  };
}
```

### Extension Fields

**Purpose**: Allow tenants to define up to 20 custom fields per action.

```typescript
interface ExtensionField {
  tenantId: string;
  actionId: string;
  fieldName: string;        // e.g., "custom_field_1"
  fieldType: 'text' | 'number' | 'date' | 'enum';
  description?: string;
  isRequired: boolean;
  validation?: Json;
  displayOrder: number;
}
```

**Usage**:
- Extension fields are included in the action payload
- ABAP Function receives extension fields in a separate parameter
- Backend can store extension fields in custom tables or pass to custom logic

---

## Database Design

### Core Tables

**Users & Authentication**:
- `users` - User accounts
- `user_sap_bindings` - SAP account bindings

**Chat & Knowledge**:
- `chat_sessions` - Conversation sessions
- `messages` - Message history
- `knowledge_documents` - Uploaded documents
- `knowledge_chunks` - Document chunks (vectorized)

**Action Execution**:
- `actions` - Action definitions
- `action_executions` - Execution records
- `action_templates` - Action templates

**Interface Management**:
- `tenants` - Enterprise tenants
- `interface_subscriptions` - Tenant subscriptions to actions
- `interface_field_rules` - Field-level rules per tenant
- `extension_fields` - Custom fields per tenant

**Reports**:
- `report_templates` - Report template definitions
- `report_executions` - Report generation records

**Audit & Security**:
- `audit_logs` - Operation audit trail
- `sensitive_data_mappings` - PII mapping table (backup, primary in Redis)

### ER Diagram (Simplified)

```
┌───────────┐      ┌─────────────────┐      ┌──────────────┐
│   User    │─────<│ UserSapBinding  │>─────│  ChatSession │
└───────────┘      └─────────────────┘      └──────┬───────┘
                                                    │
                                                    │ 1:N
                                                    ▼
                                             ┌─────────────┐
                                             │   Message   │
                                             └─────────────┘
┌───────────┐      ┌─────────────────┐
│  Tenant   │─────<│InterfaceSubscrip│
└───────────┘      └─────────────────┘

┌───────────┐      ┌─────────────────┐
│  Action   │─────<│ActionExecution  │
└───────────┘      └─────────────────┘
```

---

## API Design

### Authentication Endpoints

```
POST   /api/auth/register       # Register new user
POST   /api/auth/login          # Login (returns JWT)
POST   /api/auth/refresh        # Refresh access token
POST   /api/auth/logout         # Logout
```

### User Endpoints

```
GET    /api/users/me            # Get current user
PUT    /api/users/me            # Update current user
POST   /api/users/sap-binding   # Bind SAP account
DELETE /api/users/sap-binding   # Unbind SAP account
GET    /api/users/sap-binding   # Get SAP binding status
```

### Chat Endpoints

```
POST   /api/chat/sessions                  # Create new chat session
GET    /api/chat/sessions                  # List all sessions
GET    /api/chat/sessions/:id              # Get session details
DELETE /api/chat/sessions/:id              # Delete session
POST   /api/chat/sessions/:id/messages     # Send message
WS     /api/chat/ws                         # WebSocket connection
```

### Knowledge Base Endpoints

```
POST   /api/knowledge/documents             # Upload document
GET    /api/knowledge/documents             # List documents
GET    /api/knowledge/documents/:id         # Get document details
DELETE /api/knowledge/documents/:id         # Delete document
POST   /api/knowledge/search                # Semantic search
GET    /api/knowledge/categories            # List categories
```

### Action Execution Endpoints

```
POST   /api/actions/execute                # Execute action
GET    /api/actions                        # List available actions
GET    /api/actions/:id                    # Get action details
GET    /api/actions/executions             # List execution history
GET    /api/actions/executions/:id         # Get execution details
```

### Template Endpoints

```
GET    /api/templates                      # List report templates
GET    /api/templates/:id                  # Get template details
POST   /api/templates/:id/execute          # Execute template
GET    /api/templates/executions           # List executions
GET    /api/templates/executions/:id/download # Download generated report
```

### Interface Management Endpoints (Admin)

```
GET    /api/interface/tenants              # List tenants
POST   /api/interface/tenants              # Create tenant
PUT    /api/interface/tenants/:id          # Update tenant
GET    /api/interface/subscriptions        # List subscriptions
POST   /api/interface/subscriptions        # Create subscription
GET    /api/interface/field-rules          # List field rules
POST   /api/interface/field-rules          # Create field rule
GET    /api/interface/extension-fields     # List extension fields
POST   /api/interface/extension-fields     # Create extension field
```

---

## Deployment Architecture

### Development Environment

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Frontend   │────>│  Backend    │────>│ PostgreSQL  │
│  (Next.js)  │     │  (NestJS)   │     │   Redis     │
│ localhost:  │     │ localhost:  │     │   Qdrant    │
│    3001     │     │    3000     │     │ (Docker)    │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Production Environment

```
                    ┌──────────────┐
                    │ Load Balancer│
                    └───────┬──────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
     ┌──────▼──────┐               ┌───────▼──────┐
     │  Frontend   │               │  Backend     │
     │  (Next.js)  │               │  (NestJS)    │
     │  Replica 1  │               │  Replica 1   │
     └─────────────┘               └───────┬──────┘
     ┌─────────────┐               ┌───────▼──────┐
     │  Frontend   │               │  Backend     │
     │  Replica 2  │               │  Replica 2   │
     └─────────────┘               └───────┬──────┘
                                           │
                            ┌──────────────┴──────────────┐
                            │                             │
                     ┌──────▼──────┐             ┌────────▼────────┐
                     │ PostgreSQL  │             │  Redis Cluster  │
                     │  (Primary)  │             │   Qdrant        │
                     └──────┬──────┘             └─────────────────┘
                            │
                     ┌──────▼──────┐
                     │ PostgreSQL  │
                     │  (Standby)  │
                     └─────────────┘
```

---

## Performance & Scalability

### Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| API Response Time (p95) | < 500ms | Excludes SAP calls |
| WebSocket Latency | < 100ms | Real-time messaging |
| Knowledge Search | < 2s | Including embedding + search |
| Action Execution | < 5s | Depends on SAP response |
| Document Processing | < 30s | Per 10-page document |

### Scalability Strategies

1. **Horizontal Scaling**: Run multiple backend instances behind a load balancer
2. **Caching**: Use Redis for session data, frequently accessed queries
3. **Connection Pooling**: Database connection pool (Prisma), SAP connection pool
4. **Asynchronous Processing**: Background jobs for document processing, report generation
5. **Vector DB Optimization**: Qdrant index optimization, HNSW parameters tuning

---

## Security & Compliance

### Authentication & Authorization

- **JWT-based authentication** with access/refresh tokens
- **SAP account binding** for permission checks
- **Role-based access control** (RBAC) for admin functions
- **Session management** with Redis (1-hour TTL)

### Data Protection

- **Encryption at rest**: PostgreSQL encryption, Redis encryption
- **Encryption in transit**: HTTPS/TLS for all API calls
- **PII detection**: Automatic detection and sanitization
- **Data retention**: 90-day audit log retention (configurable)

### Compliance

- **GDPR**: Right to erasure, data portability, consent management
- **SOC 2**: Audit logging, access controls, incident response
- **ISO 27001**: Information security management system (ISMS)

---

## Conclusion

OLORA provides a comprehensive, enterprise-grade AI agent system for SAP operations. The architecture balances **flexibility** (RAG knowledge base, customizable actions), **security** (data sanitization, audit logs), and **performance** (caching, async processing) to deliver a robust solution for enterprise users.

For implementation details and roadmap, see the main [README.md](README.md) and [development plan](/Users/leijinglun/.claude/plans/quizzical-munching-music.md).
