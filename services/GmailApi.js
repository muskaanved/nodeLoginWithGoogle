var axios = require("axios");
// var qs = require("qs");

class GmailAPI {


//   getAcceToken = async () => {
//     var data = qs.stringify({
//       client_id:
//         "97362042616-gi00enukqpurpf2miirfio244.apps.googleusercontent.com",
//       client_secret: "JUk6I4zxz0lAvltJAhS",
//       refresh_token:
//         "1//0gzoM1QlCgYIARAAGBASNwF-Lp0Tom1emMG9eK0hXaTTCNkxFYatcupth-iwHVuf7oRumMVN7DivbMz6Pms",
//       grant_type: "refresh_token",
//     });
//     var config = {
//       method: "post",
//       url: "https://accounts.google.com/o/oauth2/token",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       data: data,
//     };

//     let accessToken = "";

//     await axios(config)
//       .then(async function (response) {
//         accessToken = await response.data.access_token;

//         console.log("Access Token " + accessToken);
//       })
//       .catch(function (error) {
//         console.log(error);
//       });

//     return accessToken;
//   };

  searchGmail = async (searchItem ,accessToken) => {
    var config1 = {
      method: "get",
      url:
        "https://www.googleapis.com/gmail/v1/users/me/messages?q=" + searchItem,
      headers: {
        Authorization: `Bearer ${await accessToken} `,
      },
    };
    var threadId = "";

    await axios(config1)
      .then(async function (response) {
        threadId = await response.data["messages"][0].id;

        console.log("ThreadId = " + threadId);
      })
      .catch(function (error) {
        console.log(error);
      });

    return threadId;
  };

  readGmailContent = async (messageId , accessToken) => {
    var config = {
      method: "get",
      url: `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
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
        console.log(error);
      });

    return data;
  };

  readInboxContent = async (searchText , accessToken) => {
    const threadId = await this.searchGmail(searchText,accessToken);
    const message = await this.readGmailContent(threadId ,accessToken);
    console.log(message.payload);
    const encodedMessage = await message.payload["parts"][0].body.data;

    const decodedStr = Buffer.from(encodedMessage, "base64").toString("ascii");

    

    return decodedStr;
  };

  readLabels = async (accessToken) => {
    var config = {
      method: "get",
      url: `https://gmail.googleapis.com/gmail/v1/users/avi.malakar95@gmail.com/labels`,
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
        console.log(error);
      });

    return data;
  };

}

module.exports = new GmailAPI();