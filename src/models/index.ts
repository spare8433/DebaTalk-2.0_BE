import User, { associate as associateUser } from './user';

import BalanceDebatePost, { associate as associateBalanceDebatePost } from './balanceDebatePost';
import IssueDebatePost, { associate as associateIssueDebatePost } from './issueDebatePost';
import ProsConsDebatePost, { associate as associateProsConsDebatePost } from './prosConsDebatePost';

import BalanceOpinion, { associate as associateBalanceOpinion } from './balanceOpinion';
import IssueOpinion, { associate as associateIssueOpinion } from './issueOpinion';
import ProsConsOpinion, { associate as associateProsConsOpinion } from './prosConsOpinion';

import BalanceReply, { associate as associateBalanceReply } from './balanceReply';
import IssueReply, { associate as associateIssueReply } from './issueReply';
import ProsConsReply, { associate as associateProsConsReply } from './prosConsReply';

import DebatePost, { associate as associateDebatePost } from './debatePost';
import Opinion, { associate as associateOpinion } from './opinion';
import Comment, { associate as associateComment } from './comment';
import Reply, { associate as associateReply } from './reply';

import CommunityPost, { associate as associateCommunityPost } from './communityPost';
import CommunityPostLike, { associate as associateCommunityPostLike } from './communityPostLike';


export * from './sequelize';

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

  // 추가될 수 있는 모델
  CommunityPost,
  CommunityPostLike,

  // legacy model
  DebatePost,
  Opinion,
  Comment,
  Reply,
};

export type dbType = typeof db;

associateUser(db)

associateBalanceDebatePost(db)
associateBalanceOpinion(db)
associateBalanceReply(db)

associateIssueDebatePost(db)
associateIssueOpinion(db)
associateIssueReply(db)

associateProsConsDebatePost(db)
associateProsConsOpinion
associateProsConsReply

// 추가될 모델
associateCommunityPost(db)
associateCommunityPostLike(db)

// legacy model
associateDebatePost(db)
associateOpinion(db)
associateComment(db)
associateReply(db)

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
