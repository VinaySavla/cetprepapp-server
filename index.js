const express = require("express");
const cors = require("cors");
const fs = require("fs");
const serverless = require("serverless-http");

const app = express();
const PORT = 4000;

// Uncomment the following lines if you're using HTTPS
// const https = require('https');
// const options = {
//   key: fs.readFileSync('./ec2.key'),
//   cert: fs.readFileSync('./ec2.crt')
// };

// app.use(session({
//   secret:"some secret",
//   cookie: {maxAge: 60000},
//   saveUninitialized: false,
//   store
// }))

app.use(express.json());
app.use(cors({
  credentials: true,
  origin: function (origin, callback) {
    return callback(null, true);
  }
}));

const db = require("./models");

// Foreign Keys

// One to Many
db.Subjects.hasMany(db.Chapters, { foreignKey: 'SubjectID', as: 'chapters' });
db.Chapters.belongsTo(db.Subjects, { foreignKey: 'SubjectID', as: 'subjects' });

db.Subjects.hasMany(db.Notes, { foreignKey: 'SubjectID', as: 'notes' });
db.Notes.belongsTo(db.Subjects, { foreignKey: 'SubjectID', as: 'subjects' });

db.Subjects.hasMany(db.Questions, { foreignKey: 'SubjectID', as: 'questions' });
db.Questions.belongsTo(db.Subjects, { foreignKey: 'SubjectID', as: 'subjects' });

db.Chapters.hasMany(db.Questions, { foreignKey: 'ChapterID', as: 'questions' });
db.Questions.belongsTo(db.Chapters, { foreignKey: 'ChapterID', as: 'chapters' });

// Many to Many
db.Questions.belongsToMany(db.QuestionPaper, { through: 'QuestionPaperQuestions', foreignKey: 'QuestionID' });
db.QuestionPaper.belongsToMany(db.Questions, { through: 'QuestionPaperQuestions', foreignKey: 'QuestionPaperID' });

db.FacultyUser.belongsToMany(db.Subjects, { through: 'FacultySubjects', foreignKey: 'FacultyID' });
db.Subjects.belongsToMany(db.FacultyUser, { through: 'FacultySubjects', foreignKey: 'SubjectID' });

// One To One
db.StudentUser.hasOne(db.QuestionPaper, { foreignKey: 'StudentID', as: 'questionpaper' });
db.QuestionPaper.belongsTo(db.StudentUser, { foreignKey: 'StudentID', as: 'studentuser' });

// Routers
const Contact = require("./routes/contact");
app.use("/api", Contact);

// Sync the database and start the server
db.sequelize.sync()
  .then(() => {
    // Uncomment the following line for local development with HTTPS
    // https.createServer(options, app).listen(PORT);

    // For local development
    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => {
        console.log(`Server running at port ${PORT}`);
      });
    }
  })
  .catch(err => {
    console.error("Failed to sync database:", err);
  });

// Run All Crons
const runCrons = require("./crons");
runCrons();

// Export the handler for serverless environments
module.exports.handler = serverless(app);
