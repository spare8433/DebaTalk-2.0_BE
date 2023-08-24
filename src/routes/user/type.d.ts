export type SignUpParam = {
  readonly userId: string;
  readonly email: string;
  readonly nickname: string;
  readonly password: string;
};

export type LoginParam = {
  readonly userId: string;
  readonly password: string;
};

export type FindUserIdParam = {
  readonly email: string;
};

export type CreateCodeRequestBody = readonly {
  readonly userId?: string;
  readonly email?: string;
};

export type CheckCodeRequestBody = readonly {
  readonly UserId: number;
  readonly code: string;
};

export type UpdatePasswordRequestBody = readonly {
  readonly UserId: number;
  readonly password: string;
  readonly newPassword: string;
};

export type CheckDuplicateIdQuerry = readonly {
  readonly userId: string;
};

export type CheckDuplicateEmailQuerry = readonly {
  readonly email: string;
};
