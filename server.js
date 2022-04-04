var express =  require('express');
var cors = require('cors')
require('dotenv').config()
const session = require('express-session');
var app = express();


app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET' 
  }));

var port = process.env.PORT || 3000

app.get('/',(req,res)=>{
    res.status(200).send("Working.......")
})


app.listen(port,()=>{
    console.log(`server is ready to port on ${port}`)
})




/*  PASSPORT SETUP  */
const passport = require('passport');
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.get('/success', (req, res) => res.send(userProfile));
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
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
  

 app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    main();
    res.redirect('/success');
    
  });
  app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})



// to get all messages 
const {google} = require('googleapis');
const gmail = google.gmail('v1');

 export default async function main() {
  const auth = new google.auth.GoogleAuth({
    // Scopes can be specified either as an array or as a single, space-delimited string.
    scopes: [
      'https://mail.google.com/',
      'https://www.googleapis.com/auth/gmail.addons.current.message.action',
      'https://www.googleapis.com/auth/gmail.addons.current.message.metadata',
      'https://www.googleapis.com/auth/gmail.addons.current.message.readonly',
      'https://www.googleapis.com/auth/gmail.metadata',
      'https://www.googleapis.com/auth/gmail.modify',
      'https://www.googleapis.com/auth/gmail.readonly',
    ],
  });

  // Acquire an auth client, and bind it to all future calls
  const authClient = await auth.getClient();
  google.options({auth: authClient});

  // Do the magic
  const res = await gmail.users.messages.get({
    // The format to return the message in.
    format: 'placeholder-value',
    // The ID of the message to retrieve. This ID is usually retrieved using `messages.list`. The ID is also contained in the result when a message is inserted (`messages.insert`) or imported (`messages.import`).
    id: 'placeholder-value',
    // When given and format is `METADATA`, only include headers specified.
    metadataHeaders: 'placeholder-value',
    // The user's email address. The special value `me` can be used to indicate the authenticated user.
    userId: 'placeholder-value',
  });
  console.log(res.data);

  // Example response
  // {
  //   "historyId": "my_historyId",
  //   "id": "my_id",
  //   "internalDate": "my_internalDate",
  //   "labelIds": [],
  //   "payload": {},
  //   "raw": "my_raw",
  //   "sizeEstimate": 0,
  //   "snippet": "my_snippet",
  //   "threadId": "my_threadId"
  // }
}

main().catch(e => {
  console.error(e);
  throw e;
});