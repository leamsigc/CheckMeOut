const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const expHandleBars =require('express-handlebars');

//require config msg
const configMail = require('./configMail');

const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//static folder
app.use('/public',express.static(path.join(__dirname,'public')));
app.set('port',(process.env.PORT || 3000));
app.engine('handlebars', expHandleBars());
app.set('view engine', 'handlebars');

app.use(cors());


app.get('/', (req , res) => {
    res.render('index');
});
app.post('/send', (req,res) => {
    if(
        req.body.captcha == undefined ||
        req.body.captcha == '' ||
        req.body.captcha == null
    ){
      return  res.json({"success":false,"msg":"please select captcha"});
    }

    //scqGoogleCaptcha
    const secretGoogleCaptchaKey = '---Secret-key---;
    //Verify url google 
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretGoogleCaptchaKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

    //make request to verify Url 
    request(verifyUrl,(err,response,body) => {
        body = JSON.parse(body);
        if(body.success !== undefined && !body.success){
            return  res.json({"success":false,"msg":"please select captcha"});
        }
        //successful
            configMail(req.body);
           return res.json({"success":true,"msg":"Thank you for your for contacting us"});        
    });

  // console.log(req.body);
});

app.listen(app.get('port'),() => {
    console.log(`server running at port${app.get('port')}`);
});