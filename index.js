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


// //Many to Many
db.Questions.belongsToMany(db.QuestionPaper, { through: 'QuestionPaperQuestions', foreignKey: 'QuestionID' });
db.QuestionPaper.belongsToMany(db.Questions, { through: 'QuestionPaperQuestions', foreignKey: 'QuestionPaperID' });

db.FacultyUser.belongsToMany(db.Subjects, { through: 'FacultySubjects', foreignKey: 'FacultyID' });
db.Subjects.belongsToMany(db.FacultyUser, { through: 'FacultySubjects', foreignKey: 'SubjectID' });

// // //One To One
// db.StudentUser.hasOne(db.QuestionPaper, { foreignKey: 'StudentID', as: 'questionpaper' });
// db.QuestionPaper.belongsTo(db.StudentUser, { foreignKey: 'StudentID', as: 'studentuser' });



// Routers
const Contact = require("./routes/contact");
app.use("/api", Contact);


db.sequelize.sync().then(() => {
  // https.createServer(options, app).listen(PORT);
  app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
  });
});

// Run All Crons
const runCrons = require("./crons");
runCrons();
