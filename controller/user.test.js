const User = require("../service/schemas/user");
const httpMocks = require("node-mocks-http");

const newUser = new User({
  email: "test@abracadabra.com",
  password: "pp1240p!",
  subscription: "business",
});
const mockAdduser = jest.fn().mockResolvedValue(newUser);

const loginData = {
  token: "ej123ysdfqywyhbasdj1231y89ry",
  user: {
    email: "someEmail@test.com",
    subscription: "start",
  },
};
const mockLogin = jest.fn().mockResolvedValue(loginData);

jest.mock("../service", () => ({
  usersService: {
    addUser: mockAdduser,
    login: mockLogin,
  },
}));

const { usersController } = require("../controller");
const { usersService } = require("../service");

describe("user registration", () => {
  it("should allow the registration of a new user", async () => {
    const req = {
      body: { email: "test@abracadabra.com", password: "pp1240p!" },
    };
    const res = httpMocks.createResponse();

    await usersController.createUser(req, res, jest.fn());
    expect(res.statusCode).toBe(201);
  });

  it("should return payload with email and subscription", async () => {
    const req = {
      body: { email: "test@abracadabra.com", password: "pp1240p!" },
    };
    const res = httpMocks.createResponse();

    await usersController.createUser(req, res, jest.fn());
    const payload = res._getJSONData();
    expect(payload.email).toBe(newUser.email);
    expect(payload.subscription).toBe(newUser.subscription);
  });

  it("should reject payload without email", async () => {
    const req = {
      body: { password: "pp1240p!" },
    };
    const res = httpMocks.createResponse();

    await usersController.createUser(req, res, jest.fn());
    expect(res.statusCode).toBe(400);
  });

  it("should reject payload without password", async () => {
    const req = {
      body: { email: "test@test.com" },
    };
    const res = httpMocks.createResponse();

    await usersController.createUser(req, res, jest.fn());
    expect(res.statusCode).toBe(400);
  });

  it("should return 409 (Conflict) when user cannot be created", async () => {
    usersService.addUser = jest.fn().mockResolvedValue(null);

    const req = {
      body: { email: "test@test.com", password: "123Test!" },
    };

    const res = httpMocks.createResponse();

    await usersController.createUser(req, res, jest.fn());
    expect(res.statusCode).toBe(409);
  });
});

describe("user login", () => {
  it("should return 200 (OK)", async () => {
    const req = {
      body: { email: "test@test.com", password: "123Test!" },
    };

    const res = httpMocks.createResponse();

    await usersController.login(req, res, jest.fn());
    expect(res.statusCode).toBe(200);
  });

  it("should return correct payload after successful login", async () => {
    const req = {
      body: { email: "test@test.com", password: "123Test!" },
    };

    const res = httpMocks.createResponse();

    await usersController.login(req, res, jest.fn());

    const payload = res._getJSONData();
    expect(payload.token).toBe(loginData.token);
    expect(payload.user.email).toBe(loginData.user.email);
    expect(payload.user.subscription).toBe(loginData.user.subscription);
  });

  it("should reject payload without email", async () => {
    const req = {
      body: { password: "pp1240p!" },
    };
    const res = httpMocks.createResponse();

    await usersController.login(req, res, jest.fn());
    expect(res.statusCode).toBe(400);
  });

  it("should reject payload without password", async () => {
    const req = {
      body: { email: "test@test.com" },
    };
    const res = httpMocks.createResponse();

    await usersController.login(req, res, jest.fn());
    expect(res.statusCode).toBe(400);
  });

  it("should return 401 (Unauthorized) when login is unsuccessful", async () => {
    usersService.login = jest.fn().mockResolvedValue(null);

    const req = {
      body: { email: "test@test.com", password: "123Test!" },
    };

    const res = httpMocks.createResponse();

    await usersController.login(req, res, jest.fn());
    expect(res.statusCode).toBe(401);
  });
});
