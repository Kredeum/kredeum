//imports needed for this function
import axios from "axios";
import fs from "fs";
import FormData from "form-data";

export const pinFileToIPFS = (pinataApiKey, pinataSecretApiKey) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  //we gather a local file for this example, but any valid readStream source will work here.
  let data = new FormData();
  data.append("file", fs.createReadStream("./klogo.png"));

  //You'll need to make sure that the metadata is in the form of a JSON object that's been convered to a string
  //metadata is optional
  const metadata = JSON.stringify({
    name: "testname",
    keyvalues: {
      exampleKey: "exampleValue"
    }
  });
  data.append("pinataMetadata", metadata);

  //pinataOptions are optional
  const pinataOptions = JSON.stringify({
    cidVersion: 0,
    customPinPolicy: {
      regions: [
        {
          id: "FRA1",
          desiredReplicationCount: 1
        },
        {
          id: "NYC1",
          desiredReplicationCount: 2
        }
      ]
    }
  });
  data.append("pinataOptions", pinataOptions);

  return axios
    .post(url, data, {
      maxBodyLength: "Infinity", //this is needed to prevent axios from erroring out with large files
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey
      }
    })
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
};

pinFileToIPFS("b253abf46663a21f0e40", "34b0951ff74f6bd1bd30463d50c4de61b8cb4183503fb26fd59595d5c78fced2");
