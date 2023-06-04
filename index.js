const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require('dotenv').config()
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fhpnqfy.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function run() {
  try {
    const serviceCollection = client.db('geniousCar').collection('service')
    const orderCollection = client.db('geniousCar').collection('orders')

    app.get('/service', async (req, res) => {
      const query = {}
      const cursor = serviceCollection.find(query)
      const services = await cursor.toArray()
      res.send(services)
    })
    app.get('/service/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const service = await serviceCollection.findOne(query)
      res.send(service)
    })

    //ordersCollection ApeI
    app.post('/orders', async (req, res) => {
      const order = req.body
      console.log(order)
      const result = await orderCollection.insertOne(order)
      res.send(result)
    })
    app.get('/orders', async (req, res) => {
      let query = {}

      if (req.query.email) {
        query = { email: req.query.email }
      }
      const cursor = orderCollection.find(query)
      const orders = await cursor.toArray()
      res.send(orders)
    })
    //update
    app.patch('/orders/:id', async (req, res) => {
      const id = req.params.id
      const status = req.body.status
      const filter = { _id: new ObjectId(id) }
      const updateDoc = {
        $set: {
          status: status,
        },
      }
      const result = await orderCollection.updateOne(filter, updateDoc)
      res.send(result)
    })
    //delete
    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await orderCollection.deleteOne(query)
      //console.log(result)
      res.send(result)
    })
  } finally {
    //await client.close()
  }
}
run().catch((error) => console.log('error:', error))

app.get('/', (req, res) => {
  res.send('genious car server is running')
})
app.listen(port, () => {
  console.log(`Genious car server running on${port}`)
})
