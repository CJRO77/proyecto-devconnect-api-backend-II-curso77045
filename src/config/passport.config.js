import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { loginUserService, createUserService,currentUserService } from "../services/users.service.js";

// extraer el token de la cookie

const cookieExtractor = (req) => {
  if (req && req.cookies) {
    return req.cookies["currentUser"];
  }
  return null;
};

const initializePassport = () => {

  passport.use("login", new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await loginUserService(email, password);
        return done(null, user);
      } catch (error) {
        return done(null, false, {
          message: error.message
        });
      }
    }
  ));

  passport.use("register", new LocalStrategy(
    {
      usernameField: 'email',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const user = await createUserService(req.body);
        return done(null, user);
      } catch (error) {
        return done(null, false, {
          message: error.message
        });
      }
    }
  ));

};

passport.use(
    "current",
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([
                cookieExtractor
            ]),
            secretOrKey: process.env.JWT_SECRET,
        },
        async (payload, done) => {

            try {

                const user = await currentUserService(payload.id);

                return done(null, user);

            } catch (error) {

                return done(error, false);

            }

        }
    )
);


export default initializePassport;