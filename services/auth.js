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