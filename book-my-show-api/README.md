# BookMyShow

In this project we build api endpoint for booking any show in the city using nodeJs and express.

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)

## Introduction

We build api endpoints for booking a movie show in the city. As we can see the next seven days show in any threatre and we can book a tickets.

## Getting Started

npm install express nodemon

## Routes

GET api/v1/cities - getting all cities.

GET api/v1/theatre/:city_id - get theatres based on cities.

GET api/v1/showDates/:theatre_id - get specific theatres show details next seven days.

GET api/v1/movies/:date/:theatre_id - get movie for specific date.

POST api/v1/bookTicket - for booking ticket we have to pass 3 parameter in body 

EX. {
    "userId":"65b0bb547c36d19a8853ec35",
    "showId":"65b0bb547c36d19a8853ec64",
    "seatNumbers":["A1"]
}
