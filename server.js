require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const path = require('path');

mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Connected to DB'))
  .catch(err => console.log(err.message));
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('secret'));
app.use(cors());
app.use(fileUpload());

app.use(express.static(path.join(__dirname, 'build')));

app.use('/api/user', require('./router/auth.route'));
app.use('/api/tab', require('./router/tab.route'));
app.use('/api/tag', require('./router/tag.route'));
app.use('/api/student', require('./router/student.route'));
app.use('/api/plan', require('./router/plan.route'));
app.use('/api/notifications', require('./router/notifications.route'));
app.use('/api/paymentLists', require('./router/paymentList.route'));

+app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 4000, console.log('Server runnning at port 4000'));


