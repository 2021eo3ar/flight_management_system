const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Set up views and static folders
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use('/static', express.static('static'));
app.use(express.urlencoded());

// Connect to MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/flight-booking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB database');
});

// Define mongoose schema for user and ticket
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});
const ticketSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  departure: String,
  arrival: String,
  id: String,
  date: String,
});

const Ticket = mongoose.model('Ticket', ticketSchema);
const User = mongoose.model('User', userSchema)

// Set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).render('index.pug');
});
// Define login and signup routes
app.get('/login', (req, res) => {
  res.status(200).render('login.pug');
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email, password: password })
    .then((user) => {
      if (!user) {
        res.send("Invalid username or password")
      } else {
        res.redirect('/ticket');
      }
    })
    .catch((err) => {
      console.log(err);
      alert("invalid user name or password");
      res.redirect("/signup");
    });
});

app.get('/signup', (req, res) => {
  res.status(200).render('signup.pug');
});
app.post('/signup', (req, res) => {
  var mydata = new User(req.body);
  mydata.save().then(() => {
    res.redirect("/ticket")
  }).catch(() => {
    res.status(400).send("error occurred while signing up")
    res.redirect("/signup")
  })
});

// Define ticket booking route
app.get('/ticket', (req, res) => {
  res.render('ticket.pug');
});

app.post('/ticket', (req, res) => {
  var mydata = new Ticket(req.body);
  mydata.save().then(() => {
    res.send("your ticket has saved")
  }).catch(() => {
    res.status(400).send("error occurred while signing up")
    res.redirect("/signup")
  })

});

// app.get('/ticket/:id', (req, res) => {
//   // Your code to retrieve the ticket from MongoDB and display it to the user
//   const ticketId = req.params.id;
//   const ticket = db.collection('tickets').findOne({ _id: ObjectId(ticketId) });
//   res.render('ticket', { ticket: ticket });
// })


// Start server
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
