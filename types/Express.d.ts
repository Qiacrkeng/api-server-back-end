namespace Express {
  interface Auth {
    id?: number;
  }
  interface Request {
    auth?: Auth;
  }
}
