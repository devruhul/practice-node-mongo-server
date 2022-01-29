const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// user : mahfuj
// password : qCtGAFfPWWH3VJiE


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6jlv6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("products");
        const usersCollection = database.collection("users");

        // POST API for data insert
        app.post('/users', async (req, res) => {
            const newUser = req.body
            const result = await usersCollection.insertOne(newUser);
            res.json(result)
        })

        // GET API get all users
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const result = await cursor.toArray()
            console.log('data', result)
            res.json(result)
        })

        // data load by specific id

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await usersCollection.findOne(query)
            console.log('updated user id', result)
            res.json(result)
        })

        // Delete api using id
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await usersCollection.deleteOne(query)
            console.log('data deleted', result)
            res.json(result)

        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('hello from practice node server')
})

app.listen(port, () => {
    console.log('running on port', port)
})