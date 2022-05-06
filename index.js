const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

// MiddleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s7i3i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run(){
  try{
    await client.connect();
    const itemCollection = client.db("techWorld").collection("items");
    app.get('/items', async(req, res)=>{
      const query = {};
      const cursor =  itemCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
    })

    app.post('/items', async(req, res)=>{
      const newItem = req.body;
      const result = itemCollection.insertOne(newItem);
      res.send(result);n
    })
  }
  finally{

  }
}

run().catch(console.dir)

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.listen(port, () => {
  console.log("Listing port:", port);
});
