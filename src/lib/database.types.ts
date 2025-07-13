export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)";
  };
  public: {
    Tables: {
      articles: {
        Row: {
          category_id: string;
          content: string;
          created_at: string | null;
          excerpt: string | null;
          id: string;
          images: string[] | null;
          likes: number | null;
          meta_description: string | null;
          meta_title: string | null;
          published_at: string | null;
          region: string | null;
          slug: string;
          status: string | null;
          title: string;
          updated_at: string | null;
          views: number | null;
        };
        Insert: {
          category_id: string;
          content: string;
          created_at?: string | null;
          excerpt?: string | null;
          id?: string;
          images?: string[] | null;
          likes?: number | null;
          meta_description?: string | null;
          meta_title?: string | null;
          published_at?: string | null;
          region?: string | null;
          slug: string;
          status?: string | null;
          title: string;
          updated_at?: string | null;
          views?: number | null;
        };
        Update: {
          category_id?: string;
          content?: string;
          created_at?: string | null;
          excerpt?: string | null;
          id?: string;
          images?: string[] | null;
          likes?: number | null;
          meta_description?: string | null;
          meta_title?: string | null;
          published_at?: string | null;
          region?: string | null;
          slug?: string;
          status?: string | null;
          title?: string;
          updated_at?: string | null;
          views?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "articles_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      categories: {
        Row: {
          color: string | null;
          created_at: string | null;
          description: string | null;
          icon: string | null;
          id: string;
          is_active: boolean | null;
          name: string;
          slug: string;
          sort_order: number | null;
          updated_at: string | null;
        };
        Insert: {
          color?: string | null;
          created_at?: string | null;
          description?: string | null;
          icon?: string | null;
          id?: string;
          is_active?: boolean | null;
          name: string;
          slug: string;
          sort_order?: number | null;
          updated_at?: string | null;
        };
        Update: {
          color?: string | null;
          created_at?: string | null;
          description?: string | null;
          icon?: string | null;
          id?: string;
          is_active?: boolean | null;
          name?: string;
          slug?: string;
          sort_order?: number | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      shares: {
        Row: {
          anonymous_id: string | null;
          article_id: string;
          id: string;
          platform: string;
          referrer: string | null;
          shared_at: string | null;
          user_agent: string | null;
        };
        Insert: {
          anonymous_id?: string | null;
          article_id: string;
          id?: string;
          platform: string;
          referrer?: string | null;
          shared_at?: string | null;
          user_agent?: string | null;
        };
        Update: {
          anonymous_id?: string | null;
          article_id?: string;
          id?: string;
          platform?: string;
          referrer?: string | null;
          shared_at?: string | null;
          user_agent?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "shares_article_id_fkey";
            columns: ["article_id"];
            isOneToOne: false;
            referencedRelation: "articles";
            referencedColumns: ["id"];
          }
        ];
      };
      subscriptions: {
        Row: {
          created_at: string | null;
          email: string;
          is_active: boolean | null;
          is_verified: boolean | null;
          subscribed_at: string | null;
          subscribed_categories: string[] | null;
          unsubscribed_at: string | null;
          updated_at: string | null;
          verification_token: string | null;
          verified_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          is_active?: boolean | null;
          is_verified?: boolean | null;
          subscribed_at?: string | null;
          subscribed_categories?: string[] | null;
          unsubscribed_at?: string | null;
          updated_at?: string | null;
          verification_token?: string | null;
          verified_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          is_active?: boolean | null;
          is_verified?: boolean | null;
          subscribed_at?: string | null;
          subscribed_categories?: string[] | null;
          unsubscribed_at?: string | null;
          updated_at?: string | null;
          verification_token?: string | null;
          verified_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      article_share_stats: {
        Row: {
          article_id: string | null;
          platform: string | null;
          share_count: number | null;
          share_date: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "shares_article_id_fkey";
            columns: ["article_id"];
            isOneToOne: false;
            referencedRelation: "articles";
            referencedColumns: ["id"];
          }
        ];
      };
      article_total_shares: {
        Row: {
          article_id: string | null;
          platforms_count: number | null;
          total_shares: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "shares_article_id_fkey";
            columns: ["article_id"];
            isOneToOne: false;
            referencedRelation: "articles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;

// 추가 타입 정의들
export type Article = Tables<"articles">;
export type Category = Tables<"categories">;
export type Subscription = Tables<"subscriptions">;
export type Share = Tables<"shares">;

// Insert 타입들
export type ArticleInsert = TablesInsert<"articles">;
export type CategoryInsert = TablesInsert<"categories">;
export type SubscriptionInsert = TablesInsert<"subscriptions">;
export type ShareInsert = TablesInsert<"shares">;

// Update 타입들
export type ArticleUpdate = TablesUpdate<"articles">;
export type CategoryUpdate = TablesUpdate<"categories">;
export type SubscriptionUpdate = TablesUpdate<"subscriptions">;
export type ShareUpdate = TablesUpdate<"shares">;

// 조인된 타입들
export type ArticleWithCategory = Article & {
  category?: Category;
};
