const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
//get the app to use body-parser/necessery code to be able to pass through the body of the request.
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

//app.post get the data from the imput on the html file when pressed the button
app.post("/", function (req, res) {
    //getting the req made by the name of the input on the body html file.
    const firstName = req.body.firstName;
    const secondName = req.body.secondName;
    const email = req.body.email;

    var data = {
        members : [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: secondName
            }
        }]
    };
    const jsonData = JSON.stringify(data);

    //request to post data to the db
    const url = "https://us11.api.mailchimp.com/3.0/lists/4dd2cf4979";
    const option = {
        method: "POST",
        auth: "matheus1:33c9d572845ea0c8f89cfac9d70acba6-us11"
    }

    //fetch data from the form to my mail db
    const request = https.request(url, option, function(response){

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        //Show on the log, the data colected from the post data to the mailChimp.
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    })
    //send the fetched data to mailChimp.
    // request.write(jsonData);
    request.end();

});
//is called by the button on failure.html to redirect to the root route "/"
app.post("/failure", function (req, res) {
   res.redirect("/"); 
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000.");
});



//API Key
//33c9d572845ea0c8f89cfac9d70acba6-us11
//Audience ID || List ID
//4dd2cf4979