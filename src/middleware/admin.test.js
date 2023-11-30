const assert = require("assert");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const Register = require("../models/registers");
const adminAuth = require("./adminAuth");

console.log = jest.fn();

describe("adminAuth middleware", () => {
  it("should set req.token, req.user, and res.locals based on a valid admin token", async () => {
    const req = {
      cookies: { jwt: "validAdminToken" },
    };
    const res = {
      locals: {},
      redirect: sinon.spy(),
    };
    const next = sinon.spy();

    // Mocking jwt.verify
    sinon.stub(jwt, "verify").resolves({ _id: "adminUserId", role: 'admin' });

    // Mocking Register.findOne
    const mockAdminUser = { _id: "adminUserId", role: 'admin' };
    sinon.stub(Register, "findOne").resolves(mockAdminUser);

    await adminAuth(req, res, next);

    // Assertions
    assert.strictEqual(req.token, "validAdminToken");
    assert.deepStrictEqual(req.user, mockAdminUser);
    assert.strictEqual(res.locals.isLoggedIn, true);
    assert.strictEqual(res.locals.isAdmin, true);
    assert.strictEqual(next.calledOnce, true);
    assert.strictEqual(res.redirect.notCalled, true);

    // Restoring stubs
    jwt.verify.restore();
    Register.findOne.restore();
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

    await adminAuth(req, res, next);

    // Assertions
    assert.strictEqual(res.redirect.calledOnceWith("/register"), true);
    assert.strictEqual(next.notCalled, true);

    // Restoring stubs
    jwt.verify.restore();
  });
});
