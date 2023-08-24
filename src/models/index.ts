import User, { associate as associateUser } from "./user";

import BalanceDebatePost, {
  associate as associateBalanceDebatePost,
} from "./balanceDebatePost";
import IssueDebatePost, {
  associate as associateIssueDebatePost,
} from "./issueDebatePost";
import ProsConsDebatePost, {
  associate as associateProsConsDebatePost,
} from "./prosConsDebatePost";
import DebateTopicPost, {
  associate as associateDebateTopicPost,
} from "./debateTopicPost";

import BalanceOpinion, {
  associate as associateBalanceOpinion,
} from "./balanceOpinion";
import IssueOpinion, {
  associate as associateIssueOpinion,
} from "./issueOpinion";
import ProsConsOpinion, {
  associate as associateProsConsOpinion,
} from "./prosConsOpinion";
import DebateTopicOpinion, {
  associate as associateDebateTopicOpinion,
} from "./debateTopicOpinion";

import BalanceReply, {
  associate as associateBalanceReply,
} from "./balanceReply";
import IssueReply, { associate as associateIssueReply } from "./issueReply";
import ProsConsReply, {
  associate as associateProsConsReply,
} from "./prosConsReply";
import DebateTopicReply, {
  associate as associateDebateTopicReply,
} from "./debateTopicReply";

import CommunityPost, {
  associate as associateCommunityPost,
} from "./communityPost";
import CommunityPostLike, {
  associate as associateCommunityPostLike,
} from "./communityPostLike";

import AuthCode, { associate as associateAuthCode } from "./authCode";

export * from "./sequelize";

const db = {
  User,

  BalanceDebatePost,
  BalanceOpinion,
  BalanceReply,

  IssueDebatePost,
  IssueOpinion,
  IssueReply,

  ProsConsDebatePost,
  ProsConsOpinion,
  ProsConsReply,

  DebateTopicPost,
  DebateTopicOpinion,
  DebateTopicReply,

  AuthCode,

  // 추가될 수 있는 모델
  CommunityPost,
  CommunityPostLike,
};

export type dbType = typeof db;

associateUser(db);

associateBalanceDebatePost(db);
associateBalanceOpinion(db);
associateBalanceReply(db);

associateIssueDebatePost(db);
associateIssueOpinion(db);
associateIssueReply(db);

associateProsConsDebatePost(db);
associateProsConsOpinion(db);
associateProsConsReply(db);

associateDebateTopicPost(db);
associateDebateTopicOpinion(db);
associateDebateTopicReply(db);

associateAuthCode(db);

// 추가될 모델
associateCommunityPost(db);
associateCommunityPostLike(db);

// console.log(Object.keys(db).map(v => {
//   if (db[v].associate) {
//     db[v].associate();
//   }
// }));

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate();
//   }
// });
