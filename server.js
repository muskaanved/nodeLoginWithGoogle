var express =  require('express');
var cors = require('cors');
require('dotenv').config()
const session = require('express-session');
const {google} = require('googleapis');
const gmailService = require('./services/GmailApi')

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const refresh = require('passport-oauth2-refresh')

var app = express();
app.use(cors())
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




/*  PASSPORT SETUP  */

var userProfile;
var token ;
var refreshToken ;
       
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
function(accessToken, refresh_token, profile, done) {
    token = accessToken
    userProfile=profile;
    refreshToken=refresh_token
    return done(null, userProfile , token,refreshToken);
},

);
passport.use(strategy)
refresh.use(strategy);

 app.get('/auth/google',passport.authenticate('google',
  { scope : ['profile', 'email','https://mail.google.com/',],
   accessType: 'offline',
   prompt: 'consent',

}
  
 
));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
   console.log("...",{user: userProfile,token :token ,refreshToken:refreshToken })
   res.redirect(`http://localhost:3000/GoogleLogin?token=${token}&refreshToken=${refreshToken}&user=${userProfile._json.email}`);
    
    
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

  app.get('/logout', function(req, res) {
    req.session.destroy(null);
    res.clearCookie(this.cookie, { path: '/' });
    res.redirect('/');
});


