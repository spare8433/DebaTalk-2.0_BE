import User , { associate as asTest } from './user';

export * from './sequelize';

const db = {
  User,
};

console.log('index db', db);
export type dbType = typeof db;
console.log('index user', User);

console.log('associate 테스트',asTest);

asTest(db)


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
