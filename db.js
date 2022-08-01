const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://Admin:xatlvhNnzQmMGi3Q@backend-project.fif0jpf.mongodb.net/inventory?retryWrites=true&w=majority");

mongoose.connection.on('open', () => { console.log("Connected to mongodb") });
