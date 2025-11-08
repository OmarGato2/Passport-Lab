import type { Request } from "express";
import { Strategy as GitHubStrategy } from "passport-github2";
import { PassportStrategy } from "../../interfaces/index";
import { userModel } from "../../models/userModel";

const clientID = process.env.GITHUB_CLIENT_ID || "";
const clientSecret = process.env.GITHUB_CLIENT_SECRET || "";
const callbackURL = process.env.GITHUB_CALLBACK_URL || "/auth/github/callback";

const githubStrategy = new GitHubStrategy(
  {
    clientID,
    clientSecret,
    callbackURL,
    passReqToCallback: true,
  },
  async (req: Request, accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: Express.User | false, info?: any) => void
  ) => {
    try {
      const existing = userModel.findByGithubId(profile.id);
      if (existing) {
        return done(null, existing);
      }

      const newUser = userModel.createFromGithubProfile(profile);
      return done(null, newUser);
    } 
    
    catch (err) {
      return done(err);
    }
  }
);

const passportGitHubStrategy: PassportStrategy = {
  name: "github",
  strategy: githubStrategy,
};

export { passportGitHubStrategy };
