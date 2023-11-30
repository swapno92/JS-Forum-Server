const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hktnvnf.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const postsCollection = client.db("forumDb").collection("posts");
    const votesCollection = client.db("forumDb").collection('votes');
    const commentsCollection = client.db('forumDb').collection('comments')

 app.post("/posts", async (req, res) => {
   const newPosts = req.body;
   // console.log(newAssignment);
   const result = await postsCollection.insertOne(newPosts);
   res.send(result);
 });


    app.get("/posts", async (req, res) => {
      const result = await postsCollection.find().toArray();
      res.send(result);
    });

    app.get("/posts/:id",  async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await postsCollection.findOne(query);
      res.send(result);
    });

    app.get("/post/:email", async (req, res) => {
      const email = req.params.email;
      const cursor = postsCollection.find({ authorEmail: email });
      const result = await cursor.toArray();
      res.send(result);
    });

    app.delete("/posts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await postsCollection.deleteOne(query);
      res.send(result);
    });

     app.put("/posts/:id", async (req, res) => {
       const id = req.params.id;
       const filter = { _id: new ObjectId(id) };
       const options = { upsert: true };
       const UpdatePosts = req.body;
       const posts = {
         $set: {
          vote: UpdatePosts.vote
         },
       };
       const result = await postsCollection.updateOne(
         filter,
         posts,
         options
       );
       res.send(result);
     });

     app.post("/votes", async (req, res) => {
       const newVote = req.body;
       const result = await votesCollection.insertOne(newVote);
       res.send(result);
     });

     app.post("/comments", async (req, res) => {
       const newComment = req.body;
       const result = await commentsCollection.insertOne(newComment);
       res.send(result);
     });

     app.get("/comments/:title", async (req, res) => {
       const title = req.params.title;
      //  title = title.replace(/\s+/g, "_");
      //  console.log(title)
       const cursor = commentsCollection.find({ titleID: title });
       const result = await cursor.toArray();
       res.send(result);
     });

      app.get("/com/:id",  async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await commentsCollection.findOne(query);
      res.send(result);
    });


   
   

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("posts is running");
});

app.listen(port, () => {
  console.log(`Posts is running on port ${port}`);
});
