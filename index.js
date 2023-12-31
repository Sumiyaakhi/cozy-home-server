const express =  require ('express')
const cors = require('cors')
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(express.json())
app.use(cors({
    origin:[
      // 'http://localhost:5173' ,
      "https://cozy-home-server.vercel.app/"
    ],
    credentials: true
  }))



console.log(process.env.DB_USER);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bszhib9.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const database = client.db("cozyHomeDB");
 const productsCollection = database.collection("products");
 const cartsCollection = database.collection("carts");


app.get('/products',async (req,res) =>{
    const result = await productsCollection.find().toArray();
    res.send(result)
})

app.get('/products/:id' , async(req ,res)=>{
    const id=req.params.id;
    const query={_id :new ObjectId(id)}
    const result=await productsCollection.findOne(query)
     res.send(result)
   })

   app.post('/carts', async(req,res)=>{
    const product = req.body;
    const result= await cartsCollection.insertOne(product)
    res.send(result) 
   })

   app.get('/carts',async(req,res)=>{
    const result = await cartsCollection.find().toArray();
    res.send(result);
   })

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res) =>{
    res.send("Hey there, cozy is here")
})

app.listen(port, ()=>{
    console.log(`server is running on Port : ${port}`);
})