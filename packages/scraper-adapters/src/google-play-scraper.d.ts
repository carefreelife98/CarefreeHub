declare module "google-play-scraper" {
  interface SearchResult {
    appId: string
    title: string
    score: number | null
    ratings: number | null
    installs: string | null
    genre: string | null
    summary: string | null
    icon: string | null
  }

  interface ReviewData {
    id: string
    text: string | null
    score: number | null
    thumbsUp: number | null
    date: string | null
  }

  interface ReviewResult {
    data: ReviewData[]
  }

  interface Sort {
    NEWEST: number
    RATING: number
    HELPFULNESS: number
  }

  interface AppDetail {
    appId: string
    title: string
    score: number | null
    ratings: number | null
    installs: string | null
    genre: string | null
    summary: string | null
    description: string | null
    icon: string | null
  }

  interface Collection {
    TOP_FREE: string
    TOP_PAID: string
    GROSSING: string
    TRENDING: string
  }

  interface Category {
    GAME: string
    GAME_ACTION: string
    GAME_CASUAL: string
    GAME_PUZZLE: string
    GAME_RACING: string
    GAME_ROLE_PLAYING: string
    GAME_SIMULATION: string
    GAME_STRATEGY: string
  }

  interface GooglePlayScraper {
    search(opts: {
      term: string
      num?: number
      lang?: string
      country?: string
    }): Promise<SearchResult[]>

    app(opts: { appId: string; lang?: string; country?: string }): Promise<AppDetail>

    list(opts: {
      collection?: string
      category?: string
      num?: number
      lang?: string
      country?: string
    }): Promise<SearchResult[]>

    reviews(opts: {
      appId: string
      num?: number
      sort?: number
      lang?: string
      country?: string
    }): Promise<ReviewResult>

    sort: Sort
    collection: Collection
    category: Category
  }

  const gplay: GooglePlayScraper
  export = gplay
}
