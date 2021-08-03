const express = require('express');
const app = express();
const cors = require('cors');
const pdfRoutes = require('./routes');

require('dotenv').config();

const PORT = process.env.PORT || 4001

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', pdfRoutes )

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});

