## FSD 구조

apps/web/src/
├── shared/ # 공유 레이어
│ ├── ui/ # shadcn/ui 컴포넌트
│ ├── lib/ # 유틸리티 (utils, posts, analytics)
│ ├── hooks/ # 공용 훅 (use-mobile)
│ ├── config/ # 설정 (site, categories, analytics)
│ └── icons/ # 아이콘 (Logo, CategoryIcons)
│
├── features/ # 기능 레이어
│ ├── analytics/ # GA4 분석 기능
│ ├── post/ # 포스트 관련 UI
│ ├── search/ # 검색 다이얼로그
│ └── sidebar/ # 사이드바 컴포넌트
│
└── widgets/ # 위젯 레이어
├── header/ # 블로그 헤더
└── main-section/ # 메인 페이지 섹션

## Path Aliases (tsconfig.json)

- @shared/_ → ./src/shared/_
- @features/_ → ./src/features/_
- @widgets/_ → ./src/widgets/_

## FSD Import 규칙

- 허용: app → widgets → features → shared
- 금지: 역방향 의존성, 내부 구현 직접 import
