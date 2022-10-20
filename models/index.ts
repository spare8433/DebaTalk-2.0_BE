import User, { associate as associateUser } from './user';
import DebatePost, { associate as associateDebatePost } from './debatePost';
import BalanceDebatePost, { associate as associateBalanceDebatePost } from './balanceDebatePost';
import IssueDebatePost, { associate as associateIssueDebatePost } from './issueDebatePost';
import ProsConsDebatePost, { associate as associateProsConsDebatePost } from './prosConsDebatePost';


import Opinion, { associate as associateOpinion } from './opinion';
import BalanceOpinion, { associate as associateBalanceOpinion } from './balanceOpinion';

import Comment, { associate as associateComment } from './comment';

import Reply, { associate as associateReply } from './reply';
import BalanceReply, { associate as associateBalanceReply } from './balanceReply';

import CommunityPost, { associate as associateCommunityPost } from './communityPost';
import CommunityPostLike, { associate as associateCommunityPostLike } from './communityPostLike';


export * from './sequelize';

const db = {
  User,
  DebatePost,
  Opinion,
  Comment,
  Reply,
  CommunityPost,
  CommunityPostLike,
  BalanceDebatePost,
  BalanceOpinion,
  BalanceReply,

  IssueDebatePost,

  ProsConsDebatePost,
};

export type dbType = typeof db;

associateUser(db)
associateDebatePost(db)
associateBalanceDebatePost(db)
associateIssueDebatePost(db)
associateProsConsDebatePost(db)

associateOpinion(db)
associateBalanceOpinion(db)
associateComment(db)
associateReply(db)
associateBalanceReply(db)
associateCommunityPost(db)
associateCommunityPostLike(db)

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
