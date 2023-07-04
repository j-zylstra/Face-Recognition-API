
const USER_ID = 'joe_zylstra';
const APP_ID = 'Face-Recog';
const MODEL_ID = 'face-detection';
const PAT = 'cd5a5fa59c184dcbabd120c2bc287388';

const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "278c17706ad246d784a73fdffb3b57d7" + PAT);

const handleApiCall = (req, res) => {
  const imageURL = req.body.input;
   
  stub.PostModelOutputs(
    {
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID
      },
      model_id: MODEL_ID,
      
      inputs: [
        { data: { image: { url: imageURL, allow_duplicate_url: true} } }
      ]
    },
    metadata,
    (err, response) => {
      if (err) {
        throw new Error(err);
      }

      if (response.status.code !== 10000) {
        const errorMessage =
          "Post model outputs failed, status: " + response.status.description;
        console.error(errorMessage);
        res.status(500).json({ error: errorMessage });
        return;
      }

      // Since we have one input, one output will exist here.
      const output = response.outputs[0];

      console.log("Predicted concepts:");
      for (const concept of output.data.concepts) {
        console.log(concept.name + ": " + concept.value);
      }
      res.json(response);
      console.log(response);
    }
  );
};



const handleImage = (db) => (req, res) => {
   const { id } = req.body;
   db('users').where('id', '=', id)
   .increment('entries', 1)
   .returning('entries')
   .then(entries => {
      res.json(entries[0].entries);
    })
   .catch(err => res.status(400).json('unable to get entries'))
}


module.exports = {
    handleImage,
    handleApiCall
}