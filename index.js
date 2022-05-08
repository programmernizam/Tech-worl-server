const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4200;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
async function run() {
  try {
    await client.connect();
    const itemCollection = client.db("techWorld").collection("items");
    app.get("/items", async (req, res) => {
      const email = req.query.email;
      const query = {email: email};
      const cursor = itemCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
    });
    app.get("/items", async (req, res) => {
      const query = {};
      const cursor = itemCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
    });
    app.get("/items/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const item = await itemCollection.findOne(query);
      if (item) {
        res.send(item);
      } else {
        res.send("Record Not Found");
      }
    });

    app.post("/items", async (req, res) => {
      const newItem = req.body;
      const result = itemCollection.insertOne(newItem);
      res.send(result);
    });

    app.put("/items/:id", async (req, res) => {
      const id = req.params.id;
      const updateItem = req.body;
      const filter = {_id: ObjectId(id)};
      const option = {upsert: true};
      const updateDoc = {
        $set:{
          quantity : updateItem.updateQuantity
        }
      }
      const result = await itemCollection.updateOne(filter, updateDoc, option)
      res.send(result)
    });

    // Delete Items
    app.delete("/items/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await itemCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.listen(port, () => {
  console.log("Listing port:", port);
});
