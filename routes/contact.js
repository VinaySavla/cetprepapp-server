const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const axios = require('axios');
const {User} = require("../models");
const {OTP} = require("../models");
const {Subjects} = require("../models");
const {Chapters} = require("../models");
const {Notes} = require("../models");
const {Questions} = require("../models");
const {QuestionPaper} = require("../models");
const {UserSubject} = require("../models");
const {QPQuestions, sequelize} = require("../models");



//For SMTP Mail Sending
let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


router.get("/", async (req, res) => {
  res.json({ message: "Welcome to CETPREPAPP SERVER"});
});

// Creates a new Contact request on database
router.post("/emailotp", async (req, res) => {
  const bodyData = req.body;
  const GeneratedOTP = Math.floor(100000 + Math.random() * 900000).toString();
  const ExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes
  bodyData.OTP = GeneratedOTP;
  bodyData.ExpiresAt = ExpiresAt;

  message1 = {
    from: process.env.SMTP_USER,
    to: bodyData.Email,
    subject: `OTP for CET Prep App is ${GeneratedOTP}`,
    html: `<p>OTP for CET Prep App is ${GeneratedOTP}, it is valid for 5 minutes only</p>`,
  };
  console.log("otp generates", GeneratedOTP);
  if (bodyData.Email !== "") {
    console.log("Sending OTP to " + bodyData.Email);
    transporter.sendMail(message1, function (err, info) {
      if (err) {
        console.log(err);
      }
      else {
        console.log(info);
      }
    });
  }

  const createResponse = await OTP.create(bodyData);
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(createResponse);
});

