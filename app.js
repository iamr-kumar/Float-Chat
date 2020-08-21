const express = require("express");
const routes = require("./routes/index");
const app = express();

// Set view engine
app.set("view engine", "ejs");

// Use express router
app.use(routes);


// Set port
var port = process.env.PORT;
if(port == null || port == "") {
    port = 3000;
}

app.listen(port, () => {
    console.log("Listening to port 3000");
})