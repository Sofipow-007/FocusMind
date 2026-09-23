require('dotenv').config();

const app = require('./app');
const envConfig = require('./config/env');

app.listen(envConfig.port, () => {
  console.log(`FocusMind API escuchando en puerto ${envConfig.port}`);
});
