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

// GET (paginated) http://localhost:3000/product?from=&limit=
app.get("/products/paginated", (req, res) => {
  let { from = 0, limit = 5 } = req.query;
  from = parseInt(from);
  limit = parseInt(limit);

  if (isNaN(from) || isNaN(limit)) {
    return res.status(400).json({
      message: "You sent an invalid value",
      sent: "string",
      expected: "number",
    });
  }

  const db = JSON.parse(fs.readFileSync("./products.json", "utf-8"));
  const products = db.products.slice(from, limit);

  res.send({
    paginated: `from: ${from} | limit ${limit}`,
    products,
  });
});

// GET http://localhost:3000/product
app.get("/products/:id", (req, res) => {
  let { id } = req.params;
  id = parseInt(id);

  if (isNaN(id)) {
    return res.status(400).json({
      message: "You sent an invalid value",
      sent: "string",
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

  const product = db.products.filter((product) => product.id === id);
  res.send({
    productId: id,
    product,
  });
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

// PUT http://localhost:3000/product/:id
app.put("/products/:id", (req, res) => {
  let { id } = req.params;
  const { name, price } = req.body;
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
  const productIdx = db.products.findIndex((product) => product.id === id);
  if (productIdx === -1) {
    return res.status(400).json({
      message: `Doesn't exist a product with the id ${id}`,
    });
  }

  db.products[productIdx] = { id: db.products[productIdx].id, name, price };
  fs.writeFileSync("./products.json", JSON.stringify(db));

  res.send({
    message: "Product updated successfully",
    product: { id: db.products[productIdx].id, name, price },
  });
});

// DELETE http://localhost:3000/product/:id
app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  let db = JSON.parse(fs.readFileSync("./products.json", "utf-8"));
  const productIdx = db.products.findIndex((product) => product.id === id);

  if (productIdx === -1) {
    return res.status(400).json({
      message: `Doesn't exist a product with the id ${id}`,
    });
  }

  db = db.products.filter((products) => products.id !== id);
  fs.writeFileSync("./products.json", JSON.stringify(db));

  res.send({
    message: "Product updated successfully",
    product: { id: db.products[productIdx].id, name, price },
  });
});

// GET http://localhost:3000/product
app.listen(port, () => {
  console.clear();
  console.log(`Example app listening on port ${port}`);
});
