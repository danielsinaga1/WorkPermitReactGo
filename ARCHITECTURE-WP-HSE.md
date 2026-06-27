# Work Permit & HSE System — Architecture & Technical Documentation

## Table of Contents
1. [System Overview](#1-system-overview)
2. [Architecture Design](#2-architecture-design)
3. [Database Schema (ERD)](#3-database-schema-erd)
4. [Backend Architecture](#4-backend-architecture)
5. [Frontend Architecture](#5-frontend-architecture)
6. [API Reference](#6-api-reference)
7. [Module Details](#7-module-details)
8. [Security & Authentication](#8-security--authentication)
9. [Deployment Guide](#9-deployment-guide)

---

## 1. System Overview

### Purpose
Digital Transformation platform for **Work Permit & HSE (Health, Safety, Environment)** operations in heavy industry. The system provides a unified, modular, and scalable solution supporting:

- **Unified Permit to Work (PTW)** — 8 permit types, 200-stage workflow engine, clash detection
- **HSE Operational Suite** — Toolbox Meetings, Safety Observations, Incidents & Near-Miss with RCA
- **LOTO & Asset Management** — Lock-Out/Tag-Out with QR Code and NFC tracking
- **Dashboard & Analytics Engine** — Safety Leading Indicators, trend analytics, PDF/Excel export

### Tech Stack

| Layer       | Technology              | Version    |
|-------------|-------------------------|------------|
| Backend     | Lumen (Laravel Micro)   | 10.x       |
| Database    | MySQL                   | 8.x        |
| Auth        | JWT (tymon/jwt-auth)    | 2.x        |
| Frontend    | React + TypeScript      | 19 / 5.5   |
| Build       | Vite                    | 7.x        |
| UI Library  | PrimeReact              | 10.x       |
| Charts      | Chart.js (PrimeReact)   | —          |
| CSS         | Tailwind CSS            | 3.x        |
| HTTP Client | Axios                   | 1.13       |
| Routing     | React Router            | 7.x        |

---

## 2. Architecture Design

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React SPA)                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │Dashboard │ │  PTW     │ │   HSE    │ │   LOTO   │   │
│  │& Reports │ │  Module  │ │  Module  │ │  Module  │   │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘   │
│       │             │            │             │         │
│       └──────┬──────┴────────────┴──────┬──────┘         │
│              │   Services (Axios)       │                │
└──────────────┼──────────────────────────┼────────────────┘
               │       HTTPS / JWT        │
┌──────────────┼──────────────────────────┼────────────────┐
│              │    API GATEWAY           │                │
│  ┌───────────┴──────────────────────────┴──────────────┐ │
│  │              Lumen Router (/api/wp/*)               │ │
│  └───────────┬──────────────────────────┬──────────────┘ │
│  ┌───────────┴───┐ ┌───────┴───────┐ ┌─┴──────────────┐ │
│  │ Controllers   │ │ Middleware    │ │ Auth (JWT)     │ │
│  │ WorkPermit    │ │ auth:api      │ │ tymon/jwt      │ │
│  │ Hse           │ │ CORS          │ └────────────────┘ │
│  │ Loto          │ └───────────────┘                    │
│  │ HseDashboard  │                                      │
│  │ Resource      │                                      │
│  └───────┬───────┘                                      │
│  ┌───────┴───────┐                                      │
│  │   Models      │ ← Eloquent ORM                       │
│  │  (22 models)  │                                      │
│  └───────┬───────┘                                      │
│          │                                               │
│  ┌───────┴───────┐                                      │
│  │   MySQL DB    │ ← 30+ tables                         │
│  └───────────────┘                                      │
└──────────────────────────────────────────────────────────┘
```

### Design Principles
- **Modular** — Each module (PTW, HSE, LOTO, Dashboard) is self-contained
- **Scalable** — Polymorphic models, JSON columns, configurable workflows
- **RESTful** — Standard HTTP verbs, resource-oriented endpoints
- **Soft-Deletes** — All primary entities use SoftDeletes for audit trails
- **Trait-based** — `ApiResponse` trait standardizes all API responses

---

## 3. Database Schema (ERD)

### Migration Files
| # | File | Tables |
|---|------|--------|
| 1 | `2024_03_01_000001_create_work_permit_tables.php` | work_areas, personnel, personnel_qualifications, equipment, equipment_certifications, permit_types, work_permits, permit_approvals, permit_risk_assessments, permit_personnel, permit_equipment, permit_attachments, permit_extensions, clash_detections |
| 2 | `2024_03_01_000002_create_hse_operations_tables.php` | toolbox_meetings, toolbox_attendees, safety_observations, observation_photos, corrective_actions, incidents, incident_witnesses, incident_root_causes, incident_attachments |
| 3 | `2024_03_01_000003_create_loto_dashboard_tables.php` | loto_procedures, loto_points, loto_locks, loto_verifications, safety_indicators, dashboard_widgets, report_exports, audit_trails |

### Entity Relationship Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  PermitType  │────<│ WorkPermit   │>────│  WorkArea    │
│  (8 types)   │     │  (central)   │     │  (zones)     │
└──────────────┘     └──────┬───────┘     └──────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
   ┌────┴─────┐      ┌─────┴──────┐      ┌─────┴────────┐
   │ Approvals│      │ Personnel  │      │  Equipment   │
   │ (1-200   │      │ (pivot)    │      │  (pivot)     │
   │  stages) │      └─────┬──────┘      └─────┬────────┘
   └──────────┘            │                    │
                     ┌─────┴──────┐       ┌─────┴────────┐
                     │Qualificatn │       │Certification │
                     └────────────┘       └──────────────┘

                    ┌──────────────┐
                    │   Incident   │>────┐
                    └──────┬───────┘     │
                           │             │
         ┌────────┬────────┼──────┐      │
         │        │        │      │      │
    ┌────┴───┐┌───┴───┐┌───┴──┐┌──┴────┐ │
    │Witness ││Root   ││Attch ││Correc │ │ (polymorphic)
    │        ││Cause  ││ment  ││tive   │←┤
    └────────┘│(5 RCA)│└──────┘│Action │ │
              └───────┘        └───────┘ │
                                         │
                    ┌──────────────┐      │
                    │Safety Observ │>─────┘
                    └──────┬───────┘
                           │
                    ┌──────┴───────┐
                    │Observ Photos │
                    └──────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│LotoProcedure │────<│  LotoPoint   │────<│  LotoLock    │
│              │     │  (QR/NFC)    │     │  (tracking)  │
└──────────────┘     └──────┬───────┘     └──────────────┘
                            │
                     ┌──────┴───────┐
                     │LotoVerifictn │
                     └──────────────┘
```

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| `corrective_actions` uses polymorphic morph | Links to both `safety_observations` and `incidents` without duplication |
| `audit_trails` uses polymorphic morph | Tracks changes across any entity type |
| `permit_approvals.stage_order` supports 1-200 | Configurable multi-stage workflow engine |
| JSON columns for `safety_precautions`, `ppe_requirements`, `gas_test_results`, `isolation_details` | Flexible schema for varying permit types |
| `workflow_stages` JSON in `permit_types` | Template-driven workflow generation |
| Composite indexes on `(status, planned_start)` and `(work_area_id, planned_start, planned_end)` | Optimized for active permit queries and clash detection |

---

## 4. Backend Architecture

### Models (22)

| Model | Table | Key Features |
|-------|-------|-------------|
| `WorkArea` | work_areas | SoftDeletes, scopes: `active()`, `byZone()` |
| `Personnel` | personnel | SoftDeletes, pivot to WorkPermit, QR/NFC fields |
| `PersonnelQualification` | personnel_qualifications | `isExpired()`, `expiringSoon()` scope |
| `Equipment` | equipment | SoftDeletes, pivot to WorkPermit, QR/NFC fields |
| `EquipmentCertification` | equipment_certifications | `valid()` scope |
| `PermitType` | permit_types | JSON config for workflow, risk checklist template |
| `WorkPermit` | work_permits | **Central model** — 15+ relationships, 13 status values, `generatePermitNumber()`, `getRiskLevel()` |
| `PermitApproval` | permit_approvals | Ordered stages, `pending()` scope |
| `PermitRiskAssessment` | permit_risk_assessments | Computed `risk_score`, static `calculateRiskLevel()` |
| `PermitAttachment` | permit_attachments | File metadata |
| `PermitExtension` | permit_extensions | Extension request workflow |
| `ClashDetection` | clash_detections | **Haversine distance** proximity check, equipment conflict detection |
| `ToolboxMeeting` | toolbox_meetings | SoftDeletes, auto-number, JSON template |
| `ToolboxAttendee` | toolbox_attendees | Signature tracking |
| `SafetyObservation` | safety_observations | 8 categories, polymorphic `correctiveActions` |
| `ObservationPhoto` | observation_photos | JSON annotations for photo markup |
| `CorrectiveAction` | corrective_actions | **Polymorphic** via `morphTo('actionable')`, `overdue()` scope |
| `Incident` | incidents | 10 types, auto-number, full investigation lifecycle |
| `IncidentWitness` | incident_witnesses | Statement tracking |
| `IncidentRootCause` | incident_root_causes | 5 RCA methods (5 Why, Fishbone, Fault Tree, TapRoot, BowTie) |
| `LotoProcedure` | loto_procedures | JSON energy_sources/isolation_steps, `isFullyLocked()` |
| `LotoPoint` | loto_points | QR/NFC tracking, verification chain |
| `LotoLock` | loto_locks | Lock/unlock with force-remove |
| `LotoVerification` | loto_verifications | JSON readings for test results |
| `SafetyIndicator` | safety_indicators | Leading/lagging type with threshold |
| `AuditTrail` | audit_trails | Polymorphic, static `log()` method |
| `ReportExport` | report_exports | Queue-based export tracking |

### Controllers (5)

| Controller | Endpoints | Key Features |
|-----------|-----------|-------------|
| `WorkPermitController` | 10 | Full lifecycle (draft→close), qualification/cert verification, clash detection |
| `HseController` | 14 | Toolbox Meetings, Safety Observations, Corrective Actions, Incidents, RCA |
| `LotoController` | 9 | Procedures, lock/unlock, verification, QR/NFC scanning |
| `HseDashboardController` | 5 | Overview stats, leading indicators (6 KPIs), trend analytics, export |
| `ResourceController` | 14 | CRUD for WorkAreas, Personnel, Equipment, PermitTypes |

### Clash Detection Algorithm

```php
// ClashDetection::detectClashes(WorkPermit $permit)

1. Find overlapping permits (same time range)
2. For each overlapping permit:
   a. LOCATION CLASH — Haversine distance between work areas
      - Uses: 2 * R * arcsin(√(sin²(Δlat/2) + cos(lat1)·cos(lat2)·sin²(Δlon/2)))
      - Threshold: sum of both work area radii
      
   b. EQUIPMENT CLASH — pivot table intersection
      - Checks: shared equipment_id between permits
      
3. Return array of { type, description, severity, permit_a, permit_b }
```

---

## 5. Frontend Architecture

### Directory Structure

```
wp-ui/src/
├── types/
│   └── workPermitTypes.ts          # 400+ lines of TypeScript interfaces
├── services/
│   ├── workPermitService.ts        # Permits, WorkAreas, Personnel, Equipment, PermitTypes
│   ├── hseService.ts               # Toolbox, Observations, Corrective Actions, Incidents
│   ├── lotoService.ts              # LOTO procedures, lock/unlock, QR/NFC
│   └── hseDashboardService.ts      # Dashboard overview, indicators, trends, export
├── pages/Dashboard/
│   ├── workPermit/
│   │   ├── WpHseDashboard.tsx      # Main dashboard with KPIs, charts, indicators
│   │   ├── PermitList.tsx          # Paginated/filterable permit table
│   │   ├── PermitDetail.tsx        # Full permit view with tabs (overview, approvals, risk, personnel, equipment, clashes)
│   │   ├── PermitForm.tsx          # Create/edit permit with dynamic fields
│   │   ├── PersonnelList.tsx       # Personnel management with QR/NFC indicators
│   │   └── EquipmentList.tsx       # Equipment management with condition tracking
│   ├── hse/
│   │   ├── IncidentList.tsx        # Incident reporting & investigation tracking
│   │   ├── ObservationList.tsx     # Safety observation logging
│   │   ├── ToolboxMeetingList.tsx  # TBM scheduling & completion
│   │   └── CorrectiveActionList.tsx # CA tracking with overdue highlighting
│   └── loto/
│       └── LotoProcedureList.tsx   # LOTO with QR/NFC scan & isolation point detail
```

### Route Map (Dashboard)

| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard/wp-hse` | WpHseDashboard | Main WP & HSE dashboard |
| `/dashboard/work-permits` | PermitList | All work permits |
| `/dashboard/work-permits/create` | PermitForm | Create new permit |
| `/dashboard/work-permits/:id` | PermitDetail | Permit detail & actions |
| `/dashboard/work-permits/:id/edit` | PermitForm | Edit draft permit |
| `/dashboard/personnel` | PersonnelList | Personnel management |
| `/dashboard/equipment` | EquipmentListPage | Equipment management |
| `/dashboard/hse/incidents` | IncidentList | Incidents & Near-Miss |
| `/dashboard/hse/observations` | ObservationList | Safety observations |
| `/dashboard/hse/toolbox-meetings` | ToolboxMeetingList | Toolbox meetings |
| `/dashboard/hse/corrective-actions` | CorrectiveActionList | Corrective actions |
| `/dashboard/loto` | LotoProcedureList | LOTO procedures |

---

## 6. API Reference

### Base URL
```
{VITE_API_URL}/api/wp/
```

### Authentication
All endpoints (except public ones) require JWT Bearer token:
```
Authorization: Bearer {access_token}
```

### Endpoints

#### Work Permits
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/permits` | List permits (paginated, filtered) |
| `GET` | `/permits/{id}` | Permit detail with all relations |
| `POST` | `/permits` | Create new permit (draft) |
| `PUT` | `/permits/{id}` | Update draft/returned permit |
| `POST` | `/permits/{id}/submit` | Submit for review |
| `POST` | `/permits/{id}/approval` | Process approval stage |
| `POST` | `/permits/{id}/activate` | Activate approved permit |
| `POST` | `/permits/{id}/close` | Close active permit |
| `POST` | `/permits/{id}/risk-assessment` | Add risk assessment |
| `GET` | `/permits/{id}/check-clash` | Run clash detection |

#### Personnel & Equipment
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET/POST` | `/personnel` | List / Create |
| `GET/PUT/DELETE` | `/personnel/{id}` | Detail / Update / Delete |
| `POST` | `/personnel/{id}/qualifications` | Add qualification |
| `POST` | `/personnel/scan-qr` | Scan QR code |
| `POST` | `/personnel/scan-nfc` | Scan NFC tag |
| `GET/POST` | `/equipment` | List / Create |
| `GET/PUT/DELETE` | `/equipment/{id}` | Detail / Update / Delete |

#### HSE Operations
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET/POST` | `/toolbox` | List / Create TBM |
| `GET/PUT` | `/toolbox/{id}` | Detail / Update |
| `POST` | `/toolbox/{id}/complete` | Mark complete |
| `GET/POST` | `/observations` | List / Create observations |
| `GET` | `/observations/{id}` | Detail |
| `POST` | `/observations/{id}/photos` | Upload photos |
| `POST` | `/observations/{id}/corrective-action` | Assign CA |
| `GET` | `/corrective-actions` | List all CAs |
| `POST` | `/corrective-actions/{id}/complete` | Complete CA |
| `GET/POST` | `/incidents` | List / Report |
| `GET/PUT` | `/incidents/{id}` | Detail / Update |
| `POST` | `/incidents/{id}/root-cause` | Add RCA |
| `POST` | `/incidents/{id}/close` | Close incident |

#### LOTO
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET/POST` | `/loto/procedures` | List / Create |
| `GET/PUT` | `/loto/procedures/{id}` | Detail / Update |
| `POST` | `/loto/procedures/{id}/lock` | Apply lock |
| `POST` | `/loto/procedures/{id}/unlock` | Remove lock |
| `POST` | `/loto/procedures/{id}/verify` | Record verification |
| `POST` | `/loto/scan-qr` | Scan QR code |
| `POST` | `/loto/scan-nfc` | Scan NFC tag |

#### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/dashboard/overview` | Aggregated statistics |
| `GET` | `/dashboard/leading-indicators` | Safety KPIs + risk prediction |
| `GET` | `/dashboard/trends` | Monthly trend data |
| `POST` | `/dashboard/export` | Queue report export |
| `GET` | `/dashboard/export/{id}` | Check export status |

### Response Format

All responses wrap data with `ApiResponse` trait:

```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

Paginated responses include `meta`:
```json
{
  "success": true,
  "message": "...",
  "data": [ ... ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 67,
    "from": 1,
    "to": 15
  }
}
```

---

## 7. Module Details

### 7.1 Permit to Work (PTW)

#### Permit Types (8)
| Code | Name | Max Duration |
|------|------|-------------|
| PLANT | Plant Work Permit | 12h |
| NON_PLANT | Non-Plant Work Permit | 24h |
| HOT_WORK | Hot Work Permit | 8h |
| CONFINED_SPACE | Confined Space Entry | 8h |
| EXCAVATION | Excavation Permit | 24h |
| DIVING | Diving Operations | 8h |
| LIFTING | Lifting Operations | 12h |
| WORK_AT_HEIGHT | Work at Height | 8h |

#### Permit Lifecycle (13 States)

```
draft → submitted → under_review → risk_assessment → pending_approval
  ↓                                                        ↓
cancelled                                            ┌─────┴─────┐
                                                     │           │
                                                  approved   rejected
                                                     │           ↓
                                                     ↓        (end)
                                                   active
                                                     │
                                              ┌──────┴──────┐
                                              │             │
                                           completed    suspended
                                              │             │
                                              ↓             ↓
                                            closed       active (resume)
                                                           ↓
                                                        expired
```

#### Workflow Engine (1-200 Stages)
- Each `PermitType` has a `workflow_stages` JSON template
- On permit creation, stages are auto-generated as `PermitApproval` records
- Each stage has: `stage_order`, `stage_name`, `stage_type`, `approver_role`
- Stage types: `approval`, `verification`, `review`, `sign_off`
- Decisions: `pending`, `approved`, `rejected`, `returned`, `skipped`

#### Clash Detection
- **Location clash** — Haversine distance < sum of radii
- **Equipment clash** — shared equipment between concurrent permits
- Triggered on `submit` and via manual `check-clash` endpoint
- Severity: `warning` | `critical`

### 7.2 HSE Operational Suite

#### Safety Observations (8 Categories)
`unsafe_act`, `unsafe_condition`, `near_miss`, `positive_observation`, `environmental`, `housekeeping`, `ppe_compliance`, `procedure_compliance`

#### Incident Types (10)
`near_miss`, `first_aid`, `medical_treatment`, `lost_time_injury`, `restricted_work`, `fatality`, `property_damage`, `environmental`, `fire`, `spill`

#### Root Cause Analysis (5 Methods)
| Method | Description |
|--------|-------------|
| `5_why` | Sequential "why" questioning |
| `fishbone` | Ishikawa cause-and-effect diagram |
| `fault_tree` | Boolean logic tree analysis |
| `taproot` | Systematic investigation process |
| `bowtie` | Barrier-based risk analysis |

#### Corrective Actions (Polymorphic)
- Linked to both `SafetyObservation` and `Incident` via morphs
- Statuses: `open` → `in_progress` → `completed` → `verified`
- Overdue detection with visual highlighting

### 7.3 LOTO & Asset Management

#### Energy Types (7)
`electrical`, `pneumatic`, `hydraulic`, `gravity`, `thermal`, `chemical`, `mechanical`

#### QR/NFC Tracking
- `LotoPoint` has `qr_code` and `nfc_tag_id` fields
- `Personnel` has `qr_code` and `nfc_tag_id` for identity scanning
- Scan endpoints return entity details for field verification

#### Lock Status Flow
```
(unlocked) → locked → unlocked
                ↓
          force_removed (requires authorization)
```

### 7.4 Dashboard & Analytics

#### 6 Safety Leading Indicators (KPIs)
| KPI | Formula |
|-----|---------|
| TBM Compliance | completed_meetings / total_meetings × 100 |
| Observation Rate | observations_current_month / target |
| CA Closure Rate | closed_actions / total_actions × 100 |
| Permit Compliance | (on_time_permits / total_permits) × 100 |
| Near Miss Ratio | near_miss / (near_miss + incidents) × 100 |
| Training Compliance | valid_certs / total_certs × 100 |

#### Risk Prediction
- Weighted score from all 6 indicators
- Risk levels: `low` (0-25), `medium` (26-50), `high` (51-75), `extreme` (76-100)
- Generates actionable recommendations

---

## 8. Security & Authentication

### JWT Authentication
- Token type: Bearer
- Token refresh: automatic via Axios interceptor
- Failed queue: pending requests retry after refresh

### Middleware Stack
```
auth:api  →  JWT verification
cors      →  Cross-Origin Resource Sharing
```

### Authorization
- Role-based access through existing `User.role` field
- Force-remove LOTO lock requires `force_remove_authorized_by` field
- Permit status transitions are enforced in controller logic

---

## 9. Deployment Guide

### Prerequisites
- PHP 8.1+, Composer
- Node.js 18+, npm/pnpm
- MySQL 8.x

### Backend Setup
```bash
cd wp-services
composer install
cp .env.example .env  # Configure DB credentials
php artisan migrate
php artisan jwt:secret
php -S localhost:8000 -t public
```

### Frontend Setup
```bash
cd wp-ui
npm install
cp .env.example .env  # Set VITE_API_URL
npm run dev
```

### Environment Variables

#### Backend (.env)
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ekraf_db
DB_USERNAME=root
DB_PASSWORD=
JWT_SECRET=<generated>
```

#### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

---

## File Inventory

### Backend (wp-services/)

| Path | Description |
|------|-------------|
| `database/migrations/2024_03_01_000001_create_work_permit_tables.php` | PTW schema (14 tables) |
| `database/migrations/2024_03_01_000002_create_hse_operations_tables.php` | HSE schema (9 tables) |
| `database/migrations/2024_03_01_000003_create_loto_dashboard_tables.php` | LOTO & Dashboard schema (8 tables) |
| `app/Models/WorkArea.php` through `app/Models/ReportExport.php` | 22 Eloquent models |
| `app/Http/Controllers/WorkPermitController.php` | PTW controller (10 endpoints) |
| `app/Http/Controllers/HseController.php` | HSE controller (14 endpoints) |
| `app/Http/Controllers/LotoController.php` | LOTO controller (9 endpoints) |
| `app/Http/Controllers/HseDashboardController.php` | Dashboard controller (5 endpoints) |
| `app/Http/Controllers/ResourceController.php` | Resources controller (14 endpoints) |
| `routes/web.php` | All route definitions under `/api/wp/` |

### Frontend (wp-ui/src/)

| Path | Description |
|------|-------------|
| `types/workPermitTypes.ts` | TypeScript type definitions (50+ interfaces) |
| `services/workPermitService.ts` | PTW & resource API service |
| `services/hseService.ts` | HSE operations API service |
| `services/lotoService.ts` | LOTO API service |
| `services/hseDashboardService.ts` | Dashboard API service |
| `pages/Dashboard/workPermit/WpHseDashboard.tsx` | Main dashboard page |
| `pages/Dashboard/workPermit/PermitList.tsx` | Permit list page |
| `pages/Dashboard/workPermit/PermitDetail.tsx` | Permit detail page |
| `pages/Dashboard/workPermit/PermitForm.tsx` | Create/edit permit |
| `pages/Dashboard/workPermit/PersonnelList.tsx` | Personnel management |
| `pages/Dashboard/workPermit/EquipmentList.tsx` | Equipment management |
| `pages/Dashboard/hse/IncidentList.tsx` | Incident management |
| `pages/Dashboard/hse/ObservationList.tsx` | Safety observations |
| `pages/Dashboard/hse/ToolboxMeetingList.tsx` | Toolbox meetings |
| `pages/Dashboard/hse/CorrectiveActionList.tsx` | Corrective actions |
| `pages/Dashboard/loto/LotoProcedureList.tsx` | LOTO management |
