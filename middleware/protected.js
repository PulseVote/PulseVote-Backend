// the purpose of this is, this will be used to verify the jwt tokens each time the user trie ot access info
// that being sensitive info
const jwt = require("jsonwebtoken");
const { PropertyError } = require("../exceptions/PropertyError.js");
function protected(req, res, next) {
  // first we need to validate if the req contains the jwt, if it does, then we verify it, else we bounce it back
  const token = req.Header.Bearer;
  if (token == null) {
    throw new PropertyError(["Bearer"]);
  }

  const verified = jwt.verify(token, process.env.SECRET);
  if (!verified) {
    return res.status(401).json({ message: "Unauthorized access" });
  }
  res
    .status(201)
    .json({ message: "You may now access the appropriate resources" });

  next();
}
