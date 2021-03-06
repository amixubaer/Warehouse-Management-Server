const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;

//middleware
// app.use(cors());
const corsConfig = {
  origin: true,
  credential: true,
}
app.use(cors(corsConfig))
app.options('*', cors(corsConfig))
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ttyvk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try{

      await client.connect();
      const carCollection = client.db('cars-den').collection('cars');

      app.get('/cars', async (req, res) => {
        const query = {};
        const cursor = carCollection.find(query);
        const cars = await cursor.toArray();
        res.send(cars);
      });


      app.get('/cars/:id', async(req, res) =>{
        const id = req.params.id;
        const query={_id: ObjectId(id)};
        const cars = await carCollection.findOne(query);
        res.send(cars);
    });


    // POST
    app.post('/cars', async(req, res) =>{
      const newCar = req.body;
      const result = await carCollection.insertOne(newCar);
      res.send(result);
  });


  // DELETE

  app.delete("/carDelete/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: ObjectId(id) };

    const result = await carCollection.deleteOne(filter);

    res.send(result);
  });

  // UPDATE
  app.put("/cars/:id", async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const filter = { _id: ObjectId(id) };
    const options = { upsert: true };

    const updateCar = {
      $set: {
        quantity: data.quantity,
        sold: data.sold,
      },
    };

    const result = await carCollection.updateOne(
      filter,
      updateCar,
      options
    );
    res.send(result);
  });


  // LOGIN
  app.post('/login', async (req, res) => {
    const user = req.body;
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d'
    });
    res.send({ accessToken });
})

  }

  finally{

  }
}


run().catch(console.dir);

app.get('/', (req,res) =>{
    res.send('Hello!')
});



app.listen(port, () =>{
    console.log('Listening to port', port)
})