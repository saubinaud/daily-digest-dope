
export interface Article {
  rank: number;
  title: string;
  summary: string;
  context: string;
  reliability: number;
}

export interface Category {
  insight: string;
  articles: Article[];
}

export interface NewsDigest {
  date: string;
  categories: {
    IA: Category;
    Marketing: Category;
    Bolsa: Category;
    Internacional: Category;
  };
}

export type CategoryName = keyof NewsDigest['categories'];

export type AppStep = 'welcome' | 'carousel' | 'category';
