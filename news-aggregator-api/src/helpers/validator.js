const registeredUsers = require("../db/registeredUsers.json");
const bcrypt = require("bcrypt");
const roles = ["admin", "user"];
class validator {
  static validateUserRegisterInfo(userInfo) {
    if (
      userInfo.hasOwnProperty("name") &&
      userInfo.hasOwnProperty("email") &&
      userInfo.hasOwnProperty("password") &&
      userInfo.hasOwnProperty("role") &&
      userInfo.hasOwnProperty("preferences")
    ) {
      let registeredUsersData = JSON.parse(JSON.stringify(registeredUsers));
      let isUserNameExists = registeredUsersData.users.findIndex(
        (user) => user.name === userInfo.name
      );
      if (isUserNameExists == -1) {
        let isValidEmail = function (email) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        };
        if (isValidEmail(userInfo.email)) {
          let isEmailAlreadyExists = registeredUsersData.users.findIndex(
            (user) => user.email === userInfo.email
          );
          if (isEmailAlreadyExists == -1) {
            let isPreferenceEmpty = userInfo.preferences.length;
            if (isPreferenceEmpty != 0) {
              let checkIsValidRole = roles.includes(userInfo.role);
              if (!checkIsValidRole) {
                return {
                  status: false,
                  statusCode: 400,
                  msg: "Invalid user role. Please provide a valid role.",
                };
              } else {
                return {
                  status: true,
                  statusCode: 200,
                  msg: "User details validated successfully.",
                };
              }
            } else {
              return {
                status: false,
                statusCode: 400,
                msg: "Preferences are empty.",
              };
            }
          } else {
            return {
              status: false,
              statusCode: 403,
              msg: "Email already exists. Please use different emailId",
            };
          }
        } else {
          return {
            status: false,
            statusCode: 400,
            msg: `Invalid email address. Please provide a valid email address.`,
          };
        }
      } else {
        return {
          status: false,
          statusCode: 403,
          msg: "name is already in use. Please provide unique username.",
        };
      }
    } else {
      return {
        status: false,
        statusCode: 400,
        msg: `Invalid used details. Something is missing.`,
      };
    }
  }

  static validateUserLoginInfo(userInfo) {
    if (
      userInfo.hasOwnProperty("email") &&
      userInfo.hasOwnProperty("password")
    ) {
      let registeredUsersData = JSON.parse(JSON.stringify(registeredUsers));
      let isEmailAlreadyExists = registeredUsersData.users.findIndex(
        (user) => user.email === userInfo.email
      );
      if (isEmailAlreadyExists !== -1) {
        let userData = registeredUsersData.users.filter(
          (user) => user.email === userInfo.email
        );

        let isUserPasswordValid = bcrypt.compareSync(
          userInfo.password,
          userData[0].password
        );
        if (isUserPasswordValid) {
          return {
            status: true,
            statusCode: 200,
            msg: "User email and password validated successfully!",
            userData: userData,
          };
        } else {
          return {
            status: false,
            statusCode: 401,
            msg: "Invalid user password! Please provide correct password!",
          };
        }
      } else {
        return {
          status: false,
          statusCode: 404,
          msg: `User not found with email ${userInfo.email}`,
        };
      }
    } else {
      return {
        status: false,
        statusCode: 400,
        msg: "Invalid user login information! Something is missing",
      };
    }
  }
}

module.exports = validator;
