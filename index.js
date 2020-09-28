const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectID;



const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://freshUser:TYHPtQ32NWDDz5Yt@cluster0.nt3jq.mongodb.net/freshdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})


client.connect(err => {
    const collection = client.db("freshdb").collection("products");
    app.post('/addProducts', (req, res) => {
        const product = req.body;
        collection.insertOne(product);
        res.redirect("/")
    })

    app.get('/products', (req, res) => {
        collection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            });
    })

    app.get('/product/:id', (req, res) => {
        collection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    app.patch('/update/:id', (req, res) => {
        collection.updateOne({ _id: ObjectId(req.params.id) }, {
            $set: { price: req.body.price, quantity: req.body.quantity }
        })
            .then(result => {
                res.send(result.modifiedCount > 0)
            })
    })

    app.delete('/delete/:id', (req, res) => {
        collection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0)
            })
    })

});


app.listen(3000, () => console.log('Listening to port 3000'));
