const express = require("express");

const app = express();

const mongoose = require("mongoose");
const Product = require('./products')
mongoose
  .connect("mongodb+srv://*******:********@cluster0.o9omsat.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});
app.post("/api/products", (req, res, next) => {
  delete req.body.__v;
  const product = new Product({
    ...req.body,
  });
  product.save()
    .then(product => res.status(201).json({product}))
    .catch((error) => res.status(400).json({ error }));
});
app.put("/api/products/:id", (req, res, next) => {
  Product.updateOne({ _id: req.params.id }, { ...req.body})
    .then(() => res.status(200).json({ message: "Modified!" }))
    .catch((error) => res.status(400).json({ error }));
});
app.delete("/api/products/:id", (req, res, next) => {
  Product.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Deleted!" }))
    .catch((error) => res.status(400).json({ error }));
});
app.get("/api/products/:id", (req, res, next) => {
  console.log(req.params.id);
  Product.findOne({ _id: req.params.id })
    .then(product => res.status(200).json({ product }))
    .catch((error) => res.status(400).json({ error }));
});
app.get("/api/products", (req, res, next) => {
  Product.find()
    .then((products) => res.status(200).json({products}))
    .catch((error) => res.status(400).json({ error }));
});

module.exports = app;