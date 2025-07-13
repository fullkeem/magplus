// 데이터베이스 타입 정의

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string | null;
          images: string[];
          category_id: string;
          region: string | null;
          views: number;
          likes: number;
          status: "draft" | "published";
          meta_title: string | null;
          meta_description: string | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          excerpt?: string | null;
          images?: string[];
          category_id: string;
          region?: string | null;
          views?: number;
          likes?: number;
          status?: "draft" | "published";
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          excerpt?: string | null;
          images?: string[];
          category_id?: string;
          region?: string | null;
          views?: number;
          likes?: number;
          status?: "draft" | "published";
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      subscriptions: {
        Row: {
          email: string;
          is_active: boolean;
          is_verified: boolean;
          subscribed_categories: string[];
          verification_token: string | null;
          subscribed_at: string;
          unsubscribed_at: string | null;
          verified_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          email: string;
          is_active?: boolean;
          is_verified?: boolean;
          subscribed_categories?: string[];
          verification_token?: string | null;
          subscribed_at?: string;
          unsubscribed_at?: string | null;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          is_active?: boolean;
          is_verified?: boolean;
          subscribed_categories?: string[];
          verification_token?: string | null;
          subscribed_at?: string;
          unsubscribed_at?: string | null;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      shares: {
        Row: {
          id: string;
          article_id: string;
          platform:
            | "facebook"
            | "twitter"
            | "kakao"
            | "instagram"
            | "naver"
            | "clipboard"
            | "other";
          anonymous_id: string | null;
          shared_at: string;
          user_agent: string | null;
          referrer: string | null;
        };
        Insert: {
          id?: string;
          article_id: string;
          platform:
            | "facebook"
            | "twitter"
            | "kakao"
            | "instagram"
            | "naver"
            | "clipboard"
            | "other";
          anonymous_id?: string | null;
          shared_at?: string;
          user_agent?: string | null;
          referrer?: string | null;
        };
        Update: {
          id?: string;
          article_id?: string;
          platform?:
            | "facebook"
            | "twitter"
            | "kakao"
            | "instagram"
            | "naver"
            | "clipboard"
            | "other";
          anonymous_id?: string | null;
          shared_at?: string;
          user_agent?: string | null;
          referrer?: string | null;
        };
      };
    };
    Views: {
      article_share_stats: {
        Row: {
          article_id: string;
          platform: string;
          share_count: number;
          share_date: string;
        };
      };
      article_total_shares: {
        Row: {
          article_id: string;
          total_shares: number;
          platforms_count: number;
        };
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// 편의 타입들
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Article = Database["public"]["Tables"]["articles"]["Row"];
export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
export type Share = Database["public"]["Tables"]["shares"]["Row"];

export type ArticleWithCategory = Article & {
  category: Category;
};

export type ArticleShareStats =
  Database["public"]["Views"]["article_share_stats"]["Row"];
export type ArticleTotalShares =
  Database["public"]["Views"]["article_total_shares"]["Row"];

// 삽입용 타입들
export type CategoryInsert =
  Database["public"]["Tables"]["categories"]["Insert"];
export type ArticleInsert = Database["public"]["Tables"]["articles"]["Insert"];
export type SubscriptionInsert =
  Database["public"]["Tables"]["subscriptions"]["Insert"];
export type ShareInsert = Database["public"]["Tables"]["shares"]["Insert"];

// 업데이트용 타입들
export type CategoryUpdate =
  Database["public"]["Tables"]["categories"]["Update"];
export type ArticleUpdate = Database["public"]["Tables"]["articles"]["Update"];
export type SubscriptionUpdate =
  Database["public"]["Tables"]["subscriptions"]["Update"];
export type ShareUpdate = Database["public"]["Tables"]["shares"]["Update"];
