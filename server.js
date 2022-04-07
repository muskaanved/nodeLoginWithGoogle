var express =  require('express');
var cors = require('cors')
require('dotenv').config()
const session = require('express-session');
const {google} = require('googleapis');
const gmailService = require('./services/GmailApi')
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const refresh = require('passport-oauth2-refresh')
var jwt = require('jsonwebtoken');
var morgan = require('morgan')

var app = express();

const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
  ]
};
app.use(cors(corsOpts))
app.use(morgan('combined'))
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET' ,
    cookie: { maxAge: 60000 }
  }));

var port = process.env.PORT || 3001

app.get('/',(req,res)=>{
    res.status(200).send("Working.......")
})


app.listen(port,()=>{
    console.log(`server is ready to port on ${port}`)
})



/* Changes for Git */
/*  PASSPORT SETUP  */

var userProfile;
var token ;
var refreshToken ;
var expires_in ;
var id_token ;


app.use(passport.initialize());
app.use(passport.session());

app.get('/success', (req, res) => res.send(
    {user: userProfile,token :token
    }));
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


/*  Google AUTH  */
 

const GOOGLE_CLIENT_ID = process.env.CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET;

var strategy = new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
function(accessToken, refresh_token,params, profile, done) {
    token = accessToken
    userProfile=profile;
    refreshToken=refresh_token
    id_token =params.id_token
    return done(null, userProfile ,token,refreshToken,id_token);
},

);
passport.use(strategy)
refresh.use(strategy);

 app.get('/auth/google',passport.authenticate('google',
  { scope : ['profile', 'email','https://mail.google.com/',],
   accessType: 'offline',
   prompt: 'consent',

}));       
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
   console.log("...",{user: userProfile,token :token ,refreshToken:refreshToken,id_token:id_token })
   res.redirect(`${process.env.REACT_APP_URL}/GoogleLogin?token=${id_token}&refreshToken=${refreshToken}&user=${userProfile._json.email}`);
});

app.get('/inbox', (req,res)=>{
  var numberOfEmail = req.headers.numberofemail
  var reqToken = req.headers.token
  var email = req.headers.user
  if(!reqToken){
    res.status(400).send({message:'please provide token'})
  }else{
      gmailService.readInboxInfo(email,token,numberOfEmail).then(message=>{
      res.status(200).send(message)
    });
  }
 
})

app.get('/verify',(req, res) =>{
  var token = req.headers.token
  var decoded = jwt.decode(token);
  var exp = decoded.exp;
  // exp in millis
 if (exp < Date.now() / 1000) {
    res.status(400).send({status:false,message:"token expired"})
  }else{
    res.status(200).send({status:true , message:"token valid"})
  }
});

app.get('/getRefreshToken',(req, res) =>{
    res.status(200).send({refreshToken:refreshToken})
});