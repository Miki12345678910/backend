const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

require('dotenv').config(); 

const app = express();
app.use(express.json());
app.use(cors({origin: "*"}));

console.log("Yhdistettävä MongoDB URI:", process.env.MONGO_URI);  

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Atlas yhdistetty"))
  .catch(err => console.error("Virhe MongoDB yhteydessä:", err));


app.get("/", (req, res) => {
  res.send("Riku!");
});

const SuosikkiSchema = new mongoose.Schema({
  itemName: String,
});

const Suosikki = mongoose.model("Suosikki", SuosikkiSchema);

app.post("/suosikit", async (req, res) => {
  try {
    const { itemName } = req.body;
    if (!itemName) {
      return res.status(400).json({ error: "itemName is required" });
    }

    const uusiSuosikki = new Suosikki({ itemName });
    await uusiSuosikki.save();

    res.status(201).json({ message: "Suosikki tallennettu!", data: uusiSuosikki });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/suosikit", async (req, res) => {
  try {
    const suosikit = await Suosikki.find();
    res.json(suosikit);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/suosikit/:id", async (req, res) => {
  try {
    await Suosikki.findByIdAndDelete(req.params.id);
    res.json({ message: "Suosikki poistettu" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server pyörii portissa ${PORT}`);
});
