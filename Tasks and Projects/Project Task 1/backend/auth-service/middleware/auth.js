const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");
const jwkToPem = require("jwk-to-pem");

const publicKey = {
  alg: "RS256",
  e: "AQAB",
  kid: "KzHq7J3OU+I1yIX7p2Zy1Qm1o6Y=",
  kty: "RSA",
  n: "qOgkMoEtgFvSsjXGDgn8trLtTnz1myOQ_5RAA4PFm5px01vIP35fl_QdSi7SGJg7zshsrGOKZqMp96clCSiVGCsaxQT88z2TemMVgJuzw-eTgVT0aucId-51wBc8NaS_VyBL7Ixn1HJC9U4llvUPb6HnhGh4AVqv1UPBkKUWCEQ0Z220zI348Svti_o2JgRKqbfkTwi6t81pWpOBdL-XP83-lu3KUPgI11v3riNSUpI01mZrNGM_IueNkgoPAJJQ9TqdZtico6h1QC01LR35V8M5LcRQephBzf7-jWWJwPTD-fqxb4s4NGXDF61mpwUrdCuIl7boWJxAT_gHBomhWw",
  use: "sig",
};

const publicKeyPem = jwkToPem(publicKey);

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") return next();
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return next(new HttpError("Auth", 502));
    }

    const [keycloakToken, userId] = token.split("+");
    const decodedToken = jwt.verify(keycloakToken, publicKeyPem, {
      algorithms: ["RS256"],
    });

    const userType = decodedToken.realm_access.roles.includes("TEACHER")
      ? "TEACHER"
      : "STUDENT";

    const userData = {
      userId,
      userName: decodedToken.preferred_username,
      userType,
    };

    req.userData = userData;
    next();
  } catch (error) {
    return next(new HttpError("Authentication failed", 401));
  }
};
