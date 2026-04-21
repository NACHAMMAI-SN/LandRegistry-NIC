#  LandRegistry-NIC

> A full-stack Land Registry Management System that leverages **Neural Image Compression (NIC)** to efficiently store and retrieve large-scale land document images — reducing storage overhead while preserving document quality.

---

##  Overview

Land registry systems deal with massive volumes of scanned documents — title deeds, survey maps, ownership certificates — that are large in size and expensive to store. LandRegistry-NIC solves this by integrating **Neural Image Compression** into the document storage pipeline, compressing high-resolution land documents intelligently before storing them in the cloud, and decompressing them on retrieval — all through a modern, responsive web interface.

---

##  Features

-  **Neural Image Compression** — Compresses large land document images using learned compression models before cloud storage
-  **Document Upload & Retrieval** — Upload scanned land documents, store compressed versions, retrieve and decompress on demand
-  **Structured Record Management** — Normalized PostgreSQL schema via Supabase for land record metadata
-  **Secure Access** — Role-based authentication for admins, officers, and citizens
-  **Compression Metrics** — Track compression ratio and file size reduction per document
-  **Responsive UI** — Mobile-friendly interface built with Tailwind CSS
-  **Fast Build** — Powered by Vite for instant development experience

---

##  Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript |
| Styling | Tailwind CSS |
| Build Tool | Vite |
| Backend / DB | Supabase (PostgreSQL) |
| DB Logic | PLpgSQL (stored procedures) |
| Storage | Supabase Storage |
| Compression | Neural Image Compression (NIC) |
| Package Manager | Bun |

---

##  System Architecture

```mermaid
flowchart TD
    A[User / Browser] -->|Upload Land Document| B[React + TypeScript Frontend]
    B -->|Original Image| C[NIC Compression Module]
    C -->|Compressed Image| D[Supabase Storage]
    B -->|Document Metadata| E[(PostgreSQL Database)]
    E --> F[PLpgSQL Stored Procedures]

    G[User Requests Document] -->|Fetch| B
    B -->|Retrieve Compressed Image| D
    D -->|Compressed Image| H[NIC Decompression Module]
    H -->|Reconstructed Image| B
    B -->|Display Document| G

    subgraph Frontend
        B
    end

    subgraph NIC Pipeline
        C
        H
    end

    subgraph Supabase
        D
        E
        F
    end
```

---

##  Document Storage & Retrieval Flow

```mermaid
sequenceDiagram
    actor User
    participant Frontend as React Frontend
    participant NIC as NIC Pipeline
    participant Storage as Supabase Storage
    participant DB as PostgreSQL

    User->>Frontend: Upload scanned land document
    Frontend->>NIC: Send original high-res image
    NIC-->>Frontend: Return compressed image + compression ratio
    Frontend->>Storage: Store compressed image
    Storage-->>Frontend: File URL
    Frontend->>DB: Save metadata (owner, parcel ID, file URL, compression ratio)
    DB-->>Frontend: Confirmation
    Frontend-->>User: Upload successful ✅

    User->>Frontend: Request land document
    Frontend->>DB: Query by parcel ID / owner
    DB-->>Frontend: Metadata + file URL
    Frontend->>Storage: Fetch compressed image
    Storage-->>Frontend: Compressed image
    Frontend->>NIC: Decompress image
    NIC-->>Frontend: Reconstructed document image
    Frontend-->>User: Display document 📄
```

---

##  Neural Image Compression Pipeline

```mermaid
flowchart LR
    A[Original Land Document\nHigh Resolution Scan] --> B[Encoder Network\nLearned Feature Extraction]
    B --> C[Quantization\nDiscrete Latent Representation]
    C --> D[Entropy Coding\nArithmetic Encoding]
    D --> E[Compressed Bitstream\nStored in Supabase]

    E --> F[Entropy Decoding]
    F --> G[Decoder Network\nReconstruction]
    G --> H[Reconstructed Document\nHigh Visual Quality]
```

---

##  Project Structure

```
LandRegistry-NIC/
├── public/                   # Static assets
├── src/
│   ├── components/           # Reusable UI components
│   ├── pages/                # Route-level page components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Supabase client & NIC utilities
│   └── types/                # TypeScript type definitions
├── supabase/
│   └── migrations/           # Database schema & PLpgSQL procedures
├── index.html
├── tailwind.config.ts
├── vite.config.ts
└── package.json
```

---

##  Database Schema

```mermaid
erDiagram
    USERS {
        uuid id PK
        string email
        string role
        timestamp created_at
    }

    LAND_RECORDS {
        uuid id PK
        string parcel_id
        string owner_name
        string location
        float area_sqft
        string status
        uuid registered_by FK
        timestamp created_at
    }

    DOCUMENTS {
        uuid id PK
        uuid land_record_id FK
        string document_type
        string original_size_kb
        string compressed_size_kb
        float compression_ratio
        string file_url
        timestamp uploaded_at
    }

    USERS ||--o{ LAND_RECORDS : "registers"
    LAND_RECORDS ||--o{ DOCUMENTS : "has"
```

---

##  Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/NACHAMMAI-SN/LandRegistry-NIC.git
cd LandRegistry-NIC

# Install dependencies
bun install
# or
npm install

# Set up environment variables
cp .env.example .env
# Add your Supabase URL and anon key

# Start development server
bun run dev
```

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

##  License

This project is open source and available under the [MIT License](LICENSE).
