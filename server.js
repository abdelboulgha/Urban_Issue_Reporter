const express = require('express');
const bodyParser = require('body-parser');
const citoyenRoutes = require('./routes/citoyenRoutes'); // Adjust path if necessary
const adminRoutes = require('./routes/adminRoutes')

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Use the citoyen routes
app.use('/api', citoyenRoutes);
app.use('/api',adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

