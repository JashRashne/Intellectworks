import * as admin from 'firebase-admin';
// import { Request, Response, NextFunction } from 'express';


const validateFirebaseIdToken = async (req: any, res: any, next: any) => {
  console.log("Check if request is authorized with Firebase ID token");

  // Check for Authorization header or __session cookie
  if (
    (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) &&
    !(req.cookies && req.cookies.__session)
  ) {
    console.error(
      "No Firebase ID token was passed as a Bearer token in the Authorization header.",
      "Make sure you authorize your request by providing the following HTTP header:",
      "Authorization: Bearer <Firebase ID Token>",
      'or by passing a "__session" cookie.'
    );
    res.status(403).send("Unauthorized");
    return;
  }

  let idToken: string | undefined;

  // If Authorization header exists
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    console.log('Found "Authorization" header');
    idToken = req.headers.authorization.split("Bearer ")[1];
  } 
  // If __session cookie exists
  else if (req.cookies && req.cookies.__session) {
    console.log('Found "__session" cookie');
    idToken = req.cookies.__session;
  } else {
    // No cookie or Authorization header found
    res.status(403).send("Unauthorized");
    return;
  }

  try {
    if (!idToken) {
      throw new Error('ID token is missing');
    }

    // Verify the ID token with Firebase
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    console.log("ID Token correctly decoded", decodedIdToken);

    // Attach decoded token to the request object
    req.user = decodedIdToken;

    // Proceed to the next middleware/handler
    next();
  } catch (error) {
    console.error("Error while verifying Firebase ID token:", error);
    res.status(403).send("Unauthorized");
    return;
  }
};

export default validateFirebaseIdToken;
