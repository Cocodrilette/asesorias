const express = require("express");
const app = express();
const fs = require("fs");
const port = 3000;

const { products } = require("./products.json");

app.use(express.json());

// GET http://localhost:3000/
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// GET http://localhost:3000/about
app.get("/about", (req, res) => {
  res.send("About");
});

// GET http://localhost:3000/product
app.get("/products", (req, res) => {
  res.json(products);
});

// POST http://localhost:3000/product
app.post("/products", (req, res) => {
  const { name, price } = req.body;
  const db = JSON.parse(fs.readFileSync("./products.json", "utf-8"));
  const id = db.products.length + 1;
  db.products.push({ id, name, price });
  fs.writeFileSync("./products.json", JSON.stringify(db));
  res.send({
    message: "Product added successfully",
    product: { id, name, price },
  });
});

// PUT http://localhost:3000/product
app.put("/products/:id", (req, res) => {
  let { id } = req.params;
  id = parseInt(id);
  console.log(typeof id);
  if (isNaN(id)) {
    return res.status(400).json({
      message: "You sent an invalid value",
      sent: id,
      expected: "number",
    });
  }

  const db = JSON.parse(fs.readFileSync("./products.json", "utf-8"));
  const isExistById = db.products.find((product) => product.id === id);
  if (!isExistById) {
    return res.status(400).json({
      message: `Doesn't exist a product with the id ${id}`,
    });
  }

  res.send(`Product id: ${id}`);
});

// DELETE http://localhost:3000/product
app.delete("/products", (req, res) => {
  res.send("DELETE products");
});

// GET http://localhost:3000/product
app.listen(port, () => {
  console.clear();
  console.log(`Example app listening on port ${port}`);
});
