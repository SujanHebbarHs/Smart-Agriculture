const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const Register = require("../models/registers");
const auth = require("./auth");
console.log = jest.fn();

describe("auth middleware", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should set req.token, req.user, and res.locals based on a valid token", async () => {
    const req = {
      cookies: { jwt: "validToken" },
    };
    const res = {
      locals: {},
    };
    const next = sinon.spy();

    // Mocking jwt.verify
    sinon.stub(jwt, "verify").resolves({ _id: "userId", role: "buyer" });

    // Mocking Register.findOne
    const mockUserData = { /* Mock user data based on your requirements */ };
    sinon.stub(Register, "findOne").resolves(mockUserData);

    await auth(req, res, next);

    // Assertions
    expect(req.token).toEqual("validToken");
    expect(req.user).toEqual(mockUserData);
    expect(res.locals.isLoggedIn).toBe(true);
    expect(res.locals.isLoggedIn).toBe(true);
    console.log("res.locals.isBuyer:", res.locals.isBuyer);

  });

  it("should redirect to /register if the token is invalid", async () => {
    const req = {
      cookies: { jwt: "invalidToken" },
    };
    const res = {
      redirect: sinon.spy(),
      locals: {},
    };
    const next = sinon.spy();

    // Mocking jwt.verify to throw an error
    sinon.stub(jwt, "verify").throws(new Error("Invalid token"));

    await auth(req, res, next);

    // Assertions
    expect(res.redirect.calledOnceWith("/register")).toBe(true);
    expect(next.notCalled).toBe(true);
  });
});
