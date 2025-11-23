import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
let db;

client.connect().then(() => {
  db = client.db('gamifylife');
  console.log('MongoDB connected');
});

// Helper: get user ID from header (sent by frontend)
const getUserId = (req) => req.headers['x-user-id'] || 'guest';

// Default data (your original sheet — loaded once per new user)
function defaultGoals() {
  return [
    { name: "Fitness Forest", color: "#C41E3A", mapZone: "Fitness Forest", subs: [
      { num: 1, name: "Cooking/Nutrition", goal: "Eat slow-carb-ish, yummy food without hating life", track: "Meals logged (Y/N) + fasting finish time", result: "Food is delicious fuel, never guilt or hassle" },
      { num: 2, name: "Exercise", goal: "Boxing + daily movement → visible muscle + energy", track: "Boxing sessions + 10-min movement streak", result: "Feel strong, powerful, and proud in my skin" },
      { num: 3, name: "Energy", goal: "Wake happy at 6 am, rate energy 8–10 every day", track: "Daily energy 1–10 + wake-up time", result: "Bound out of bed excited for the day" },
      { num: 4, name: "Rest", goal: "9 hrs sleep, in bed by 10 pm", track: "Bed time + actual hours slept", result: "Fall asleep fast, wake refreshed" }
    ]},
    // ... (add the rest of your zones exactly like before — or I can paste the full one if you want)
    // For now, even just one zone works perfectly
  ];
}

// Goals
app.get('/api/goals', async (req, res) => {
  const userId = getUserId(req);
  const doc = await db.collection('goals').findOne({ userId }) || { userId, data: defaultGoals() };
  res.json(doc.data);
});

app.post('/api/goals', async (req, res) => {
  const userId = getUserId(req);
  await db.collection('goals').updateOne(
    { userId },
    { $set: { data: req.body } },
    { upsert: true }
  );
  res.json({ success: true });
});

// Blitz tasks
app.get('/api/blitz', async (req, res) => {
  const userId = getUserId(req);
  const doc = await db.collection('blitz').findOne({ userId }) || { userId, tasks: [] };
  res.json(doc.tasks);
});

app.post('/api/blitz', async (req, res) => {
  const userId = getUserId(req);
  await db.collection('blitz').updateOne(
    { userId },
    { $set: { tasks: req.body } },
    { upsert: true }
  );
  res.json({ success: true });
});

app.listen(process.env.PORT || 3000);