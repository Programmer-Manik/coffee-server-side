const express = require('express')
const cors = require('cors')
const app = express()

const port = process.env.PORT||5000

// coffeopreration
// 1OzgTznPV5OtUip5

// middlewere use 
app.use(cors())
app.use(express.json())


// mongodb use 

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://coffeopreration:1OzgTznPV5OtUip5@cluster0.ifoquc5.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeDatabase = client.db("CoffeeDB");
    const coffeeCollection = coffeeDatabase.collection("coffeeCollection");


    //  read method

    app.get('/addcoffee', async(req, res)=>{

      const cursor = coffeeCollection.find();

      const result= await cursor.toArray()
      res.send(result)
    })


    // read  one document method

    app.get("/addcoffee/:id",async(req, res)=>{
      const id=req.params.id
     
      const query = { _id:new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result)

  

    })


              // // dynamic routing
              // app.get('addcoffee/:id',(req,res)=>{
              //   const id=req.params.body;
              //   console.log(id)
              // })



    // this is post method
    app.post('/addcoffee', async(req,res)=>{
      const data=req.body

      const doc = {
        name:data.name,
        photo:data.photo,
        description:data.description
      }
      const result=await coffeeCollection.insertOne(doc)
      res.send(result)
     
    })


    // update method
     
    app.put('/addcoffee/:id', async(req, res)=>{
      const id=req.params.id

      const filter = {_id:new ObjectId(id) };
      const info=req.body;
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name:info.name,
          photo:info.photo,
          description:info.description,

        },
      };
      const result = await coffeeCollection.updateOne(filter, updateDoc, options);
      res.send(result);
     
  
    })


    // delete method 
    app.delete("/deletecoffee/:id",async(req, res)=> {
     const id=req.params.id;
     
      const query = {_id:new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result)
    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})