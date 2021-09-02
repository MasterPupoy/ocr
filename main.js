const express = require('express');
const app = express();
const cors = require('cors');
const pdfRoutes = require('./routes');
const path = require('path');

require('dotenv').config();

const PORT = process.env.PORT || 4001

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use('/file', express.static(path.join(__dirname,'uploads')));
app.use(express.static(__dirname + '/public'));

app.use('/', pdfRoutes )

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});

