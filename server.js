const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const registerRoutes = require('./routes/Registeration'); 
const PropertyRegisterRoutes = require('./routes/PropertyRegisteration'); 

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/api/Registeration', registerRoutes); 
app.use('/api/PropertyRegisteration',PropertyRegisterRoutes);

const PORT = 5500;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

