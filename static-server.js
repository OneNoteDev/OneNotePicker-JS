const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();

const corsOptions = {
	origin: '*',
	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.listen(3000, () => console.log('Example app listening on port 3000!'));
