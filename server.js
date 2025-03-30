const express = require('express');
const bodyParser = require('body-parser');
const citoyenRoutes = require('./routes/citoyenRoutes'); // Adjust path if necessary
const adminRoutes = require('./routes/adminRoutes')
const reclamationRoutes = require('./routes/reclamationRoutes')
const autoriteRoutes = require('./routes/autoriteRoutes')
const categorieRoutes = require('./routes/categorieRoutes')
const photoRoutes = require('./routes/photoRoutes')
const {sequelize} = require('./database/db')


const app = express();
const PORT = 3000;

const cors = require('cors');
app.use(cors());
// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Use the citoyen routes
app.use('/api', citoyenRoutes);
app.use('/api',adminRoutes);
app.use('/api',reclamationRoutes);
app.use('/api',autoriteRoutes);
app.use('/api',categorieRoutes);
app.use('/api',photoRoutes);

app.get("/api/sync",(req,res)=>{
  sequelize.sync({  alter: true })
    .then(() => {
      console.log("all tables have been synchronized (created/altered if needed).");
      res.send("all tables have been synchronized (created/altered if needed)");
    })
    .catch(err => {
      console.error("Error syncing tables:", err);
    });
})



app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

