const assert = require("assert");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const Register = require("../models/registers");
const resetAuth = require("./resetAuth");
console.log = jest.fn();

describe("resetAuth middleware", () => {
  it("should set req.email based on a valid token and user ID", async () => {
    const req = {
      params: { _id: "userId", token: "validToken" },
    };
    const res = {};
    const next = sinon.spy();

    // Stubbing jwt.verify
    const verifyStub = sinon.stub(jwt, "verify");
    verifyStub.withArgs("validToken", sinon.match.string).resolves({});

    // Stubbing Register.findById
    const mockUser = { _id: "userId", email: "test@example.com" };
    sinon.stub(Register, "findById").resolves(mockUser);

    await resetAuth(req, res, next);

    // Assertions
    assert.strictEqual(req.email, mockUser.email);
    assert.strictEqual(next.calledOnce, true);

    // Restoring stubs
    verifyStub.restore();
    Register.findById.restore();
  });

  it("should redirect to /404 if the token is invalid", async () => {
    const req = {
      params: { _id: "userId", token: "invalidToken" },
    };
    const res = {
      redirect: sinon.spy(),
    };
    const next = sinon.spy();

    // Stubbing jwt.verify to throw an error
    sinon.stub(jwt, "verify").throws(new Error("Invalid token"));

    await resetAuth(req, res, next);

    // Assertions
    assert.strictEqual(res.redirect.calledOnceWith("/404"), true);
    assert.strictEqual(next.notCalled, true);

    // Restoring stubs
    jwt.verify.restore();
  });
});
