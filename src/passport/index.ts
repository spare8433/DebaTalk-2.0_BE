
import passport from 'passport';
import User from '../models/user';
import local from './local';

export default () => {
  passport.serializeUser((user, done) => {
    console.log('초기로그인', user.id);
    done(null, user.id);
  });

  passport.deserializeUser(async (id:number, done) => {
    console.log('로그인 유지 중', id);
    try {
      const user = await User.findOne({
        where: { id },
      });
      
      if (!user) {
        return done(new Error('no user'));
      }
      return done(null, user); // req.user
    } catch (err) {
      console.error(err);
      return done(err);
    }
  });

  local();
}