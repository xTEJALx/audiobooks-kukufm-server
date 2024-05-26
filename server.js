const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://tejal:tejal@cluster0.scmvtju.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


app.get('/audiobooks', async (req, res) => {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas for fetching audiobooks');
    
    const database = client.db('audiobooks-kuku');
    const collection = database.collection('audiobooks');
    const audiobooks = await collection.find({}).toArray();
    
    res.json(audiobooks);
  } catch (err) {
    console.error('Failed to fetch data', err);
    res.status(500).send('Failed to fetch data');
  } finally {
    await client.close();
  }
});


app.put('/audiobooks/rate', async (req, res) => {
  const { name, rating } = req.body;

  if (!name || rating === undefined) {
    return res.status(400).send('Book name and rating are required');
  }

  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas for updating rating');

    const database = client.db('audiobooks-kuku');
    const collection = database.collection('audiobooks');

    const result = await collection.updateOne(
      { name: name },
      { $push: { ratings: rating } }
    );

    if (result.matchedCount === 0) {
      res.status(404).send('Book not found');
    } else {
      res.send('Rating added successfully');
    }
  } catch (err) {
    console.error('Failed to update rating', err);
    res.status(500).send('Failed to update rating');
  } finally {
    await client.close();
  }
});

app.put('/audiobooks/review', async (req, res) => {
  const { name, review } = req.body;

  if (!name || !review) {
    return res.status(400).send('Book name and review are required');
  }

  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas for updating review');

    const database = client.db('audiobooks-kuku');
    const collection = database.collection('audiobooks');

    const result = await collection.updateOne(
      { name: name },
      { $push: { reviews: review } }
    );

    if (result.matchedCount === 0) {
      res.status(404).send('Book not found');
    } else {
      res.send('Review added successfully');
    }
  } catch (err) {
    console.error('Failed to update review', err);
    res.status(500).send('Failed to update review');
  } finally {
    await client.close();
  }
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
