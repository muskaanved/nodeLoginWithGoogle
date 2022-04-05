var express =  require('express');
var cors = require('cors')
require('dotenv').config()
const session = require('express-session');
const {google} = require('googleapis');
const gmailService = require('./services/GmailApi')

var app = express();
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
const passport = require('passport');
var userProfile;
var token ;
var message ;

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
 
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = process.env.CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET;
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3001/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      token = accessToken
      userProfile=profile;
     
      return done(null, userProfile , token);
  },

));
  

 app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email','https://mail.google.com/',
  
] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
  //    const email = userProfile._json.email
  // gmailService.readInboxInfo(email,token).then(message=>{
  //   res.status(200).send(message)
  // });

   
     res.redirect('/success');
    
    
  });
  

app.get('/inbox', (req,res)=>{
  const email = userProfile._json.email
  gmailService.readInboxInfo(email,token).then(message=>{
    res.status(200).send(message)
  });
})

  app.get('/logout', function(req, res) {
    req.session.destroy(null);
    res.clearCookie(this.cookie, { path: '/' });
    res.redirect('/');
});



