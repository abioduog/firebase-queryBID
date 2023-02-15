const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const admin = require('firebase-admin');
const key = require('./appgyver.json');

admin.initializeApp({
  credential: admin.credential.cert(key),
});

const fireDB = admin.firestore(); 

const port = process.env.PORT || 5001;

const app = express();

// Use body-parser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


// Set up a simple route
app.get('/', (req, res) => {
  res.json('Hello Appgyver World!');
});

// create user profile
app.post('/creat-user-profile', (req, res) => {
  const {
    email,
    events,
    firstname,
    id,
    lastname,
    occupation,
    shortdescription,
    socialmedia,
    website
  } = req.body;
  fireDB.collection('usersProfile').add({
    email,
    events,
    firstname,
    id,
    lastname,
    occupation,
    shortdescription,
    socialmedia,
    website
  })
    .then((doc) => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: 'something went wrong' });
      console.error(err);
    });
});

// get all users profile
app.get('/users-profile', (req, res) => {
  fireDB.collection('userProfile').get()
    .then((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        data.push(doc.data());
      });
      return res.json(data);
    })
    .catch((err) => console.log(err));
});

// get single userProfile by email or id
app.get('/user-profile/:email', (req, res) => {
  fireDB.collection('userProfile').where('email', '==', req.params.email).get()
    .then((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        // data.push(doc.data());
        return res.json(doc.data()); 
      });
      // return res.json(data);
    })
    .catch((err) => console.log(err));
});

// update user profile
app.put('/update-user-profile/:email', (req, res) => {
  fireDB.collection('userProfile').where('email', '==', req.params.email).get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        fireDB.collection('userProfile').doc(doc.id).update(req.body);
      });
      return res.json({ message: 'profile updated successfully' }); 
    })
    .catch((err) => console.log(err));
});


// create event 
app.post('/create-event', (req, res) => {
  const {
    date,
    link,
    title,
    type,
    creatorId,
    creatorEmail,
  } = req.body;
  fireDB.collection('events').add({
    date,
    link,
    title,
    type,
    creatorId,
    creatorEmail,
  })
    .then((doc) => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: 'something went wrong' });
      console.error(err);
    });
});


// get events by creator email
app.get('/get-event/:email', (req, res) => {
  fireDB.collection('events').where('creatorEmail', '==', req.params.email).get()
    .then((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        data.push(doc.data());
      });
      // return data;
      return res.json(data);
    })
    .catch((err) => console.log(err));
});

// update event
app.put('/update-event/:id', (req, res) => {
  fireDB.collection('events').doc(req.params.id).update(req.body)
    .then(() => {
      res.json({ message: 'event updated successfully' });
    })
    .catch((err) => console.log(err));
});


// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


// module.exports = {
//   "type": process.env.type,
//   "project_id": process.env.project_id,
//   "private_key_id": process.env.private_key_id,
//   "private_key": process.env.private_key,
//   "client_email": process.env.client_email,
//   "client_id": process.env.client_id,
//   "auth_uri": process.env.auth_uri,
//   "token_uri": process.env.token_uri,
//   "auth_provider_x509_cert_url": process.env.auth_provider_x509_cert_url,
//   "client_x509_cert_url": process.env.client_x509_cert_url
// }
