import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/gamifylife"; // fallback for local testing
const client = new MongoClient(uri);

let db;
async function connectDB() {
  try {
    await client.connect();
    db = client.db('gamifylife');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}
connectDB();

// Default data (your full Google Sheet)
function defaultGoals() {
  return [
    { name: "Fitness Forest", color: "#C41E3A", subs: [
      { num: 1, name: "Cooking/Nutrition", goal: "Eat slow-carb-ish, yummy food without hating life", track: "Meals logged (Y/N) + fasting finish time", result: "Food is delicious fuel, never guilt or hassle" },
      { num: 2, name: "Exercise", goal: "Boxing + daily movement → visible muscle + energy", track: "Boxing sessions + 10-min movement streak", result: "Feel strong, powerful, and proud in my skin" },
      { num: 3, name: "Energy", goal: "Wake happy at 6 am, rate energy 8–10 every day", track: "Daily energy 1–10 + wake-up time", result: "Bound out of bed excited for the day" },
      { num: 4, name: "Rest", goal: "9 hrs sleep, in bed by 10 pm", track: "Bed time + actual hours slept", result: "Fall asleep fast, wake refreshed" }
    ]},
    { name: "Prosperity Palace", color: "#FFD700", subs: [
      { num: 1, name: "Business", goal: "$5k+ months from Techedge → coaching forever paid", track: "Monthly income + clients signed", result: "Coaching paid by my own empire" },
      { num: 2, name: "Coaching", goal: "Finish 6-week plan + quarterly retreats", track: "Coach tasks completed", result: "Mindset unbreakable" },
      { num: 3, name: "9-5 job", goal: "Salary covers life + fun money", track: "“Budget on track” checkmark", result: "Day job is easy, stress-free income" },
      { num: 4, name: "Debt", goal: "$0 non-house debt", track: "Current debt total", result: "Completely debt-free" }
    ]},
    { name: "Charisma Coast", color: "#FF69B4", subs: [
      { num: 1, name: "Family", goal: "Weekly sibling/parent connection", track: "Family connections this week", result: "Tight, loving family bond" },
      { num: 2, name: "Personal (with myself)", goal: "Love the mirror, love my thoughts", track: "Daily self-love score 1–10", result: "Look in the mirror and think “Damn, I’m beautiful”" },
      { num: 3, name: "Spiritual", goal: "Morning & night prayers + family class", track: "Prayer/class streak", result: "Feel God’s love every day" },
      { num: 4, name: "Networking", goal: "10 quality business contacts", track: "New connections + coffee/chats", result: "People light up when they see me" },
      { num: 5, name: "Friends", goal: "Monthly hangout with Tiv + 1 new champion friend", track: "Champion hangouts this month", result: "Surrounded by ride-or-die champions" }
    ]},
    { name: "Wisdom Wilds", color: "#00CED1", subs: [
      { num: 1, name: "Reading", goal: "4 books finished in 2026", track: "Books completed", result: "Mind constantly expanding" },
      { num: 2, name: "New skills", goal: "Play 1 full song on guitar or keyboard", track: "Practice minutes this week", result: "Host people effortlessly" },
      { num: 3, name: "Improving skills", goal: "Cook 3 new yummy recipes + confident small talk", track: "New recipes tried + social moments", result: "Conversations flow and I shine" },
      { num: 4, name: "Fun", goal: "Laugh every day, monthly memory made", track: "“Laughed out loud” checkmarks", result: "Life feels light, joyful" },
      { num: 5, name: "Traveling", goal: "4 new places visited in 2026", track: "Trips counter", result: "New stamps in my soul" }
    ]},
    { name: "Sanctuary Stronghold", color: "#7B68EE", subs: [
      { num: 1, name: "Cleanliness", goal: "Deep clean finished 12× this year", track: "Monthly deep-clean checklist %", result: "Walk into home and feel calm and proud" },
      { num: 2, name: "Declutter", goal: "Nothing in house unused in 6 months", track: "Bags donated / rooms decluttered", result: "Everything sparks joy" },
      { num: 3, name: "Overcoming fear", goal: "Do the scary thing same day I feel it", track: "Fear moments beaten this week", result: "Fear hits → I act → I feel invincible" },
      { num: 4, name: "Overcoming procrastination", goal: "2-Minute Blitz rule + big tasks started", track: "2-Minute Blitzes + frog eaten", result: "Momentum is my default" },
      { num: 5, name: "Overcoming foggy mind", goal: "No groggy days (wake & move in 10 min)", track: "Groggy days (goal: 0)", result: "Wake → move → win the day" }
    ]}
  ];
}

// Routes
app.get('/goals', async (req, res) => {
  const doc = await db.collection('goals').findOne({ id: 'master' });
  res.json(doc?.data || defaultGoals());
});

app.post('/goals', async (req, res) => {
  await db.collection('goals').updateOne(
    { id: 'master' },
    { $set: { data: req.body } },
    { upsert: true }
  );
  res.json({ success: true });
});

app.get('/blitz', async (req, res) => {
  const doc = await db.collection('blitz').findOne({ id: 'tasks' });
  res.json(doc?.tasks || []);
});

app.post('/blitz', async (req, res) => {
  await db.collection('blitz').updateOne(
    { id: 'tasks' },
    { $set: { tasks: req.body } },
    { upsert: true }
  );
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));