// Route for OTP verification
router.post("/verifyotp", async (req, res) => {
  const { Email, OTP: userOTP } = req.body;

  try {
    // Fetch the stored OTP and ExpiresAt from the database using the Email
    const user = await OTP.findOne({
      where: { Email },
      order: [['TimeStamp', 'DESC']]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { OTP: storedOTP, ExpiresAt } = user;

    // Check if the provided OTP matches the stored OTP and if it is still valid
    if (userOTP === storedOTP && new Date() < new Date(ExpiresAt)) {
      return res.status(200).json({ message: "OTP verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});



//POST APIs

// Creates a new User on database
router.post("/register", async (req, res) => {
  const bodyData = req.body;
  const createResponse = await User.create(bodyData);

  if (bodyData.subjects && bodyData.subjects.length > 0) {
    // Ensure that the provided subjects exist in the database
    const subjectsInDb = await Subjects.findAll({
      where: {
        SubjectID: bodyData.subjects,  // Use the subject IDs passed from the client
      },
    });

    if (subjectsInDb.length !== bodyData.subjects.length) {
      return res.status(400).json({ error: "Some subject IDs are invalid" });
    }

    // Associate the user with the subjects
    await createResponse.setSubjects(bodyData.subjects); // Many-to-many relation via UserSubject
  }
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(createResponse);
});

// Verify User on database
router.post("/login", async (req, res) => {
  const bodyData = req.body;
  const createResponse = await User.findOne({
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

// Verify User on database
router.post("/faculty-login", async (req, res) => {
  const bodyData = req.body;
  const createResponse = await User.findOne({
    where: {
      Email: bodyData.Email,
      Password: bodyData.Password,
      isFaculty: true
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

// Creates a new Subject
router.post("/addsubject", async (req, res) => {
  const bodyData = req.body;
  const createResponse = await Subjects.create(bodyData);
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(createResponse);
});

// Creates a new Chapter
router.post("/addchapter", async (req, res) => {
  const bodyData = req.body;
  const createResponse = await Chapters.create(bodyData);
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(createResponse);
});

// Creates a new Note
router.post("/addnote", async (req, res) => {
  const bodyData = req.body;
  const createResponse = await Notes.create(bodyData);
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(createResponse);
});

// Creates a new Question
router.post("/addquestion", async (req, res) => {
  const bodyData = req.body;
  const createResponse = await Questions.create(bodyData);
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(createResponse);
});

// Creates a new QuestionPaper
// router.post("/addquestionpaper", async (req, res) => {
//   const bodyData = req.body;
//   //TODO: Add logic to add random questions to the question paper
//   const createResponse = await QuestionPaper.create(bodyData);
//   res.header({
//     "Content-Type": "application/json",
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
//     "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
//   });
//   res.json(createResponse);
// });

router.post("/addquestionpaper", async (req, res) => {
  try {
    const bodyData = req.body;

    // Create the QuestionPaper entry
    const questionPaper = await QuestionPaper.create(bodyData);

    // Fetch 20 random unique questions
    const randomQuestions = await Questions.findAll({
      order: sequelize.random(),
      limit: 20
    });

    // Create entries in QPQuestions for each question
    const qPQuestionsEntries = randomQuestions.map(question => ({
      QuestionPaperID: questionPaper.QuestionPaperID,
      QuestionID: question.QuestionID
    }));

    await QPQuestions.bulkCreate(qPQuestionsEntries);

    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });

    res.json({ questionPaper, addedQuestions: randomQuestions });
  } catch (error) {
    console.error("Error creating question paper with random questions:", error);
    res.status(500).json({ error: "Failed to create question paper" });
  }
});


//Assign Subjects to Users
router.post("/assignSubjects", async (req, res) => {
  const { UserID, Subjects } = req.body; // Destructure the request body
  // console.log(UserID, Subjects);

  try {
    // Step 1: Input validation
    if (!UserID || !Subjects || !Array.isArray(Subjects) || Subjects.length === 0) {
      return res.status(400).json({ error: "UserID and a non-empty array of Subjects are required" });
    }

    // Step 2: Check if the user exists in the database
    const user = await User.findByPk(UserID);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // // Step 3: Ensure the provided Subjects exist in the database
    // const subjectsInDb = await Subjects.findAll({
    //   where: {
    //     SubjectID: Subjects,  // Use the subject IDs passed from the client
    //   },
    // });

    // // Step 4: Validate if all provided subject IDs exist in the database
    // if (subjectsInDb.length !== Subjects.length) {
    //   return res.status(400).json({ error: "Some subject IDs are invalid" });
    // }

    // Step 5: Assign the Subjects to the user
    await user.setSubjects(Subjects); // Many-to-many relation via UserSubject

    // Step 6: Return success response
    res.status(200).json({ message: "Subjects assigned successfully to the user" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to assign Subjects. Please try again later." });
  }
});

//Remove Subject
router.post("/removeSubjects", async (req, res) => {
  const { UserID, Subjects } = req.body; // Destructure the request body

  try {
    // Step 1: Validate the input
    if (!UserID || !Subjects || !Array.isArray(Subjects) || Subjects.length === 0) {
      return res.status(400).json({ error: "UserID and a non-empty array of Subjects are required" });
    }

    // Step 2: Check if the user exists
    const user = await User.findByPk(UserID);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // // Step 3: Ensure the provided Subjects exist in the database
    // const subjectsInDb = await Subjects.findAll({
    //   where: {
    //     id: Subjects, // Ensure the column name is correct (id or SubjectID)
    //   },
    // });

    // // Step 4: Check if all Subjects are valid
    // if (subjectsInDb.length !== Subjects.length) {
    //   return res.status(400).json({ error: "Some subject IDs are invalid" });
    // }

    // Step 5: Remove Subjects from the user
    await user.removeSubjects(Subjects);  // Dissociate subjects from the user

    // Step 6: Return success response
    res.status(200).json({ message: "Subjects removed successfully from the user" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to remove subjects. Please try again later." });
  }
});





//GET APIs

// Gets all the Subjects
router.get("/getsubjects", async (req, res) => {
  const subjectData = await Subjects.findAll({
    //order condition
    order: [["SubjectID", "ASC"]],
  });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(subjectData);
});

// Gets the Subject by id
router.get("/getsubject/:SubjectID", async (req, res) => {
  const subjectID = req.params.SubjectID;
  // console.log(subjectID);
  const subjectData = await Subjects.findByPk(subjectID, {
    include: [
      {
        model: Chapters,
        as: "chapters",
      },
      {
        model: Notes,
        as: "notes",
      },
      {
        model: Questions,
        as: "questions",
      },
    ],
  });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(subjectData);
});

// Gets all the Chapters
router.get("/getchapters", async (req, res) => {
  const chapterData = await Chapters.findAll({
    //order condition
    order: [["ChapterID", "ASC"]],
  });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(chapterData);
});

// Gets the Chapter by id
router.get("/getchapter/:ChapterID", async (req, res) => {
  const ChapterID = req.params.ChapterID;
  // console.log(chapterID);
  const chapterData = await Chapters.findByPk(ChapterID, {
    include: [
      {
        model: Subjects,
        as: "subjects",
      },
      {
        model: Questions,
        as: "questions",
      },
    ],
  });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(chapterData);
});

//Get Chapters by SubjectID
router.get("/getsubjectchapters/:SubjectID", async (req, res) => {
  const subjectID = req.params.SubjectID;
  const chapterData = await Chapters.findAll({
    where: {
      SubjectID: subjectID,
    },
    order: [["ChapterID", "ASC"]],
  });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(chapterData);
});


// Gets all the Notes
router.get("/getnotes", async (req, res) => {
  const noteData = await Notes.findAll({
    //order condition
    order: [["NoteID", "ASC"]],
  });
  res.header({

    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(noteData);
});

// Gets the Note by id
router.get("/getnote/:NoteID", async (req, res) => {
  const NoteID = req.params.NoteID;
  // console.log(noteID);
  const noteData = await Notes.findByPk(NoteID, {
    include: [
      {
        model: Subjects,
        as: "subjects",
      },
    ],
  });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(noteData);
});

//Get Notes by SubjectID
router.get("/getsubjectnotes/:SubjectID", async (req, res) => {
  const subjectID = req.params.SubjectID;
  const noteData = await Notes.findAll({
    where: {
      SubjectID: subjectID,
    },
    order: [["NoteID", "ASC"]],
  });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(noteData);
});

// Gets all the Questions
router.get("/getquestions", async (req, res) => {
  const questionData = await Questions.findAll({
    //order condition
    order: [["QuestionID", "ASC"]],
  });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(questionData);
});

// Gets the Question by id
router.get("/getquestion/:QuestionID", async (req, res) => {
  const questionID = req.params.QuestionID;
  // console.log(questionID);
  const questionData = await Questions.findByPk(questionID, {
    include: [
      {
        model: Subjects,
        as: "subjects",
      },
      {
        model: Chapters,
        as: "chapters",
      },
    ],
  });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(questionData);
});

// Get Questions by SubjectID (handle array-like string '[1,2,3]')
router.get("/getsubjectquestions/:SubjectID", async (req, res) => {
  const subjectIDParam = req.params.SubjectID;

  // Check if SubjectID looks like an array (e.g., "[1,2,3]")
  let subjectIDs = [];
  if (subjectIDParam.startsWith('[') && subjectIDParam.endsWith(']')) {
    // Remove the square brackets and split by comma
    subjectIDs = subjectIDParam.slice(1, -1).split(',').map(id => id.trim());
  } else {
    // If it's a single value, just use it as an array
    subjectIDs = [subjectIDParam];
  }

  try {
    // Fetch questions by SubjectIDs
    const questionData = await Questions.findAll({
      where: {
        SubjectID: subjectIDs.length > 1 ? { [Op.in]: subjectIDs } : subjectIDs[0],
      },
      order: [["QuestionID", "ASC"]],
    });

    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });

    res.json(questionData);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the questions." });
  }
});


//Get Questions by ChapterID
// Get Questions by ChapterID (handle array-like string '[1,2,3]')
router.get("/getchapterquestions/:ChapterID", async (req, res) => {
  const chapterIDParam = req.params.ChapterID;

  // Check if ChapterID looks like an array (e.g., "[1,2,3]")
  let chapterIDs = [];
  if (chapterIDParam.startsWith('[') && chapterIDParam.endsWith(']')) {
    // Remove the square brackets and split by comma
    chapterIDs = chapterIDParam.slice(1, -1).split(',').map(id => id.trim());
  } else {
    // If it's a single value, just use it as an array
    chapterIDs = [chapterIDParam];
  }

  try {
    // Fetch questions by ChapterIDs
    const questionData = await Questions.findAll({
      where: {
        ChapterID: chapterIDs.length > 1 ? { [Op.in]: chapterIDs } : chapterIDs[0], // Use Op.in for multiple ChapterIDs
      },
      order: [["QuestionID", "ASC"]],
    });

    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });

    res.json(questionData);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the questions." });
  }
});


// Gets all the QuestionPapers
router.get("/getquestionpapers", async (req, res) => {
  const questionPaperData = await QuestionPaper.findAll({
    //order condition
    order: [["QuestionPaperID", "ASC"]],
  });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(questionPaperData);
});

// Gets the QuestionPaper by id
router.get("/getquestionpaper/:QuestionPaperID", async (req, res) => {
  const questionPaperID = req.params.QuestionPaperID;

  try {
    const questionPaperData = await QuestionPaper.findByPk(questionPaperID, {
      include: [
        {
          model: User,
          as: "user", // Including the user who created the question paper (if applicable)
        },
        {
          model: QPQuestions,
          as: "questionpaper", // Including the intermediate QPQuestions table
          include: [
            {
              model: Questions,
              as: "questionquestions", // Fetch the actual questions through QPQuestions
            },
          ],
        },
      ],
    });

    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });

    res.json(questionPaperData);
  } catch (error) {
    console.error("Error fetching question paper data:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
});


//Get QuestionPapers by UserID
router.get("/getstudentquestionpapers/:UserID", async (req, res) => {
  const studentID = req.params.UserID;
  const questionPaperData = await QuestionPaper.findAll({
    where: {
      UserID: studentID,
    },
    order: [["QuestionPaperID", "ASC"]],
  });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(questionPaperData);
});

//Get all Faculties
router.get("/getallusers/:role", async (req, res) => {
  const role = req.params.role;
  try {
    const UserData = await User.findAll({
      where: {
        Role: role
      },
      include: [
        {
          model: Subjects, // Directly include Subjects instead of UserSubject
          as: "Subjects", // This should match the alias you used in the association
        },
      ],
    });
    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });
    res.json(UserData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


//Get all Faculties who are not admins
router.get("/getonlyfaculties", async(req,res) =>{
  const FacultyData = await User.findAll({
    where:{
      isFaculty: true,
      isAdmin: false
    }
  })
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(FacultyData);
});

//Get all Admins
router.get("/getalladmins", async(req,res) =>{
  const FacultyData = await User.findAll({
    where:{
      isAdmin: true
    }
  })
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(FacultyData);
});

//Get User by id
router.get("/getuser/:UserID", async (req, res) => {
  const UserID = req.params.UserID;
  // console.log(contactID);
  const FacultyData = await User.findByPk(UserID,{
    include: [
      {
        model: Subjects, // Directly include Subjects instead of UserSubject
        as: "Subjects", // This should match the alias you used in the association
      },
    ],
  });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(FacultyData);
});

//Get Faculty by id
router.get("/getfaculty/:UserID", async (req, res) => {
  const UserID = req.params.UserID;
  // console.log(contactID);
  const FacultyData = await User.findByPk(UserID);
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(FacultyData);
});

//Get Student by id
router.get("/getstudent/:UserID", async (req, res) => {
  const UserID = req.params.UserID;
  // console.log(contactID);
  const StudentData = await User.findByPk(UserID);
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(StudentData);
});


//DELETE APIs

// Delete the Contact by id
router.delete("/deletequestion/:QuestionID", async (req, res) => {
  const QuestionID = req.params.QuestionID;
  // console.log(contactID);
  const QuestionData = await Questions.destroy({
    where: {
      QuestionID: QuestionID
    },
  });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(QuestionData);
});

// Delete User by id
router.delete("/deletefaculty/:UserID", async (req, res) => {
  const UserID = req.params.UserID;
  // console.log(contactID);
  const FacultyData = await User.destroy({
    where: {
      UserID: UserID
    },
  });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(FacultyData);
});

// Delete User by id
router.delete("/deletestudent/:UserID", async (req, res) => {
  const UserID = req.params.UserID;
  // console.log(contactID);
  const StudentData = await User.destroy({
    where: {
      UserID: UserID
    },
  });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(StudentData);
});

// Delete Subject by id
router.delete("/deletesubject/:SubjectID", async (req, res) => {
  const SubjectID = req.params.SubjectID;
  // console.log(contactID);
  const SubjectData = await Subjects.destroy({
    where: {
      SubjectID: SubjectID
    },
  });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(SubjectData);
});

// Delete Chapter by id
router.delete("/deletechapter/:ChapterID", async (req, res) => {
  const ChapterID = req.params.ChapterID;
  // console.log(contactID);
  const ChapterData = await Chapters.destroy({
    where: {
      ChapterID: ChapterID
    },
  });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(ChapterData);
});

// Delete Note by id
router.delete("/deletenote/:NoteID", async (req, res) => {
  const NoteID = req.params.NoteID;
  // console.log(contactID);
  const NoteData = await Notes.destroy({
    where: {
      NoteID: NoteID
    },
  });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(NoteData);
});

// Delete QuestionPaper by id
// router.delete("/deletequestionpaper/:QuestionPaperID", async (req, res) => {
//   const QuestionPaperID = req.params.QuestionPaperID;
//   // console.log(contactID);
//   const QuestionPaperData = await QuestionPaper.destroy({
//     where: {
//       QuestionPaperID: QuestionPaperID
//     },
//   });
//   res.header({
//     "Content-Type": "application/json",
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
//     "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
//   });
//   res.json(QuestionPaperData);
// });




// Update APIs

// Updates Questions value
router.put("/updatequestion/:QuestionID", async (req, res) => {
  const QuestionID = req.params.QuestionID;
  bodyData = req.body;
  const QuestionData = await Questions.update(bodyData, {
    where: {
      QuestionID: QuestionID,
    },
  });

  if (QuestionData) {
    const updatedQuestionData = await Questions.findByPk(QuestionID);
    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });
    res.json(updatedQuestionData);
  } else {
    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });
    res.json(QuestionData);
  }
});

// updates User value
router.put("/updatestudent/:UserID", async (req, res) => {
  const UserID = req.params.UserID;
  bodyData = req.body;
  const StudentData = await User.update(bodyData, {
    where: {
      UserID: UserID,
    },
  });

  if (StudentData) {
    const updatedStudentData = await User.findByPk(UserID);
    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });
    res.json(updatedStudentData);
  } else {
    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });
    res.json(StudentData);
  }
});

// updates User value and modifies associated Subjects
router.put("/updateuser/:UserID", async (req, res) => {
  const UserID = req.params.UserID;
  const bodyData = req.body;
  
  // First, update User data (no change in this part)
  const FacultyData = await User.update(bodyData, {
    where: {
      UserID: UserID,
    },
  });

  if (FacultyData) {
    // After updating the user, check for subject changes
    if (bodyData.subjects && Array.isArray(bodyData.subjects)) {
      // Assume `subjects` is an array of Subject IDs that need to be associated with the user.
      const user = await User.findByPk(UserID);
      
      // Update the many-to-many relationship: set the subjects for the user
      await user.setSubjects(bodyData.subjects);  // This replaces the old subjects with the new ones.

      // Alternatively, if you want to add/remove subjects dynamically:
      // await user.addSubjects(newSubjectIds);  // To add new subjects
      // await user.removeSubjects(removeSubjectIds);  // To remove subjects
    }

    // Fetch updated data and send the response
    const updatedUserData = await User.findByPk(UserID, {
      include: Subjects, // Include Subjects to return them in the response
    });
    
    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });
    res.json(updatedUserData);
  } else {
    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });
    res.json(FacultyData);
  }
});

//forget password
router.put("/forgetpassword/:Email", async (req, res) => {
  const Email = req.params.Email;
  const bodyData = req.body;
  const FacultyData = await User.update(bodyData, {
    where: {
      Email: Email,
    },
  });

  if (FacultyData) {
    const updatedFacultyData = await User.findOne({where: {
      Email: Email,
    }});
    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });
    res.json(updatedFacultyData);
  } else {
    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });
    res.json(FacultyData);
  }
});


// Make Faculty a admin
router.put("/makeadmin/:UserID", async (req, res) => {
  const UserID = req.params.UserID;
  const FacultyData = await User.update({isAdmin:true}, {
    where: {
      UserID: UserID,
      Role:"Faculty"
    },
  });

  if (FacultyData) {
    const updatedFacultyData = await User.findByPk(UserID);
    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });
    res.json(updatedFacultyData);
  } else {
    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });
    res.json(FacultyData);
  }
});

