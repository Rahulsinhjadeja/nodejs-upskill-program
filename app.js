const express = require('express');
const connectDB = require('./config/db_connection');
const studentRouter = require('./routes/studentRoutes');
const app = express();
const port = process.env.PORT || 3001;

connectDB();

app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.use('/public', express.static('public'));
app.use(studentRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the NodeJs Upskill Program!');
});
app.listen(port, () => console.log(`Listening from ${port} port.`));