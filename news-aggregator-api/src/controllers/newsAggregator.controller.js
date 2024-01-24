const usersDetails = require("../db/registeredUsers.json");
const fs = require("fs");
const { fetchNews } = require("../services/newsapi");
const { NEWS_API_AGGREGATOR_KEY } = require("../config/env.config");
const { constructUrl, map } = require("../helpers/utility");
const URI_NEWS_API = "https://newsapi.org/v2/top-headlines";

/* Get User News Preferences Controller */
const getUsersNewsPreferencesController = (req, res, next) => {
  const { user, name, email, msg } = req;
  if (user) {
    let usersPreferencesData = JSON.parse(JSON.stringify(usersDetails));
    let filteredUserPreference = usersPreferencesData.users?.find(
      (users) => users.userId == user
    );

    if (!filteredUserPreference) {
      return res.status(404).json({
        status: 404,
        msg: `User News Preferences not found!`,
      });
    } else {
      return res.status(200).json({
        status: 200,
        msg: `User News Preferences found`,
        data: filteredUserPreference.preferences,
      });
    }
  } else {
    return res.status(403).json({
      status: 403,
      msg: msg,
    });
  }
};

/* Update User News Preferences Controller */
const updateUsersNewsPreferencesController = (req, res, next) => {
  const { user, name, email, msg } = req;
  if (user) {
    let usersData = usersDetails;
    let userIndex = usersData.users.findIndex((users) => users.userId == user);
    if (userIndex !== -1) {
      let preferences = req.body.preferences;
      usersData.users[userIndex].preferences = preferences;
      try {
        fs.writeFile(
          "./src/db/registeredUsers.json",
          JSON.stringify(usersData),
          { encoding: "utf8", flag: "w" },
          (err, data) => {
            if (err) {
              return res.status(500).json({
                status: 500,
                msg: `Writing users news preferences in memory db failed: ${err}`,
              });
            } else {
              if (map.has(user)) map.delete(user);
              return res.status(500).json({
                status: 200,
                msg: `User News Preferences updated successfully!`,
              });
            }
          }
        );
      } catch (error) {
        return res.status(500).json({
          status: 500,
          msg: `Writing users news preferences in memory db failed: ${error}`,
        });
      }
    } else {
      return res.status(404).json({
        status: 404,
        msg: `User not found with userId: ${user}`,
      });
    }
  } else {
    return res.status(403).json({
      status: 403,
      msg: msg,
    });
  }
};

/* Get News basis User Preferences Controller */
const getNewsBasisPreferencesController = async (req, res, next) => {
  const { user, name, email, msg } = req;
  if (user) {
    let userfilteredData = usersDetails.users?.find(
      (users) => users.userId == user
    );
    if (userfilteredData.preferences.length) {
      if (map.has(user)) {
        console.log("response send through cache");
        return res.status(200).json({
          status: 200,
          data: map.get(user),
        });
      }

      try {
        let payload = {
          language: "en",
          apiKey: NEWS_API_AGGREGATOR_KEY,
          category: userfilteredData.preferences,
        };
        let searchParams = constructUrl(payload);
        let newsRes = await fetchNews(`${URI_NEWS_API}?${searchParams}`);

        if (!map.has(user) && newsRes.status === 200)
          map.set(user, newsRes.data.articles);
        return res.status(newsRes.status).json({
          status: 200,
          data: newsRes?.data?.articles,
        });
      } catch (error) {
        return res.status(500).json({
          error: error,
        });
      }
    } else {
      return res.status(404).json({
        status: 400,
        msg: "User preferences not found! Please update the new preferences first!",
      });
    }
  } else {
    return res.status(403).json({
      status: 403,
      msg: msg,
    });
  }
};

module.exports = {
  getUsersNewsPreferencesController,
  updateUsersNewsPreferencesController,
  getNewsBasisPreferencesController,
};
