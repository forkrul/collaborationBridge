# Architecture Documentation

## System Overview

```{mermaid}
graph TB
    Client[Client Application]
    LB[Load Balancer/Traefik]
    API[FastAPI Application]
    Cache[Redis Cache]
    DB[(PostgreSQL Database)]
    Queue[Task Queue]
    
    Client --> LB
    LB --> API
    API --> Cache
    API --> DB
    API --> Queue
    
    classDef primary fill:#1f77b4,stroke:#333,stroke-width:2px,color:#fff
    classDef storage fill:#ff7f0e,stroke:#333,stroke-width:2px,color:#fff
    
    class API primary
    class DB,Cache storage
```

## API Flow

```{mermaid}
sequenceDiagram
    participant C as Client
    participant A as API
    participant M as Middleware
    participant S as Service
    participant D as Database
    
    C->>A: HTTP Request
    A->>M: Process Middleware
    M->>A: Validated Request
    A->>S: Business Logic
    S->>D: Query Data
    D-->>S: Return Data
    S-->>A: Process Response
    A-->>C: HTTP Response
```

## Database Design

```{mermaid}
erDiagram
    USER ||--o{ POST : creates
    USER ||--o{ COMMENT : writes
    POST ||--o{ COMMENT : has
    
    USER {
        int id PK
        string email UK
        string username UK
        string password_hash
        boolean is_active
        datetime created_at
        datetime updated_at
        datetime deleted_at
        boolean is_deleted
    }
    
    POST {
        int id PK
        int user_id FK
        string title
        text content
        string status
        datetime created_at
        datetime updated_at
        datetime deleted_at
        boolean is_deleted
    }
    
    COMMENT {
        int id PK
        int post_id FK
        int user_id FK
        text content
        datetime created_at
        datetime updated_at
        datetime deleted_at
        boolean is_deleted
    }
```

## Deployment Architecture

```{mermaid}
graph LR
    subgraph "Docker Network"
        T[Traefik]
        subgraph "Application Stack"
            A1[App Instance 1]
            A2[App Instance 2]
            A3[App Instance 3]
        end
        R[Redis]
        P[(PostgreSQL)]
    end
    
    subgraph "External Services"
        S3[S3 Storage]
        SM[Monitoring]
    end
    
    T --> A1
    T --> A2
    T --> A3
    A1 --> R
    A2 --> R
    A3 --> R
    A1 --> P
    A2 --> P
    A3 --> P
    A1 --> S3
    A2 --> SM
```
