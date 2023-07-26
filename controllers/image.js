const fetch = require('cross-fetch');

const returnClarifaiRequestOptions = (imageUrl) => {
  // Your PAT (Personal Access Token) can be found in the portal under Authentification
  //const PAT = process.env.API_CLARIFAI;
  const PAT = 'cd5a5fa59c184dcbabd120c2bc287388';
  const USER_ID = 'joe_zylstra';
  const APP_ID = 'Face-Recog';
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
          },
        },
      },
    ],
  });


const requestOptions = {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    Authorization: 'Key ' + PAT,
  },
  body: raw,
};
return requestOptions;
};

const handleApiCall = (req, res) => {
  fetch(
    `https://api.clarifai.com/v2/models/face-detection/versions/6dc7e46bc9124c5c8824be4822abe105/outputs`,
    returnClarifaiRequestOptions(req.body.input)
  )
    .then((response) => response.json())
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(400).json('unable to work with API'));
};


const handleImage = (req, res, db) => {
   const { id } = req.body;
   db('users')
   .where('id', '=', id)
   .increment('entries', 1)
   .returning('entries')
   .then((entries) => {
      res.json(entries[0].entries);
    })
   .catch(err => res.status(400).json('unable to get entries'))
};




module.exports = {
    handleImage,
    handleApiCall
};