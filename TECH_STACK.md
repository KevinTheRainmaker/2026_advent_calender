# 2026 만다라트 목표 설계 - 기술 스택 및 스펙

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **프로젝트명** | mandala-goal-planner |
| **버전** | 1.0.0 |
| **목적** | 14단계 여정을 통한 만다라트 목표 설계 웹 애플리케이션 |

---

## 기술 스택

### Frontend

| 기술 | 버전 | 용도 |
|------|------|------|
| **React** | 18.3.1 | UI 컴포넌트 라이브러리 |
| **TypeScript** | 5.3.0 | 타입 안정성 |
| **Vite** | 5.0.0 | 빌드 도구 및 개발 서버 |
| **React Router** | 6.20.0 | SPA 라우팅 |
| **TailwindCSS** | 3.4.0 | 유틸리티 기반 CSS 프레임워크 |
| **Zustand** | 4.5.0 | 경량 전역 상태 관리 |
| **Lucide React** | 0.562.0 | 아이콘 라이브러리 |

### Backend & Database

| 기술 | 버전 | 용도 |
|------|------|------|
| **Supabase** | 2.39.0 | BaaS (인증, 데이터베이스, RLS) |
| **PostgreSQL** | - | 데이터베이스 (Supabase 제공) |

### AI 서비스

| 기술 | 버전 | 용도 |
|------|------|------|
| **Google Generative AI** | 0.24.1 | Gemini API (LLM 채팅, 목표 제안, 리포트 생성) |

### 유틸리티

| 기술 | 버전 | 용도 |
|------|------|------|
| **jsPDF** | 2.5.2 | PDF 생성 |
| **html2canvas** | 1.4.1 | HTML → 이미지 변환 |

### 테스트

| 기술 | 버전 | 용도 |
|------|------|------|
| **Vitest** | 1.0.0 | 단위 테스트 |
| **Testing Library** | 14.1.0 | React 컴포넌트 테스트 |
| **jsdom** | 23.0.0 | 브라우저 환경 시뮬레이션 |

---

## 프로젝트 구조

```
src/
├── components/        # 재사용 가능한 UI 컴포넌트
│   ├── auth/          # 인증 관련 (EmailAuthModal, ProtectedRoute)
│   ├── common/        # 공통 컴포넌트 (Button, Input, Modal 등)
│   ├── day/           # 단계별 컴포넌트 (Day1Reflection, Day3CenterGoal 등)
│   ├── layout/        # 레이아웃 (Header, Container)
│   └── timeline/      # 타임라인 (DayCard, DayTimeline)
├── constants/         # 상수 정의 (질문, 테마, 검증 규칙)
├── hooks/             # 커스텀 훅 (useAuth, useMandala, useCurrentDay)
├── lib/               # 외부 라이브러리 설정 (Supabase, API)
├── pages/             # 페이지 컴포넌트 (Landing, Dashboard, Day1~14, Admin)
├── services/          # 서비스 레이어 (chatService, gemini, pdf)
├── store/             # Zustand 스토어 (authStore)
├── styles/            # 전역 스타일 (globals.css)
├── types/             # TypeScript 타입 정의
└── utils/             # 유틸리티 함수 (validators)
```

---

## 데이터베이스 스키마

### mandalas 테이블

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | UUID | 기본 키 |
| `user_id` | UUID | 사용자 ID (FK → auth.users) |
| `user_email` | TEXT | 사용자 이메일 |
| `year` | INTEGER | 연도 (2026) |
| `reflection_theme` | TEXT | 회고 테마 (theme1~6) |
| `reflection_answers` | JSONB | 회고 답변 |
| `center_goal` | TEXT | 핵심 목표 |
| `sub_goals` | JSONB | 하위 목표 8개 |
| `action_plans` | JSONB | 액션플랜 64개 |
| `ai_summary` | JSONB | AI 종합 리포트 |
| `name` | TEXT | 사용자 이름 (만다라트 표시용) |
| `commitment` | TEXT | 다짐 |
| `current_day` | INTEGER | 현재 단계 (1-14) |
| `completed_days` | JSONB | 완료된 단계 배열 |
| `marketing_consent` | BOOLEAN | 마케팅 동의 여부 |
| `created_at` | TIMESTAMPTZ | 생성일 |
| `updated_at` | TIMESTAMPTZ | 수정일 |

### RLS 정책

- 사용자는 자신의 데이터만 조회/수정/삭제 가능
- 관리자는 모든 데이터 조회 가능

---

## 인증 방식

| 항목 | 설명 |
|------|------|
| **방식** | Supabase Magic Link (이메일 OTP) |
| **크로스탭 감지** | localStorage 이벤트로 원래 탭 자동 리다이렉트 |
| **세션 관리** | Supabase Auth + JWT |

---

## AI 기능 (Gemini API)

| 기능 | 모델 | 설명 |
|------|------|------|
| **회고 질문 생성** | gemini-3-flash-preview | 테마별 질문을 자연스럽게 변형 |
| **목표 제안** | gemini-3-pro-preview | 회고 기반 핵심 목표 제안 |
| **종합 리포트** | gemini-2.0-flash | 14단계 완료 후 AI 분석 |

---

## 환경 변수

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GEMINI_API_KEY=your-gemini-api-key
VITE_SITE_URL=http://localhost:5173
```

---

## 실행 명령어

```bash
# 개발 서버
npm run dev

# 빌드
npm run build

# 테스트
npm run test

# 프리뷰
npm run preview
```

---

## 주요 페이지

| 경로 | 설명 |
|------|------|
| `/` | 랜딩 페이지 |
| `/dashboard` | 사용자 대시보드 |
| `/step/1` ~ `/step/14` | 14단계 여정 |
| `/admin` | 관리자 대시보드 |
| `/auth/callback` | 인증 콜백 처리 |
