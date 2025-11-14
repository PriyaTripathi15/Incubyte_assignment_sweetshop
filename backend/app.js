const express = require('express');
require('express-async-errors'); // lets thrown errors bubble to error handler
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const sweetRoutes = require('./routes/sweets');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => res.json({ message: 'Sweets API' }));

app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);

// centralized error handler
app.use(errorHandler);

module.exports = app;

