let { expect } = require("chai");
let validator = require("../../src/helpers/validator");
let registeredUsersData = require("../../src/db/registeredUsers.json");
let bcrypt = require("bcrypt");

const registeredUsersDetails = {
  userId: 301,
  name: "Sam John",
  email: "samjohn@gmail.com",
  password: "password@123",
  role: "admin",
  preferences: ["business", "health"],
};

/*** start ---   test cases for registered user  */
describe("Testing the validate user registration info functionality", function () {
  it("1. validating the user info : validate the user info successfully", (done) => {
    let response = validator.validateUserRegisterInfo(registeredUsersDetails);
    expect(response.status).equal(true);
    expect(response.statusCode).equal(200);
    expect(response.msg).equal("User details validated successfully.");
    done();
  });

  it("2. validating the user info - fails if the user name is not unique", (done) => {
    const newRegisteredUserDetails = { ...registeredUsersDetails };
    newRegisteredUserDetails.name = "test1";
    let response = validator.validateUserRegisterInfo(newRegisteredUserDetails);
    expect(response.status).equal(false);
    expect(response.statusCode).equal(403);
    expect(response.msg).equal(
      "name is already in use. Please provide unique username."
    );
    done();
  });

  it("3. validating the user info - fails if role is invalid", (done) => {
    const newRegisteredUserDetails = { ...registeredUsersDetails };
    newRegisteredUserDetails.role = "invalid_role";
    let response = validator.validateUserRegisterInfo(newRegisteredUserDetails);
    expect(response.status).equal(false);
    expect(response.statusCode).equal(400);
    expect(response.msg).equal(
      "Invalid user role. Please provide a valid role."
    );
    done();
  });

  it("4. validating the user info - fail if preferences are  empty.", (done) => {
    const newRegisteredUserDetails = { ...registeredUsersDetails };
    newRegisteredUserDetails.preferences = [];
    let response = validator.validateUserRegisterInfo(newRegisteredUserDetails);
    expect(response.status).equal(false);
    expect(response.statusCode).equal(400);
    expect(response.msg).equal("Preferences are empty.");
    done();
  });

  it("5. validating user info - fail if email already in use.", (done) => {
    const newRegisteredUserDetails = { ...registeredUsersDetails };
    newRegisteredUserDetails.email = "test1@gmail.com";
    let response = validator.validateUserRegisterInfo(newRegisteredUserDetails);
    expect(response.status).equal(false);
    expect(response.statusCode).equal(403);
    expect(response.msg).equal(
      "Email already exists. Please use different emailId"
    );
    done();
  });

  it("6. validating registered user info - fail if invalid emailId.", (done) => {
    const newRegisteredUserDetails = { ...registeredUsersDetails };
    newRegisteredUserDetails.email = "invalid_email";
    let response = validator.validateUserRegisterInfo(newRegisteredUserDetails);
    expect(response.status).equal(false);
    expect(response.statusCode).equal(400);
    expect(response.msg).equal(
      "Invalid email address. Please provide a valid email address."
    );
    done();
  });

  it("7. validating registered user info - fail if one of the property of registered user is missing.", (done) => {
    const newRegisteredUserDetails = { ...registeredUsersDetails };
    delete newRegisteredUserDetails.email;
    let response = validator.validateUserRegisterInfo(newRegisteredUserDetails);
    expect(response.status).equal(false);
    expect(response.statusCode).equal(400);
    expect(response.msg).equal("Invalid used details. Something is missing.");
    done();
  });
});

/**  end  */

/** start -- test cases for login  */

const loginCredential = {
  email: "test11@gmail.com",
  password: "123456789",
};

describe("Testing the validate user login functionality", function () {
  it("1. validate login info - login successfull.", (done) => {
    let response = validator.validateUserLoginInfo(loginCredential);
    expect(response.status).equal(true);
    expect(response.statusCode).equal(200);
    expect(response.msg).equal(
      "User email and password validated successfully!"
    );
    done();
  });

  it("2. validate login info - fail if password is invalid!", (done) => {
    const newLoginCredential = { ...loginCredential };
    newLoginCredential.password = "1234";
    let response = validator.validateUserLoginInfo(newLoginCredential);
    expect(response.status).equal(false);
    expect(response.statusCode).equal(401);
    expect(response.msg).equal(
      "Invalid user password! Please provide correct password!"
    );
    done();
  });

  it("3. validate login info - fail if email is invalid", (done) => {
    const newLoginCredential = { ...loginCredential };
    newLoginCredential.email = "invalid@gmail.com";
    let response = validator.validateUserLoginInfo(newLoginCredential);
    expect(response.status).equal(false);
    expect(response.statusCode).equal(404);
    expect(response.msg).equal(
      `User not found with email ${newLoginCredential.email}`
    );
    done();
  });

  it("4. validate login info - fail if one of the property is missing", (done) => {
    const newLoginCredential = { ...loginCredential };
    delete newLoginCredential.email;
    let response = validator.validateUserLoginInfo(newLoginCredential);
    expect(response.status).equal(false);
    expect(response.statusCode).equal(400);
    expect(response.msg).equal(
      "Invalid user login information! Something is missing"
    );
    done();
  });
});

/** end */
