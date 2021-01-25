const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const employees = require('./routes/api/employees');
const orders = require('./routes/api/orders');

const app = express();
let whitelist = ['http://localhost:3000/', 'https://svp-proj-caf-final.herokuapp.com/']
let corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions));

app.use(passport.initialize());

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json({limit: '25MB'}));

require('./config/passportConfig')(passport);

const port = process.env.PORT || 5000;

const mongodbURI = require('./config/keys').mongodbURI;

mongoose.connect(mongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Mongodb Cloud Cluster Connected');
}).catch((err) => {
    console.error(err);
});

// app.get('/', (req, res) => {
//     res.send('Hello World');
// });
app.use(express.static('./office-cafeteria/build'));

/*app.get("/",  (req, res) => {
    res.setHeader("Accept", "*");
    res.sendFile(path.resolve(__dirname, 'office-cafeteria', 'build', 'index.html'));
})*/


app.use('/api/employees', employees);
app.use('/api/orders', orders);

app.listen(port, () => {
    console.log(`Cafeteria Server is running on ${port}`);
});