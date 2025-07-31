// the purpose of this is, this will be used to verify the jwt tokens each time the user trie ot access info
// that being sensitive info
const jwt = require("jsonwebtoken");
const { PropertyError } = require("../exceptions/PropertyError.js");
function protected(req, res, next) {
  // first we need to validate if the req contains the jwt, if it does, then we verify it, else we bounce it back
  const token = req.headers.authorization;
  if (!token) {
    throw new PropertyError(["Bearer"]);
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Unauthorized access" });
  }
}
