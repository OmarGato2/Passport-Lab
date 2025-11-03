import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUserByEmailIdAndPassword, getUserById } from "../../controllers/userController";
import { PassportStrategy } from '../../interfaces/index';
import { User } from "../../models/userModel";

const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: false,
  },
  (email: string, password: string, done: any) => {
    try {
      const user = getUserByEmailIdAndPassword(email, password);
      if (user) {
        return done(null, user);
      } 
      
      else {
        return done(null, false, { message: "Your login details are not valid. Please try again" });
      }
    } 
    
    catch (err) {
      return done(err);
    }
  }
);

passport.serializeUser(function (user: any, done: any) {
  done(null, user.id);
});

passport.deserializeUser(function (id: number, done: any) {
  try {
    let user = getUserById(id);
    if (user) {
      done(null, user);
    } 
    
    else {
      done(new Error("User not found"), null);
    }
  } 
  
  catch (err) {
    done(err, null);
  }
});

const passportLocalStrategy: PassportStrategy = {
  name: 'local',
  strategy: localStrategy,
};

export default passportLocalStrategy;
