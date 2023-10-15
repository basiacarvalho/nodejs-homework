const passport = require("passport");

const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (!user || err || !user.verify) {
      return res.status(401).send();
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = auth;
