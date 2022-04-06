var axios = require("axios");
class GmailAPI {

  // list of message id
  readMessages = async (gmail,accessToken) => {
    var config = {
      method: "get",
      url: ` https://gmail.googleapis.com/gmail/v1/users/${gmail}/messages`,
      headers: {
        Authorization: `Bearer ${await accessToken}`,
      },
    };

    var data = {};

    await axios(config)
      .then(async function (response) {
        data = await response.data.messages;
      })
      .catch(function (error) {
        console.log(error);
      });

    return data;
  };

  //get message
  getMessage = async (gmail,messageID , accessToken) => {
    var config = {
      method: "get",
      url: `https://content-gmail.googleapis.com/gmail/v1/users/${gmail}/messages/${messageID}`,
      headers: {
        Authorization: `Bearer ${await accessToken}`,
      },
    };

    var data = {};

    await axios(config)
      .then(async function (response) {
        data = await response.data;
      })
      .catch(function (error) {
        console.log(error.response);
      });

    return data;
  };


readInboxInfo = async (gmail , accessToken ,numberOfEmail) => {
  var message = [];
  const MessageIds = await this.readMessages(gmail,accessToken);
  if(MessageIds.length < numberOfEmail){
    message.push({
      numberOfEmail : numberOfEmail,
      message:" message is not there in your inbox"
    })
  }else{
    for(var i=0 ; i < numberOfEmail ; i++){
       message.push(await this.getMessage(gmail,MessageIds[i].id,accessToken));
      
     }
     // const message = await this.getMessage(threadId ,accessToken);
     // console.log(message.payload);
     // const encodedMessage = await message.payload["parts"][0].body.data;
     
     // const decodedStr = Buffer.from(encodedMessage, "base64").toString("ascii");
     
  }
  return message;
 
};


}

module.exports = new GmailAPI();