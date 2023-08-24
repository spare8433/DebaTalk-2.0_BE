export type CreatePostRequestData = readonly {
  readonly category: string;
  readonly title: string;
  readonly optionA: string;
  readonly optionB: string;
  readonly description: string;
  readonly issue1: string;
  readonly issue2: string;
  readonly article: string[];
};
export type CreateOpinionRequestBody = readonly {
  readonly postId: number;
  readonly selection: "A" | "B";
  readonly content: string;
};

export type CreateReplyRequestBody = readonly {
  readonly opinionId: number;
  readonly content: string;
  readonly writerId: number;
  readonly targetId: number;
};

export type GetPostRequestQuerry = readonly {
  readonly postId: string;
};
