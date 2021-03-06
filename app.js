//We need to install the npm module @mailchimp/mailchimp_marketing.
//npm install @mailchimp/mailchimp_marketing
const mailchimp = require("@mailchimp/mailchimp_marketing");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
//The public folder which holds the CSS and images
app.use(express.static("public"));

app.get("/", function (req, res) {
 res.sendFile(__dirname + "/signUp.html");
});

//Setting up MailChimp
mailchimp.setConfig({
//replace with your api key
 apiKey: "", // remove my API key
//replace with last us-XX from api key
 server: "us10"
});


app.post("/", function (req,res) {

//change the values to according to your input attributes in html
const firstName = req.body.fName;
const secondName = req.body.lName;
const email = req.body.email;

//Your list/audience id
const listId = ""; //remove my listID

//Creating an object with the users data
const subscribingUser = {
 firstName: firstName,
 lastName: secondName,
 email: email
};

//Uploading the data to the server
 async function run() {
const response = await mailchimp.lists.addListMember(listId, {
 email_address: subscribingUser.email,
 status: "subscribed",
 merge_fields: {
 FNAME: subscribingUser.firstName,
 LNAME: subscribingUser.lastName
}
});

//If all goes well logging the contact's id
 res.sendFile(__dirname + "/success.html")
 console.log(
`Successfully added contact as an audience member. The contact's id is ${
 response.id
 }.`
);
}
//Running the function and catching the errors (if any)
//If anything goes wrong send the faliure page
 run().catch(e => res.sendFile(__dirname + "/failure.html"));
});

app.post("/failure", function(req, res){
  res.redirect("/")
})

app.listen(process.env.PORT || 3000, function () {
 console.log("Server is running at port 3000");
});
