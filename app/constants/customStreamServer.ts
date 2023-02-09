let axios = require('axios');
let FormData = require('form-data');
let fs = require('fs');
let Config = {
  KEY: process.env.CUSTOM_STREAM_SERVER_KEY
}

export class CustomStreamServer {


  uploadV1(file) {
    return new Promise((resolve, reject) => {
      let URL = 'http://34.72.60.61:8000/';
      const data = new FormData();
      data.append('video', fs.createReadStream(file.path), );
      axios
        .post(URL, data, {
          headers: {
            'Content-Type': `multipart/form-data; boundary=${data._boundary}`
          },
        })
        .then((response) => {
          if (response.data) {
            fs.unlink(file.path, () => { console.log(`Deleted ${file.path}`) });
            console.log("data",response.data);
            resolve(URL+response.data.data);
          } else {
            console.log("error",response.data);
            reject(response.data.message);
          }
        })
        .catch((error) => {
          reject(error);
        });


    })
  }

}