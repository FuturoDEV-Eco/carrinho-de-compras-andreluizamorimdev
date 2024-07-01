require("dotenv").config();

const express = require("express");

const clientsRoutes = require("./routes/clients.routes");
const productsRoutes = require("./routes/products.routes");

const app = express();

app.use(express.json());

app.use("/clients", clientsRoutes);
app.use("/products", productsRoutes);

const port = process.env.PORTA;

app.listen(port, () => {
  console.log(`Servidor online na porta ${port}`);
});
