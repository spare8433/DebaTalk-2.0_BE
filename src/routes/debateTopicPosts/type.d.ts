export type GetPostsRequestBody = readonly {
  readonly category?: string;
  readonly searchText?: string;
  readonly limit?: number;
  readonly page?: number;
  readonly key?: "createdAt" | "hits";
  readonly order?: "DESC" | "ASC";
};
