import type { PortfolioProject } from "../lib/types"

export const flowAiProject: PortfolioProject = {
  slug: "flow-ai",
  title: "Flow AI",
  logo: "/images/portfolio/flow-ai/logo.png",
  subtitle:
    "협업 플랫폼 Flow의 내부 데이터를 활용하는 AI 서비스 — LangChain/LangGraph 기반 에이전트 시스템, 의도 기반 검색, RAG 챗봇을 설계·구현했습니다.",
  company: "마드라스체크 AI 사업개발실",
  team: "3년차",
  period: "2025.07 ~ 재직 중",
  role: "Flow AI 전 기능 설계 및 구현 · 2026.02.23 정식 오픈",
  highlightBase: "2026.03.10 기준, 전주 대비",
  highlights: [
    { label: "전체 처리", value: "30,904건+", trend: "+3,322" },
    { label: "사용 인원", value: "7,519명+", trend: "+2,096" },
    { label: "사용 기업", value: "2,141개+", trend: "+297" },
    { label: "Flow Search", value: "13,400건+", trend: "+4,196" },
    { label: "대화 완료율", value: "96.95%" },
    { label: "챗봇 완료율", value: "94.5%" },
  ],
  overview: [
    "Flow AI는 협업 플랫폼 Flow의 내부 데이터(프로젝트·업무·게시물·채팅·파일)를 활용하는 AI 서비스입니다.",
    "NestJS 백엔드와 Next.js 프론트엔드 모노레포 구조이며, LangChain/LangGraph 기반 에이전트 시스템이 핵심 아키텍처입니다.",
    "아래 기술된 모든 기능은 팀 리소스 사정으로 인해 별도 담당 영역 구분 없이 단독으로 설계 및 구현하였습니다.",
    "에이전트 시스템 설계, 의도 기반 검색 파이프라인, RAG 챗봇, 메모리, 공유 시스템까지 End-to-End로 담당하며, RAG의 구조적 한계를 실시간 검색·의도 분석 파이프라인으로 해결했습니다.",
  ],
  techStacks: [
    {
      label: "Backend",
      items: [
        { name: "NestJS", icon: "nestjs", color: "E0234E" },
        { name: "LangChain", icon: "langchain", color: "1C3C3C" },
        { name: "LangGraph" },
        { name: "Prisma", icon: "prisma", color: "2D3748" },
        { name: "PostgreSQL", icon: "postgresql", color: "4169E1" },
        { name: "pgvector" },
        { name: "TypeScript", icon: "typescript", color: "3178C6" },
      ],
    },
    {
      label: "Frontend",
      items: [
        { name: "Next.js", icon: "nextdotjs", color: "000000" },
        { name: "React", icon: "react", color: "61DAFB" },
        { name: "Zustand" },
        { name: "Tailwind CSS", icon: "tailwindcss", color: "06B6D4" },
        { name: "React Markdown" },
        { name: "marked.js" },
      ],
    },
    {
      label: "Infra & 기타",
      items: [
        { name: "Docker", icon: "docker", color: "2496ED" },
        { name: "Redis", icon: "redis", color: "FF4438" },
        { name: "SSE Protocol" },
        { name: "OpenTelemetry", icon: "opentelemetry", color: "000000" },
      ],
    },
    {
      label: "도메인",
      items: [
        { name: "Flow 협업 플랫폼 API" },
        { name: "RAG" },
        { name: "OpenAI", icon: "openai", color: "412991" },
        { name: "Claude", icon: "anthropic", color: "191919" },
      ],
    },
  ],
  features: [
    {
      id: "flow-search",
      title: "Flow Search — 의도 기반 내부 데이터 검색",
      roles: ["단독 설계/구현", "Full Stack"],
      problem:
        "기존 Flow AI 검색은 유효성이 낮고, 오류율이 높으며 응답 속도가 느려 고객·내부 임직원·대표로부터 지속적인 개선 요구가 있었습니다. 월간 사용량이 10월 2,500건 → 11월 489건 → 12월 33건으로 급감하고 있었고, 전면 재개발이 결정되었습니다. LangChain/LangGraph 생태계에 대한 깊이 있는 이해를 바탕으로 해당 프로젝트를 담당하게 되었습니다.",
      designs: [
        {
          title: "LangGraph 7노드 단일 파이프라인",
          description:
            "쿼리 분석부터 결과 반환까지 단계별 입출력과 조건부 재시도를 명시적으로 정의",
        },
        {
          title: "LLM 최소 호출 원칙",
          description:
            "쿼리 분석·검증 단계에만 LLM을 사용하고, 의도 매핑·실행·병합은 규칙 기반으로 처리하여 레이턴시를 최소화",
        },
        {
          title: "검색 API 병렬 호출",
          description: "LLM이 최적화한 파라미터로 복수 검색 API를 동시 호출하여 응답 속도를 단축",
        },
        {
          title: "조건부 재시도 전략",
          description:
            "검증 실패 시 의도 매핑 단계를 건너뛰고 검색 파라미터부터 재구성하며, 키워드 확장·날짜 범위 확대를 자동 적용",
        },
        {
          title: "범용 재사용 설계",
          description:
            "일반 대화·챗봇·에이전트·Flow 내부 임베드 등 서비스 전 영역에서 동일 검색 그래프를 재사용할 수 있는 구조",
        },
      ],
      mermaidDiagram: `graph TD
    A["쿼리 분석\\n(LLM)"] --> B["의도 매핑\\n(규칙 기반)"]
    B --> C["검색 파라미터 구성\\n(LLM)"]
    C --> D["검색 실행\\n(병렬 API)"]
    D --> E["결과 병합"]
    E --> F["콘텐츠 필터"]
    F --> G{"검증\\n(LLM)"}
    G -->|"통과"| H["결과 반환"]
    G -->|"실패"| C

    style A fill:#4f46e5,stroke:#4338ca,color:#fff
    style B fill:#059669,stroke:#047857,color:#fff
    style C fill:#4f46e5,stroke:#4338ca,color:#fff
    style D fill:#d97706,stroke:#b45309,color:#fff
    style E fill:#059669,stroke:#047857,color:#fff
    style F fill:#059669,stroke:#047857,color:#fff
    style G fill:#4f46e5,stroke:#4338ca,color:#fff
    style H fill:#16a34a,stroke:#15803d,color:#fff`,
      screenshots: [
        {
          src: "/images/portfolio/flow-ai/flowai-search-sample-3.png",
          alt: "Flow Search 의도 분석 결과",
          caption: "의도 분석·키워드 추출·검색 조건 구성 후 결과 병합 화면",
        },
        {
          src: "/images/portfolio/flow-ai/flowai-search-sample-2.png",
          alt: "Flow Search 재시도 진행 상태",
          caption: "조건부 재시도 시 추가 분석·플로우 탐색·결과 확인 단계별 SSE 상태 표시",
        },
        {
          src: "/images/portfolio/flow-ai/flowai-search-sample-1.png",
          alt: "Flow Search 검색 결과 + 출처",
          caption: "의도 분석 후 검색 결과와 출처 패널이 표시되는 화면",
        },
      ],
      stats: [
        { label: "전체 처리 비중", value: 43.4, suffix: "%", type: "progress" },
        { label: "누적 검색 처리", value: "13,400건", type: "text" },
        { label: "서비스 내 최다 사용 단일 기능", value: "1위", type: "text" },
      ],
    },
    {
      id: "agent-system",
      title: "에이전트 시스템 — createReactAgent 기반 아키텍처 전환",
      roles: ["단독 설계/구현", "Full Stack"],
      problem:
        "기존 대화 시스템은 LangGraph StateGraph에 6개 노드를 수동으로 하드코딩한 방식이었습니다. 기능이 추가될 때마다 시스템 프롬프트가 비대해지고, 노드 간 의존성이 기능 수에 비례해 복잡도가 폭발하여 유지보수와 확장이 사실상 불가능한 상태였습니다.",
      designs: [
        {
          title: "createReactAgent API 기반 단일 진입점",
          description: "에이전트 생성 API를 중심으로 도구 바인딩과 스트리밍 계약을 일원화",
        },
        {
          title: "Main Agent + Sub Agent 위임 구조",
          description:
            "General/Assistant Agent가 요청을 수신하고, WebSearcher·ImageGenerator·Programmer·FlowSearcher 등 전문 Sub Agent에 위임",
        },
        {
          title: "미들웨어 빌더 패턴",
          description:
            "AgentMiddlewareBuilder를 설계하여 toolCallLimit, modelCallLimit, todoList 등 횡단 관심사를 조합 가능한 미들웨어로 분리",
        },
        {
          title: "단일 SSE 이벤트 채널",
          description:
            "AgentEventSender로 Main·Sub Agent의 동시 스트리밍 출력을 하나의 SSE 이벤트 체계로 통합",
        },
      ],
      mermaidDiagram: `graph TD
    U["사용자 입력"] --> MA["Main Agent\\n(General / Assistant)"]
    MA --> MW["미들웨어 체인\\n(toolCallLimit, modelCallLimit, ...)"]
    MW --> |"도구 호출"| SA1["WebSearcher\\nSub Agent"]
    MW --> |"도구 호출"| SA2["ImageGenerator\\nSub Agent"]
    MW --> |"도구 호출"| SA3["Programmer\\nSub Agent"]
    MW --> |"도구 호출"| SA4["FlowSearcher\\nSub Agent"]
    SA1 --> ES["AgentEventSender\\n(SSE 통합)"]
    SA2 --> ES
    SA3 --> ES
    SA4 --> ES
    MA --> ES
    ES --> R["클라이언트 스트리밍"]

    style U fill:#6b7280,stroke:#4b5563,color:#fff
    style MA fill:#4f46e5,stroke:#4338ca,color:#fff
    style MW fill:#7c3aed,stroke:#6d28d9,color:#fff
    style SA1 fill:#d97706,stroke:#b45309,color:#fff
    style SA2 fill:#d97706,stroke:#b45309,color:#fff
    style SA3 fill:#d97706,stroke:#b45309,color:#fff
    style SA4 fill:#d97706,stroke:#b45309,color:#fff
    style ES fill:#059669,stroke:#047857,color:#fff
    style R fill:#16a34a,stroke:#15803d,color:#fff`,
      screenshots: [
        {
          src: "/images/portfolio/flow-ai/flowai-agent-chat-sample-1.png",
          alt: "에이전트 웹 검색 대화",
          caption: "웹 검색 서브에이전트가 동작하며 출처 패널이 표시되는 대화 화면",
        },
        {
          src: "/images/portfolio/flow-ai/flowai-agent-chat-sample-2.png",
          alt: "에이전트 이미지 생성",
          caption: "이미지 생성 서브에이전트가 동작하는 대화 화면",
        },
      ],
      stats: [
        { label: "일반 채팅 누적 처리", value: "3,972건", type: "text" },
        { label: "완료율", value: 96.95, suffix: "%", type: "progress" },
        {
          label: "점진적 확장 가능 구조",
          value: "Main/Sub Agent + 미들웨어 패턴 확립",
          type: "text",
        },
      ],
    },
    {
      id: "chatbot",
      title: "기업용 챗봇 — RAG + Flow Search 하이브리드 AI 비서",
      roles: ["단독 설계/구현", "Full Stack"],
      problem:
        "기업·프로젝트별 문서와 Flow 데이터를 기반으로 답변하는 챗봇이 필요했습니다. 초기 RAG 단독 구성으로는 실시간 Flow 데이터 반영이 불가능하고, 정적 벡터 검색만으로는 검색 품질에 한계가 있었습니다.",
      designs: [],
      mermaidDiagram: "",
      screenshots: [],
      subSections: [
        {
          title: "챗봇 생성 — 문서 변환·청킹·임베딩 파이프라인",
          designs: [
            {
              title: "문서 변환·청킹·임베딩 비동기 파이프라인",
              description:
                "PDF/Excel 업로드 시 텍스트 추출 → 청크 분할(오버랩 포함) → OpenAI 임베딩 → pgvector 저장까지 비동기 파이프라인으로 처리",
            },
            {
              title: "폴링 기반 상태 추적",
              description:
                "대용량 파일 처리 시 pending → processing → completed 상태를 폴링으로 추적하여 UI에 실시간 진행률을 노출",
            },
            {
              title: "Capabilities 기반 범용 피처 플래그",
              description:
                "Capabilities 객체로 웹 검색·이미지 생성·문서 검색 등 도구를 제어하여, 코드 변경 없이 챗봇별 기능 조합을 지원",
            },
          ],
          mermaidDiagram: `graph TD
    A["파일 업로드\\n(PDF / Excel)"] --> B["텍스트 추출"]
    B --> C["청크 분할\\n(오버랩 포함)"]
    C --> D["OpenAI 임베딩"]
    D --> E["pgvector 저장"]
    A --> F["상태: pending"]
    F --> G["상태: processing"]
    G --> H["상태: completed"]
    H --> I["폴링 응답\\n→ UI 진행률"]

    subgraph "비동기 파이프라인"
      B
      C
      D
      E
    end

    subgraph "폴링 기반 상태 추적"
      F
      G
      H
      I
    end

    style A fill:#6b7280,stroke:#4b5563,color:#fff
    style B fill:#4f46e5,stroke:#4338ca,color:#fff
    style C fill:#4f46e5,stroke:#4338ca,color:#fff
    style D fill:#7c3aed,stroke:#6d28d9,color:#fff
    style E fill:#16a34a,stroke:#15803d,color:#fff
    style F fill:#d97706,stroke:#b45309,color:#fff
    style G fill:#d97706,stroke:#b45309,color:#fff
    style H fill:#16a34a,stroke:#15803d,color:#fff
    style I fill:#059669,stroke:#047857,color:#fff`,
          screenshots: [
            {
              src: "/images/portfolio/flow-ai/flowai-chatbot-sample-1.png",
              alt: "챗봇 생성 설정",
              caption:
                "Capabilities(웹 검색, 플로우 검색, 이미지 생성, 문서 검색) 및 프로젝트 연결 설정 UI",
            },
            {
              src: "/images/portfolio/flow-ai/flowai-chatbot-sample-2.png",
              alt: "챗봇 목록 및 편집",
              caption: "생성된 챗봇 목록과 편집 모달 화면",
            },
            {
              src: "/images/portfolio/flow-ai/flowai-chatbot-sample-3.png",
              alt: "챗봇 연결 데이터",
              caption: "챗봇에 연결된 PDF 파일·프로젝트 데이터 목록 확인",
            },
          ],
        },
        {
          title: "챗봇 대화 — RAG + Flow Search 하이브리드 검색",
          designs: [
            {
              title: "RAG → Flow Search 조건부 전환",
              description:
                "Flow 프로젝트 연결 시 벡터 기반 RAG에서 Flow Search 그래프를 통합한 실시간 검색으로 자동 전환",
            },
            {
              title: "프롬프트 빌더 패턴",
              description:
                "프롬프트 체계를 빌더 패턴으로 재설계하여 역할·컨텍스트·제약 조건의 조합을 모듈화",
            },
          ],
          mermaidDiagram: `graph TD
    A["사용자 질문"] --> B["요청 분석"]
    B -->|"검색 필요"| C{"검색 타입?"}
    B -->|"검색 불필요"| G["응답 생성"]
    C -->|"VECTOR"| D["RAG 벡터 검색"]
    C -->|"FLOW"| E["Flow Search 그래프"]
    C -->|"BOTH"| D
    C -->|"BOTH"| E
    D --> F["검색 결과 검증"]
    E --> F
    F -->|"유효"| G
    F -->|"재시도"| C

    style A fill:#6b7280,stroke:#4b5563,color:#fff
    style B fill:#4f46e5,stroke:#4338ca,color:#fff
    style C fill:#7c3aed,stroke:#6d28d9,color:#fff
    style D fill:#d97706,stroke:#b45309,color:#fff
    style E fill:#d97706,stroke:#b45309,color:#fff
    style F fill:#4f46e5,stroke:#4338ca,color:#fff
    style G fill:#16a34a,stroke:#15803d,color:#fff`,
          screenshots: [
            {
              src: "/images/portfolio/flow-ai/flowai-chatbot-sample-4.png",
              alt: "챗봇 RAG 답변",
              caption: "RAG 기반 답변과 출처 하이라이팅이 포함된 챗봇 대화",
            },
            {
              src: "/images/portfolio/flow-ai/flowai-chatbot-sample-5.png",
              alt: "챗봇 출처 상세",
              caption: "출처 패널에서 원문 하이라이팅과 상세 정보 확인",
            },
          ],
        },
      ],
      stats: [
        { label: "챗봇 누적 처리", value: "200건", type: "text" },
        { label: "완료율", value: 94.5, suffix: "%", type: "progress" },
        {
          label: "범용 피처 플래그",
          value: "Capabilities 기반 코드 변경 최소화",
          type: "text",
        },
      ],
    },
    {
      id: "deep-think",
      title: "Deep Think — 계획 기반 멀티 에이전트 오케스트레이션",
      roles: ["단독 설계/구현", "Full Stack"],
      problem:
        "복잡한 요청을 단계별 Todo로 분해하고 Sub Agent에 위임하기 위해 LangChain/Deepagents의 todoListMiddleware와 subagentMiddleware를 검토했으나, Todo와 Agent 간 명시적 1:1 매핑을 지원하는 필드 자체가 존재하지 않아 실행 결과를 정확히 추적할 수 없었습니다.",
      designs: [
        {
          title: "Plan → Orchestration → Response 3단계 파이프라인",
          description:
            "자체 LangGraph 그래프를 설계하여 계획 수립 → 실행 오케스트레이션 → 결과 통합 응답의 명확한 3단계 흐름을 구성",
        },
        {
          title: "도구 호출 ID 기반 1:1 매핑",
          description:
            "Todo 생성 시 발급되는 도구 호출 ID를 단일 키로 사용하여 Todo↔Sub Agent 매핑 오류를 원천 차단",
        },
        {
          title: "단계 간 순차 · 단계 내 병렬 실행",
          description:
            "Orchestration 노드에서 단계를 순서대로 실행하되, 동일 단계 내의 Sub Agent는 병렬로 동시 실행하여 처리 속도를 최적화",
        },
      ],
      mermaidDiagram: `graph TD
    A["사용자 요청"] --> B["Plan 노드\\n(Todo 생성)"]
    B --> C["Orchestration 노드"]
    C --> D["Step 1"]
    D --> D1["SubAgent A"]
    D --> D2["SubAgent B"]
    D1 --> E["Step 2"]
    D2 --> E
    E --> E1["SubAgent C"]
    E1 --> F["Response 노드\\n(결과 통합)"]

    subgraph "Todo 1:1 매핑"
      D1
      D2
      E1
    end

    style A fill:#6b7280,stroke:#4b5563,color:#fff
    style B fill:#4f46e5,stroke:#4338ca,color:#fff
    style C fill:#7c3aed,stroke:#6d28d9,color:#fff
    style D fill:#d97706,stroke:#b45309,color:#fff
    style D1 fill:#f59e0b,stroke:#d97706,color:#000
    style D2 fill:#f59e0b,stroke:#d97706,color:#000
    style E fill:#d97706,stroke:#b45309,color:#fff
    style E1 fill:#f59e0b,stroke:#d97706,color:#000
    style F fill:#16a34a,stroke:#15803d,color:#fff`,
      screenshots: [
        {
          src: "/images/portfolio/flow-ai/flowai-deepthink-sample-1.png",
          alt: "Deep Think 계획 수립 및 실행",
          caption: "Plan 노드가 Todo를 생성하고 SubAgent가 병렬 실행되는 화면",
        },
        {
          src: "/images/portfolio/flow-ai/flowai-deepthink-sample-2.png",
          alt: "Deep Think 최종 결과",
          caption: "계획 수립 → 실행 → 통합 응답이 완료된 최종 결과",
        },
      ],
      stats: [
        {
          label: "멀티스텝 요청 안정 처리",
          value: "Plan-Orchestration-Response 3단계",
          type: "text",
        },
        {
          label: "Todo 단위 투명한 진행 상태",
          value: "SSE 실시간 전달",
          type: "text",
        },
      ],
    },
    {
      id: "citation",
      title: "출처(Citation) 시스템 — 이종 소스 통합 인용 체계",
      roles: ["단독 설계/구현", "Frontend"],
      problem:
        "AI 응답에 포함된 인용 소스(웹 검색·Flow 검색·RAG 벡터)를 인라인 출처 칩으로 표시하고, 클릭 시 카드 확장과 원문 하이라이팅을 제공해야 했습니다. SSE 스트리밍 중에도 출처 클릭이 안정적으로 동작해야 하며, 이종 출처를 단일 인터페이스로 통합하는 설계가 필요했습니다.",
      designs: [
        {
          title: "Zustand 스토어 기반 단일 데이터 소스",
          description:
            "출처 데이터를 채팅 스토어에 즉시 등록하여, 스트리밍 진행 중에도 패널이 안정적으로 참조 가능하도록 설계",
        },
        {
          title: "칩 인덱스 우선 + URL 순번 보조 식별",
          description:
            "동일 URL에서 생성된 다중 칩을 구분하기 위해 칩 인덱스를 기본 키, URL 순번을 보조 키로 사용",
        },
        {
          title: "출처 타입별 모듈 분리",
          description:
            "Web 검색·RAG·Flow 검색 출처를 타입별 독립 모듈로 분리하고, 색상·제목·아이콘 매핑을 통일",
        },
      ],
      mermaidDiagram: `graph LR
    A["AI 응답 스트림"] --> B["인라인 칩 삽입\\n[1] [2] [3]"]
    B --> C["출처 스토어\\n(Zustand)"]
    C --> D["출처 카드 패널"]
    D --> E["하이라이팅"]

    subgraph "출처 타입"
      W["Web 검색"]
      F["Flow 검색"]
      V["RAG 벡터"]
    end

    W --> C
    F --> C
    V --> C

    style A fill:#6b7280,stroke:#4b5563,color:#fff
    style B fill:#4f46e5,stroke:#4338ca,color:#fff
    style C fill:#7c3aed,stroke:#6d28d9,color:#fff
    style D fill:#d97706,stroke:#b45309,color:#fff
    style E fill:#16a34a,stroke:#15803d,color:#fff
    style W fill:#3b82f6,stroke:#2563eb,color:#fff
    style F fill:#f59e0b,stroke:#d97706,color:#000
    style V fill:#8b5cf6,stroke:#7c3aed,color:#fff`,
      screenshots: [
        {
          src: "/images/portfolio/flow-ai/flowai-reference-sample-1.png",
          alt: "출처 패널 - Flow 검색",
          caption: "Flow 검색 결과의 인라인 칩과 출처 카드 패널 (웹·Flow·RAG 통합)",
        },
        {
          src: "/images/portfolio/flow-ai/flowai-reference-sample-2.png",
          alt: "출처 패널 - 하이라이팅",
          caption: "출처 클릭 시 원문 하이라이팅과 상세 정보 표시",
        },
      ],
      stats: [
        {
          label: "이종 출처 통합",
          value: "Web + Flow + RAG 단일 인터페이스",
          type: "text",
        },
        {
          label: "스트리밍 안정성",
          value: "스트리밍 중/후 모두 클릭 안정 동작",
          type: "text",
        },
      ],
    },
  ],
  challenge: {
    title: "실시간 마크다운 렌더링 CPU 부하 최적화",
    beforeImage: "/images/recap/2025/flowai-cpu-sample1.png",
    afterImage: "/images/recap/2025/flowai-cpu-sample2.png",
    problem:
      "AI 응답의 실시간 마크다운 렌더링 과정에서 브라우저 CPU 사용률이 70~100%까지 급등하는 현상을 발견했습니다. react-markdown이 SSE 청크가 도착할 때마다 전체 마크다운을 재파싱하고, React Virtual DOM을 재생성하며, 전체 DOM 트리를 리렌더링하고 있었습니다.",
    analysis:
      "Chrome DevTools Performance 탭의 Flame Chart 분석을 통해 원인을 특정했습니다. 단일 AI 응답 스트리밍 중 수백 회의 풀 리렌더링이 발생하는 구조적 문제를 6단계에 걸쳐 체계적으로 분석했습니다.",
    solution:
      "하이브리드 렌더링 아키텍처를 설계했습니다. 스트리밍 진행 중에는 marked.js로 마크다운을 HTML 문자열로 변환 후 innerHTML로 직접 주입하여 React 리렌더링을 완전히 우회하고, 스트리밍 완료 후 이벤트 핸들러가 바인딩된 react-markdown 컴포넌트로 교체하는 2단계 전환 구조입니다.",
    results: [
      { label: "CPU 부하", before: "70-100%", after: "20-30%" },
      { label: "FPS", before: "20", after: "55" },
    ],
  },
  summaryFeatures: [
    {
      id: "memory",
      title: "대화 메모리 시스템",
      description:
        "20개 단위 배치 증분 요약을 생성하고, 최근 N개 메시지는 원문을 유지하는 메모리 번들 구조를 설계. LLM 장애 시 fallback 로직으로 서비스 연속성을 보장합니다.",
      techTags: ["NestJS", "Prisma", "LLM"],
      stat: { label: "토큰 절감", value: "증분 요약 기반 맥락 보존" },
    },
    {
      id: "etl",
      title: "ETL 모듈 — Excel 파싱 파이프라인",
      description:
        "DFS 기반 병합 셀 추출 알고리즘으로 실무 Excel 파일을 JSON/테이블로 안정 변환. 병합 셀 값 복원, 사각형 테이블 추출, Zod 기반 검증 서비스를 분리 설계했습니다.",
      techTags: ["NestJS", "xlsx", "Zod"],
      stat: { label: "문서 파싱", value: "507건" },
      screenshot: {
        src: "/images/portfolio/flow-ai/flowai-etl-excel-sample-1.png",
        alt: "엑셀 파싱 미리보기",
        caption: "병합 셀이 포함된 Excel 파일을 테이블로 변환한 미리보기",
      },
    },
    {
      id: "share",
      title: "공유 시스템 및 Flow Search Embed",
      description:
        "범용 Share 엔티티·API를 설계하여 채팅·메시지·코드블럭 단위의 공유와 권한 제어를 구현. Flow 부모 페이지에서 iframe/웹뷰 기반 Flow Search Embed를 지원합니다.",
      techTags: ["NestJS", "Next.js", "CORS"],
      stat: { label: "공유 처리", value: "54건" },
    },
    {
      id: "web-search",
      title: "에이전트 외부 검색 API",
      description:
        "일반 대화와 에이전트 모드 양방향에서 웹 검색을 연동하는 API를 설계. 외부 검색 결과를 출처 시스템과 통합하여 인라인 출처로 제공합니다.",
      techTags: ["NestJS", "LangChain"],
      stat: { label: "검색 처리", value: "2,947회" },
    },
  ],
  overallStats: [
    { label: "전체 처리", value: 30904, suffix: "건", type: "countup" },
    { label: "사용 인원", value: 7519, suffix: "명", type: "countup" },
    { label: "사용 기업", value: 2141, suffix: "개", type: "countup" },
    { label: "Flow Search 비중", value: 43.4, suffix: "%", type: "progress" },
    { label: "일반 채팅 완료율", value: 96.95, suffix: "%", type: "progress" },
    { label: "챗봇 완료율", value: 94.5, suffix: "%", type: "progress" },
  ],
  adoptionCompanies: [
    "웹케시 그룹 (전사 도입)",
    "BGF (전사 도입, 부분 기능)",
    "주식회사 아이씨비 (전사 ULTRA 플랜 도입)",
    "각종 기업 도입 문의, 계약 진행 중",
  ],
  timeline: [
    {
      month: "2025.06",
      title: "AI TFT 발족",
      description: "대표 직속 AI 태스크포스 구성, 기술 스택 선정 및 첫 커밋",
      highlight: true,
    },
    {
      month: "2025.07",
      title: "LangChain 기반 구축",
      description: "Tool Calling·bindTools()·Zod Schema 학습, 첫 프로토타입 구현",
      commits: 120,
    },
    {
      month: "2025.08",
      title: "RAG 비서 개발",
      description: "pgvector 벡터 검색, 문서 임베딩 파이프라인, 출처 시스템 초기 구현",
      commits: 177,
    },
    {
      month: "2025.09",
      title: "핵심 기능 확립",
      description: "AI 비서 안정화, GeneralChatWorkflow 구현, 서비스 코드 비중 확립",
      commits: 299,
      highlight: true,
    },
    {
      month: "2025.10",
      title: "성능 위기 돌파",
      description: "CPU 부하 70-100% 이슈 발견 → 하이브리드 렌더링 아키텍처로 해결",
    },
    {
      month: "2025.11",
      title: "아키텍처 전환",
      description: "createAgent 기반 에이전트 시스템으로 전면 마이그레이션",
      highlight: true,
    },
    {
      month: "2025.12 ~ 2026.01",
      title: "기능 완성",
      description: "Flow Search·Deep Think·챗봇 v2·파일 파이프라인 구현 완료",
    },
    {
      month: "2026.02",
      title: "정식 오픈",
      description: "2.23 대고객 런칭, 웹케시 그룹·BGF 전사 도입",
      highlight: true,
    },
  ],
  links: {
    recap: "/posts/road_to_carefree_life_2025",
    github: "https://github.com/Carefreelife98",
    linkedin: "https://www.linkedin.com/in/carefreelife98",
    email: "csm12180318@gmail.com",
  },
}
