/* mongodb-tonniakterbithi@gmail.com
*/
const express = require("express");
const app = express();
const ObjectId = require("mongodb").ObjectId;
// require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://library-management-system:DSUXgSDIiz7pGogH@cluster0.qtpo1.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("library_management_system");
        // const usercollection = database.collection("users");
        const booksCollection = database.collection("allbooksdata");
        app.get("/allBooks", async (req, res) => {
            // const limit = 10;
            const cursor = booksCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get("/allBooks/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await booksCollection.findOne(query);
            console.log(result);
            res.json(result);
        });


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);






/* 
async function run() {
    try {
        await client.connect();
        const database = client.db("shop-mart");
        const userCollection = database.collection("users");
        const user={name:"tonni"}
        userCollection.insertOne(user)




    } finally {
        // await client.close();
    }
}
run().catch(console.dir) ;*/

app.get('/', (req, res) => {
    res.send('Hello World 1')
})

app.listen(port, () => {
    console.log(`Listening to port`, port)
})