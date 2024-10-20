const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { ContactForm } = require("../models");
const { Users } = require("../models");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const e = require("express");
const axios = require('axios');

//For SMTP Mail Sending
let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Creates a new Contact request on database
router.post("/contactus", async (req, res) => {
  const bodyData = req.body;

  message1 = {
    from: "greencurve.securities@gmail.com",
    to: "greencurve.securities@gmail.com",
    subject: `GCS contact us request from ${bodyData.Name}`,
    html: `<p>You got a new message from:<p><br><p>Name : ${bodyData.Name}</p><br><p>Phone Number : ${bodyData.PhoneNumber}</p><br><p>Email : ${bodyData.Email}</p><br><p>Subject : ${bodyData.Subject}</p><br><p>Message : ${bodyData.Message}</p><br><p>Best wishes, GCS</p>`,
  };
  message2 = {
    from: "greencurve.securities@gmail.com",
    to: "greencurve.securities@gmail.com",
    subject: `GCS Website Lead form Reply from ${bodyData.Name}}`,
    html: `<p>You got a new message from ${bodyData.Name}:</p><br><p>Name : ${bodyData.Name}</p><br><p>Phone Number : ${bodyData.PhoneNumber}</p><br><p>Email : ${bodyData.Email}</p><br><p>PreferredMethodOfContact : ${bodyData.PreferredMethodOfContact}</p><br><p>InterestedServices : ${bodyData.InterestedServices}</p><br><p>InvestmentExperience : ${bodyData.InvestmentExperience}</p><br><p>City : ${bodyData.City}</p><br><p>Best wishes, GCS</p>`,
  };
  if (bodyData.isContactForm) {
    transporter.sendMail(message1, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        // console.log(info);
      }
    });
  } else {
    transporter.sendMail(message2, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        // console.log(info);
      }
    });
  }

  const createResponse = await ContactForm.create(bodyData);
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(createResponse);
});

// Creates a new contact request on database
router.post("/getintouch", async (req, res) => {
  const bodyData = req.body;
  const createResponse = await ContactForm.create(bodyData);
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(createResponse);
});

// Creates a new User on database
router.post("/signup", async (req, res) => {
  const bodyData = req.body;
  const createResponse = await Users.create(bodyData);
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(createResponse);
});

// Verify User on database
router.post("/signin", async (req, res) => {
  const bodyData = req.body;
  const createResponse = await Users.findOne({
    where: {
      Email: bodyData.Email,
      Password: bodyData.Password,
    },
  });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(createResponse);
});

// Gets the Contact by id
router.get("/contact/:id", async (req, res) => {
  const contactID = req.params.id;
  // console.log(contactID);
  const contactData = await ContactForm.findByPk(contactID, {
    // include: [
    //   {
    //     model: User,
    //     as: "user",
    //   },
    //   {
    //     model: Status,
    //     as: "status",
    //   },
    // ],
  });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(contactData);
});
// Delete the Contact by id
router.delete("/deleteContact/:id", async (req, res) => {
  const Id = req.params.id;
  // console.log(contactID);
  const contactData = await ContactForm.destroy({
    where: {
      Id: Id
    },
    // include: [
    //   {
    //     model: User,
    //     as: "user",
    //   },
    //   {
    //     model: Status,
    //     as: "status",
    //   },
    // ],
  });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(contactData);
});

// Gets Google Reviews
router.get("/reviews", async (req, res) => {
  const apiKey = process.env.API_KEY;
  const reviewsResponse = await axios.get(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJizxli4-p5zsRYUVs6CKc2bU&fields=name,rating,reviews&key=${apiKey}`
  )

  const reviews = reviewsResponse.data.result.reviews;

  const existingReviewsResponse = await axios.get("https://admin.greencurvesecurities.com/items/GoogleReviews");
  const existingReviews = existingReviewsResponse.data.data;

  const newReviews = reviews.filter(review => {
    const existingReview = existingReviews.find(er => er.author_name === review.author_name);
    return !existingReview;
  });

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  for (const review of newReviews) {
    const postData = {
      author_name: review.author_name,
      profile_photo_url: review.profile_photo_url,
      rating: review.rating,
      text: review.text,
    };

    await axios.post("https://admin.greencurvesecurities.com/items/GoogleReviews", postData, config);
  }

  res.status(201).send(`New reviews posted successfully to Admin Portal`);
  // res.header({
  //   "Content-Type": "application/json",
  //   "Access-Control-Allow-Origin": "*",
  //   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
  //   "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  // });
  // res.json(Reviews.data);
});

// Gets all the Contacts
router.get("/contact", async (req, res) => {
  const contactData = await ContactForm.findAll({
    //order condition
    order: [["TimeStamp", "DESC"]],
  });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(contactData);
});

// Updates Contacted value
router.put("/contacted/:id", async (req, res) => {
  const contactID = req.params.id;
  const contactData = await ContactForm.update(
    { isContacted: true },
    {
      where: {
        Id: contactID,
      },
    }
  );
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(contactData);
});

module.exports = router;
