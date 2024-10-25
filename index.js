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
db.Subjects.hasMany(db.Chapters, { foreignKey: 'SubjectID', as: 'subjectChapters' });  // Changed alias to subjectChapters
db.Chapters.belongsTo(db.Subjects, { foreignKey: 'SubjectID', as: 'subject' });  // Changed alias to subject

// db.Subjects.hasMany(db.Notes, { foreignKey: 'SubjectID', as: 'notes' });
// db.Notes.belongsTo(db.Subjects, { foreignKey: 'SubjectID', as: 'subjects' });

// One-to-Many associations

db.Subjects.hasMany(db.Questions, { foreignKey: 'SubjectID', as: 'subjectQuestions' });  // Changed alias to subjectQuestions
db.Questions.belongsTo(db.Subjects, { foreignKey: 'SubjectID', as: 'questionSubject' });  // Changed alias to questionSubject

db.Chapters.hasMany(db.Questions, { foreignKey: 'ChapterID', as: 'chapterQuestions' });  // Changed alias to chapterQuestions
db.Questions.belongsTo(db.Chapters, { foreignKey: 'ChapterID', as: 'questionChapter' });  // Changed alias to questionChapter

db.StudentUser.hasMany(db.QuestionPaper, { foreignKey: 'StudentID', as: 'studentQuestionPapers' });  // Changed alias to studentQuestionPapers
db.QuestionPaper.belongsTo(db.StudentUser, { foreignKey: 'StudentID', as: 'student' });  // Changed alias to student

db.QuestionPaper.hasMany(db.QuestionPaperQuestions, { foreignKey: 'QuestionPaperID', as: 'questionPaperQuestions' });  // Changed alias to questionPaperQuestions
db.QuestionPaperQuestions.belongsTo(db.QuestionPaper, { foreignKey: 'QuestionPaperID', as: 'questionPaper' });  // Changed alias to questionPaper

db.Questions.hasMany(db.QuestionPaperQuestions, { foreignKey: 'QuestionID', as: 'questionQuestions' });  // Changed alias to questionQuestions
db.QuestionPaperQuestions.belongsTo(db.Questions, { foreignKey: 'QuestionID', as: 'question' });  // Changed alias to question


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
