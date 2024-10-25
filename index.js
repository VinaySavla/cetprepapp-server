const express = require("express");
const app = express();
const cors = require("cors");
const fs = require('fs');
// const session = require("express-session");
// const store = new session.MemoryStore();
const PORT = 4000;

// const https = require('https');

// const options = {
//   key: fs.readFileSync('./ec2.key'),
//   cert: fs.readFileSync('./ec2.crt')
// };

// https.createServer(options, app).listen(PORT);

// app.use(session({
//   secret:"some secret",
//   cookie: {maxAge: 60000},
//   saveUninitialized: false,
//   store
// }))

app.use(express.json());
app.use(cors({
  credentials: true,
  origin: function(origin, callback){
    return callback(null, true);
  }
}));

const db = require("./models");


//Foreign Keys

// //One to Many
db.Subjects.hasMany(db.Chapters, { foreignKey: 'SubjectID', as: 'chapters' });
db.Chapters.belongsTo(db.Subjects, { foreignKey: 'SubjectID', as: 'subjects' });

db.Subjects.hasMany(db.Notes, { foreignKey: 'SubjectID', as: 'notes' });
db.Notes.belongsTo(db.Subjects, { foreignKey: 'SubjectID', as: 'subjects' });

db.Subjects.hasMany(db.Questions, { foreignKey: 'SubjectID', as: 'questions' });
db.Questions.belongsTo(db.Subjects, { foreignKey: 'SubjectID', as: 'subjects' });

db.Chapters.hasMany(db.Questions, { foreignKey: 'ChapterID', as: 'questions' });
db.Questions.belongsTo(db.Chapters, { foreignKey: 'ChapterID', as: 'chapters' });

db.User.hasMany(db.QuestionPaper, { foreignKey: 'StudentID', as: 'questionpaper' });
db.QuestionPaper.belongsTo(db.User, { foreignKey: 'StudentID', as: 'user' });

db.QuestionPaper.hasMany(db.QPQuestions, { foreignKey: 'QuestionPaperID', as: 'questionpaper' });
db.QPQuestions.belongsTo(db.QuestionPaper, { foreignKey: 'QuestionPaperID', as: 'questionpaperquestions' });

db.Questions.hasMany(db.QPQuestions, { foreignKey: 'QuestionID', as: 'questions' });
db.QPQuestions.belongsTo(db.Questions, { foreignKey: 'QuestionID', as: 'questionquestions' });

// db.Subjects.hasMany(db.FacultyUserSubjects, { foreignKey: 'SubjectID', as: 'facultyusersubjects' });
// db.FacultyUserSubjects.belongsTo(db.Subjects, { foreignKey: 'SubjectID', as: 'subjects' });

// db.FacultyUser.hasMany(db.FacultyUserSubjects, { foreignKey: 'FacultyID', as: 'facultysubjects' });
// db.FacultyUserSubjects.belongsTo(db.FacultyUser, { foreignKey: 'FacultyID', as: 'FacultyUser' });

// //Many to Many
// db.Questions.belongsToMany(db.QuestionPaper, { through: 'QuestionPaperQuestions', foreignKey: 'QuestionID' });
// db.QuestionPaper.belongsToMany(db.Questions, { through: 'QuestionPaperQuestions', foreignKey: 'QuestionPaperID' });

// db.FacultyUser.belongsToMany(db.Subjects, { through: 'FacultySubjects', foreignKey: 'SubjectID' });
// db.Subjects.belongsToMany(db.FacultyUser, { through: 'FacultySubjects', foreignKey: 'SubjectID' });

// //One To One



// Routers
const Contact = require("./routes/contact");
app.use("/api", Contact);


db.sequelize.sync().then(() => {
  // https.createServer(options, app).listen(PORT);
  app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
  });
})
.catch(err => {
  console.error("Failed to sync database:", err);
});

// Run All Crons
const runCrons = require("./crons");
runCrons();
