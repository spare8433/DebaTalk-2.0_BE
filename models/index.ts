import User , { associate as associateUser } from './user';
import DebatePost , { associate as associateDebatePost } from './debatePost';
import Opinion , { associate as associateOpinion } from './opinion';
import Comment , { associate as associateComment } from './comment';
import Reply , { associate as associateReply } from './reply';
import CommunityPost , { associate as associateCommunityPost } from './communityPost';
import CommunityPostLike , { associate as associateCommunityPostLike } from './communityPostLike';


export * from './sequelize';

const db = {
  User,
  DebatePost,
  Opinion,
  Comment,
  Reply,
  CommunityPost,
  CommunityPostLike
};

export type dbType = typeof db;

associateUser(db)
associateDebatePost(db)
associateOpinion(db)
associateComment(db)
associateReply(db)
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