// dismiss Faculty a admin
router.put("/dismissadmin/:UserID", async (req, res) => {
  const UserID = req.params.UserID;
  const FacultyData = await User.update({Role:"Subject_Admin"}, {
    where: {
      UserID: UserID,
      Role:"Faculty"
    },
  });

  if (FacultyData) {
    const updatedFacultyData = await User.findByPk(UserID);
    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });
    res.json(updatedFacultyData);
  } else {
    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });
    res.json(FacultyData);
  }
});

// updates Subject value
router.put("/updatesubject/:SubjectID", async (req, res) => {
  const SubjectID = req.params.SubjectID;
  bodyData = req.body;
  const SubjectData = await Subjects.update(bodyData, {
    where: {
      SubjectID: SubjectID,
    },
  });

  if (SubjectData) {
    const updatedSubjectData = await Subjects.findByPk(SubjectID);
    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });
    res.json(updatedSubjectData);
  } else {
    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });
    res.json(SubjectData);
  }
});

// updates Chapter value
router.put("/updatechapter/:ChapterID", async (req, res) => {
  const ChapterID = req.params.ChapterID;
  bodyData = req.body;
  const ChapterData = await Chapters.update(bodyData, {
    where: {
      ChapterID: ChapterID,
    },
  });

  if (ChapterData) {
    const updatedChapterData = await Chapters.findByPk(ChapterID);
    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });
    res.json(updatedChapterData);
  } else {
    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });
    res.json(ChapterData);
  }
});

// updates Note value
router.put("/updatenote/:NoteID", async (req, res) => {
  const NoteID = req.params.NoteID;
  bodyData = req.body;
  const NoteData = await Notes.update(bodyData, {
    where: {
      NoteID: NoteID,
    },
  });

  if (NoteData) {
    const updatedNoteData = await Notes.findByPk(NoteID);
    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });
    res.json(updatedNoteData);
  } else {
    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });
    res.json(NoteData);
  }
});

// updates QuestionPaper value
router.put("/updatequestionpaper/:QuestionPaperID", async (req, res) => {
  const QuestionPaperID = req.params.QuestionPaperID;
  bodyData = req.body;
  const QuestionPaperData = await QuestionPaper.update(bodyData, {
    where: {
      QuestionPaperID: QuestionPaperID,
    },
  });

  if (QuestionPaperData) {
    const updatedQuestionPaperData = await QuestionPaper.findByPk(QuestionPaperID);
    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });
    res.json(updatedQuestionPaperData);
  } else {
    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });
    res.json(QuestionPaperData);
  }
});




module.exports = router;
