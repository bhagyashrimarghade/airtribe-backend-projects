# news-api-aggregator

This repo contains news apis aggregator build in nodeJS.

It has mainly following apis ->

**1. /register (post)** : register a user with following payload

**Payload = {
    "name": "test1",
    "email": "test1@gmail.com",
    "password": "123456789",
    "role": "admin",
    "preferences" : ["business","health"]
}**

**2. /login (post)** : login in an application with following payload and generate accessToken using jwt

**Payload = {
    "email":"test1@gmail.com",
    "password":"123456789"
}**

**3. /preferences (get)** : Retrieve the news preferences for the logged-in user 
    
**Headers** : Authorization header required

**4. /preferences (put)** : Update the news preferences for the logged-in user and need following payload

**payload {
    "preferences":["technology","politics"]
}**

**Headers** : Authorization header required

**5 /news (get)** : Fetch news articles based on the logged-in user's preferences

**Headers** : Authorization header required
