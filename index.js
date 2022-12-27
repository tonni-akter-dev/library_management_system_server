/* mongodb-tonniakterbithi@gmail.com*/
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
        const booksCollection = database.collection("allbooksdata");

        /* admin collection starts*/
        const adminaddBooksCollection = database.collection("addedBooksByAdmin");
        const adminaddThesisCollection = database.collection("addedThesisByAdmin");
        const adminListCollection = database.collection("addAdmin");
        const userListCollection = database.collection("addUser");
        /* admin collection ends */
        app.get("/allBooks", async (req, res) => {
            const cursor = booksCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });
        app.get("/homebooks", async (req, res) => {
            const limit = 8;
            const cursor = booksCollection.find({}).limit(limit);
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

        app.post("/search", async (req, res) => {
            const { type, branch, search_field, search_text } = req.body;
            let query = {};
            if (branch) {
                query['library'] = branch
            }
            if (type) {
                query['type'] = type
            }
            const cursor = await booksCollection.find(query);
            const result = await cursor.toArray();
            const filtered_result = result.filter(item => {
                if (item[search_field]) {
                    const field = item[search_field];
                    if (typeof field === "string" && field.toLowerCase().includes(search_text?.toLowerCase())) {
                        return true;
                    } else {
                        return false
                    }
                } else {
                    return false
                }
            })
            console.log(filtered_result)
            res.json({ message: 'we are receive your request', data: filtered_result });
        });

        // admin book search

        app.post("/adminBookSearch", async (req, res) => {
            const { branch, search_field, search_text } = req.body;
            let query = {};
            if (branch) {
                query['library'] = branch
            }
          
            const cursor = await booksCollection.find(query);
            const result = await cursor.toArray();
            const filtered_result = result.filter(item => {
                if (item[search_field]) {
                    const field = item[search_field];
                    if (typeof field === "string" && field.toLowerCase().includes(search_text?.toLowerCase())) {
                        return true;
                    } else {
                        return false
                    }
                } else {
                    return false
                }
            })
            console.log(filtered_result)
            res.json({ message: 'we are receive your request', data: filtered_result });
        });






        app.post("/admin/search", async (req, res) => {
            const { search_field1, search_text } = req.body;
            console.log(search_text)
            let query = {};
            const cursor = await adminListCollection.find(query);
            const result = await cursor.toArray();
            const filtered_result = result.filter(item => {
                if (item[search_field1]) {
                    const field = item[search_field1];
                    if (field.toLowerCase().includes(search_text?.toLowerCase())) {
                        return true;
                    } else {
                        return false
                    }
                } else {
                    return false
                }
            })
            res.json({ message: 'we are receive your request', data: filtered_result });
        });
        app.post("/user/search", async (req, res) => {
            const { search_field2, search_text } = req.body;
            let query = {};
            const cursor = await userListCollection.find(query);
            const result = await cursor.toArray();
            const filtered_result = result.filter(item => {
                if (item[search_field2]) {
                    const field = item[search_field2];
                    if (field.toLowerCase().includes(search_text?.toLowerCase())) {
                        return true;
                    } else {
                        return false
                    }
                } else {
                    return false
                }
            })
            res.json({ message: 'we are receive your request', data: filtered_result });
        });
        /* admin starts */
        app.post("/addBooks", async (req, res) => {
            const books = req.body;
            const result = await adminaddBooksCollection.insertOne(books);
            console.log(result)
            res.json(result);
        });
        app.post("/addThesis", async (req, res) => {
            const books = req.body;
            const result = await adminaddThesisCollection.insertOne(books);
            console.log(result)
            res.json(result);
        });
        app.post("/addAdmin", async (req, res) => {
            const admin = req.body;
            const result = await adminListCollection.insertOne(admin);
            console.log(result)
            res.json(result);
        });
        app.get("/adminList", async (req, res) => {
            // const limit = 8;
            const cursor = adminListCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });
        app.get("/adminList/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await adminListCollection.findOne(query);
            res.json(result);
        });
        app.post("/addUser", async (req, res) => {
            const user = req.body;
            const result = await userListCollection.insertOne(user);
            console.log(result)
            res.json(result);
        });
        app.get("/updateAdminProfile", async (req, res) => {
            const cursor = adminListCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });
        app.get("/updateAdminProfile/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await adminListCollection.findOne(query);
            res.json(result);
        });
        app.post("/addUser", async (req, res) => {
            const user = req.body;
            const result = await userListCollection.insertOne(user);
            console.log(result)
            res.json(result);
        });
        app.get("/userList", async (req, res) => {
            // const limit = 8;
            const cursor = userListCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });
        app.get("/userList/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userListCollection.findOne(query);
            res.json(result);
        });

        // update profile
        app.put('/updateProfile/:id', async (req, res) => {
            const id = req.params.id
            const query = req.body;
            const filter = {
                _id: ObjectId(id)
            };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    ...query
                },
            };
            const result = await adminListCollection.updateOne(filter, updateDoc, options);

            res.json(result)
        });
        app.put('/updateUserProfile/:id', async (req, res) => {
            const id = req.params.id
            const query = req.body;
            const filter = {
                _id: ObjectId(id)
            };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    ...query
                },
            };
            const result = await userListCollection.updateOne(filter, updateDoc, options);

            res.json(result)
        });
        // delete admin
        app.delete("/adminList/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await adminListCollection.deleteOne(query);
            console.log(result)
            res.send(result);
        });
        app.delete("/admin/search/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await adminListCollection.deleteOne(query);
            console.log(result)
            res.send(result);
        });
        // delete user
        app.delete("/userList/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userListCollection.deleteOne(query);
            console.log(result)
            res.send(result);
        });
        app.delete("/user/search/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userListCollection.deleteOne(query);
            console.log(result)
            res.send(result);
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