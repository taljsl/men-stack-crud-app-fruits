// Here is where we import modules
// We begin by loading Express
const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const Fruit = require("./models/fruit.js");
app.use(express.urlencoded({ extended: false }));
const methodOverride = require("method-override"); // new
const morgan = require("morgan"); //new
app.use(methodOverride("_method")); // new
app.use(morgan("dev")); //new

// server.js
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}`);
});

// GET /
app.get("/", async (req, res) => {
  res.render("Index.ejs");
});

app.get("/fruits", async (req, res) => {
  const allFruits = await Fruit.find();
  console.log(allFruits);
  res.render("fruits/index.ejs", { fruits: allFruits });
});

app.get("/fruits/new", (req, res) => {
  res.render("fruits/new.ejs");
});

app.get("/fruits/:fruitId", async (req, res) => {
  const foundFruit = await Fruit.findById(req.params.fruitId);
  res.render("fruits/show.ejs", { fruit: foundFruit });
});

app.post("/fruits", async (req, res) => {
  if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }
  await Fruit.create(req.body);
  res.redirect("/fruits/new");
});

app.delete("/fruits/:fruitId", async (req, res) => {
    await Fruit.findByIdAndDelete(req.params.fruitId)
    res.redirect('/fruits')
  });

app.put('/fruits/:fruitId', async (req,res) => {
  if (req.body.isReadyToEat === 'on') {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }
  await Fruit.findByIdAndUpdate(req.params.fruitId, req.body)
  res.redirect(`/fruits/${req.params.fruitId}`)
})

app.get('/fruits/:fruitId/edit', async(req,res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId);
  console.log(foundFruit);
  res.render('fruits/edit.ejs', {
    fruit: foundFruit
  })
})

app.listen(3001, () => {
  console.log("Listening on port 3001");
});
