/* mongodb-tonniakterbithi@gmail.com*/
const express = require("express");
const app = express();
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const port = process.env.PORT || 5000;
const fileUpload = require('express-fileupload');
const bcrypt = require("bcrypt");
app.use(cors());
app.use(express.json());
app.use(fileUpload());
const jwt = require("jsonwebtoken");
const JWT_SECRET =
    "hvdvay6ert7283928kjh93uhefiu2545()&&&*(*(jhkjfi78272jbkj?[]]pou89ywe";
const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://library-management-system:DSUXgSDIiz7pGogH@cluster0.qtpo1.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db("library_management_system");
        const booksCollection = database.collection("allbooksdata");
        /* admin collection starts*/
        const noticeBoard = database.collection("noticeBoard");
        const adminaddBooksCollection = database.collection("addedBooksByAdmin");
        const addBooksCollection = database.collection("addBooks");
        const adminaddThesisCollection = database.collection("addedThesisByAdmin");
        const adminListCollection = database.collection("addAdmin");
        const userListCollection = database.collection("addUser");
        const issueBookCollection = database.collection("IssueBooks");
        const imageaddcollection = database.collection("imageadd");
        // added line for merge with main
        const requestBookCollection = database.collection("requestBook");
        /* admin collection ends */
    // noticeboard
    app.get("/noticeboard", async (req, res) => {
        const cursor = noticeBoard.find({});
        const result = await cursor.toArray();
        res.send(result);
    });

    // update notice
    app.put('/updateNotice/:id', async (req, res) => {
        const id = req.params.id
        const query = req.body;
        console.log(query)
        const filter = {
            _id: ObjectId(id)
        };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                ...query
            },
        };
        const result = await noticeBoard.updateOne(filter, updateDoc, options);
        console.log(result);
        res.json(result)
    });


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
            res.json(result);
        });
        app.get("/viewBooks", async (req, res) => {
            const cursor = booksCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });
        app.get("/viewBooks/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await booksCollection.findOne(query);
            res.json(result);
        });
        app.delete("/viewBooks/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await booksCollection.deleteOne(query);
            res.send(result);
        });
        // user book search
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
            res.json({ message: 'we are receive your request', data: filtered_result });
        });

        // admin book search
        app.post("/adminBookSearch", async (req, res) => {
            const { branch, search_field, search_text } = req.body;
            let query = {};
            if (branch) {
                query['branch'] = branch
            }
            const cursor = await adminaddBooksCollection.find(query);
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
            res.json({ message: 'we are receive your request', data: filtered_result });
            console.log(" result", filtered_result);
        });

        app.post("/addBooks", async (req, res) => {
            const category = req.body.category;
            const callNo = req.body.callNo;
            const title = req.body.title;
            const ISBN10 = req.body.ISBN10;
            const authors = req.body.authors;
            const publisher = req.body.publisher;
            const edition = req.body.edition;
            const price = req.body.price;
            const publicationYear = req.body.publicationYear;
            const accessionNumber = req.body.accessionNumber;
            const tags = req.body.tags;
            const branch = req.body.branch;
            const description = req.body.description;
            // const pic = req.files.image;
            // const picData = pic.data;
            // const encodedPic = picData.toString('base64');
            // const imageBuffer = Buffer.from(encodedPic, 'base64');
            const book = {
                category, callNo, title, ISBN10, authors, publisher, edition, price, publicationYear, accessionNumber, tags, branch, description,

            }
            const result = await booksCollection.insertOne(book);
            console.log(result)
            res.json(result);
        });

        app.get("/addBooks1", async (req, res) => {
            const cursor = adminaddBooksCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get("/addImage", async (req, res) => {
            const cursor = imageaddcollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        // issueBookCollection
        app.post("/issueRequestForABook", async (req, res) => {
            const books = req.body;
            const result = await issueBookCollection.insertOne(books);
            res.json(result);
        });
        // get issurequest lists
        app.get("/issueRequestForABook", async (req, res) => {
            const cursor = issueBookCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });
        app.get("/issueRequestForABook/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await issueBookCollection.findOne(query);
            res.json(result);
        });
        app.post("/addThesis", async (req, res) => {
            const books = req.body;
            const result = await adminaddThesisCollection.insertOne(books);
            res.json(result);
        });
        app.get("/viewThesis", async (req, res) => {
            const cursor = adminaddThesisCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });
        app.get("/viewTheses/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await adminaddThesisCollection.findOne(query);
            res.json(result);
        });
        app.put('/updateBookInfo/:id', async (req, res) => {
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
            const result = await booksCollection.updateOne(filter, updateDoc, options);
            res.json(result)
        });

        app.put('/issueRequestForABook/:id', async (req, res) => {
            const id = req.params.id;
            // const uid = req.params.uid;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: "acceptRequest",
                    deleteIssueReq: "deleteIssueReq"
                },
            };
            const result = await issueBookCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        app.delete("/issueRequestForABook/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await issueBookCollection.deleteOne(query);
            res.send(result);
        });

        /* member routes start */
        // delete admin
        app.delete("/adminList/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await adminListCollection.deleteOne(query);
            res.send(result);
        });
        // admin search then delete
        app.delete("/admin/search/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await adminListCollection.deleteOne(query);
            res.send(result);
        });
        // delete user
        app.delete("/userList/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userListCollection.deleteOne(query);
            res.send(result);
        });
        // user search then delete
        app.delete("/user/search/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userListCollection.deleteOne(query);
            res.send(result);
        });
        // update admin profile
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
        // update user profile
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
        app.post("/admin/search", async (req, res) => {
            const { search_field1, search_text } = req.body;
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

        app.post("/addAdmin", async (req, res) => {
            const admin = req.body;
            const result = await adminListCollection.insertOne(admin);
            res.json(result);
        });
        app.get("/adminList", async (req, res) => {
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
            res.json(result);
        });
        app.get("/userList", async (req, res) => {
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
        /* member routes ends */



        // issuebooks fineone
        app.get("/extendReturnDate/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await issueBookCollection.findOne(query);
            res.json(result);
        });
        // app.get("/issueBook/:id", async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await issueBookCollection.findOne(query);
        //     res.json(result);
        // });

        // update return date work
        app.put('/issueBook/:id', async (req, res) => {
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
            const result = await issueBookCollection.updateOne(filter, updateDoc, options);
            res.json(result)
        });
        // if returned then delet from issue request list--------
        app.delete("/returnBook/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await issueBookCollection.deleteOne(query);
            res.send(result);
        });



        // login work
        app.post("/register", async (req, res) => {
            const { fullName, instituteId, department, userType, phoneNumber, instituteEmail, personalEmail, presentAdd, password } = req.body;

            const encryptedPassword = await bcrypt.hash(password, 10);
            try {
                // const {user} = req.body;
                const oldUser = await userListCollection.findOne({ instituteEmail })
                if (oldUser) {
                    return res.json({ error: "User Exists" });
                }
                const result = await userListCollection.insertOne({ fullName, instituteId, department, userType, phoneNumber, instituteEmail, personalEmail, presentAdd, password: encryptedPassword });
                res.json(result);
                res.send({ status: "ok" });
            } catch (error) {
                res.send({ status: "error" });
            }
        });
        app.post("/login-user", async (req, res) => {
            console.log(req.body);
            const { instituteEmail, password } = req.body;
            const user = await userListCollection.findOne({ instituteEmail: instituteEmail });
            console.log(user)
            if (!user) {
                return res.json({ error: "User Not found" });
            }
            if (await bcrypt.compare(password, user.password)) {
                const token = jwt.sign({ instituteEmail: user.instituteEmail }, JWT_SECRET);

                if (res.status(201)) {
                    return res.json({ status: "ok", data: token });
                } else {
                    return res.json({ error: "error" });
                }
            }
            res.json({ status: "error", error: "InvAlid Password" });
        });
        // get login user data
        app.post("/userData", async (req, res) => {
            const { token } = req.body;
            try {
                const user = jwt.verify(token, JWT_SECRET);
                /* , (err, res) => {
                    if (err) {
                        return "token expired";
                    }
                    return res;
                } */
                // console.log(user);
                // if (user == "token expired") {
                //     return res.send({ status: "error", data: "token expired" });
                // }
                const useremail = user.instituteEmail;
                // console.log(useremail)
                userListCollection.findOne({ instituteEmail: useremail })
                    .then((data) => {
                        res.send({ status: "ok", data: data });
                    })
                    .catch((error) => {
                        res.send({ status: "error", data: error });
                    });
            } catch (error) { }
        });
        app.put('/userData/:id', async (req, res) => {
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



        // user my account ar nijer nijer requested issue books show
        app.get("/userData", async (req, res) => {
            const cursor = userListCollection.find({});
            const result = await cursor.toArray();
            console.log(result)
            res.send(result);
        });
        app.get("/requestedBook", async (req, res) => {
            console.log(req.query)
            const email = req.query.instituteEmail;
            const query = { instituteEmail: email };
            const cursor = issueBookCollection.find(query);
            const result = await cursor.toArray();
            console.log(result)
            res.send(result);
        });

        // admin login
        app.use("/admin/login", async (req, res, next) => {
            try {
                const username = req.body.username;
                const pass = req.body.pass;
                console.log(username);
                console.log(pass);
                const user = await adminListCollection.find({ instituteEmail: username }).toArray();

                console.log(user);
                if (user.length > 0) {

                    if (user[0].password === pass) {

                        // user object
                        const tokenObject = {
                            name: user[0].FullName,
                            InstituteId: user[0].InstituteId,
                            Designation: user[0].Designation,
                            instituteEmail: user[0].instituteEmail,
                            presentAddress: user[0].presentAddress,
                            adminType: user[0].adminType
                        }
                       
                        const token = jwt.sign({
                            data: tokenObject
                        }, JWT_SECRET, {
                            expiresIn: '20000h'
                        });

                        return res.status(200).json({
                            success: {
                                token,
                                user: JSON.stringify(tokenObject)
                            }
                        });

                    } else {
                        return res.status(403).json({
                            errors: {
                                msg: "Invalid password",
                                type: "password"
                            }
                        })
                    }

                } else {
                    return res.status(403).json({
                        errors: {
                            msg: "Invalid user",
                            type: "user"
                        }
                    })
                }

            } catch (err) {
                return res.status(500).json({
                    errors: {
                        msg: "Internal server error"
                    }
                })
            }

        });

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World 1')
})

app.listen(port, () => {
    console.log(`Listening to port`, port)
})