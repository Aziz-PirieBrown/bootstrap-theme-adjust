const { app } = require('@azure/functions');
app.setup({ enableHttpStream: false });
require('./functions/config');

require('./functions/ping');
