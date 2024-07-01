const Database = require("../database/Database");

class OrderController extends Database {
  async createOrder(req, res) {
    try {
      const { client_id, address, observations, products } = req.body;

      if (!client_id || !address || !products || products.length === 0) {
        return res.status(400).json({
          error: "Client_id, address, and at least one product are required"
        });
      }

      let total = 0;

      // Calcular o total com base nos produtos
      for (const item of products) {
        const product = await this.database.query(
          "SELECT price FROM products WHERE id = $1",
          [item.product_id]
        );
        if (product.rows.length === 0) {
          return res
            .status(404)
            .json({ error: `Product with id ${item.product_id} not found` });
        }
        total += parseFloat(product.rows[0].price) * parseFloat(item.amount);
      }

      // Inserir o pedido na tabela orders
      const orderQuery = `
          INSERT INTO orders (client_id, total, address, observations) 
          VALUES ($1, $2, $3, $4) 
          RETURNING *`;
      const orderValues = [client_id, total.toFixed(2), address, observations];
      const newOrder = await this.database.query(orderQuery, orderValues);

      const orderId = newOrder.rows[0].id;

      // Inserir os itens do pedido na tabela orders_items
      for (const item of products) {
        const product = await this.database.query(
          "SELECT price FROM products WHERE id = $1",
          [item.product_id]
        );
        const price = parseFloat(product.rows[0].price).toFixed(2);

        const orderItemQuery = `
            INSERT INTO orders_items (order_id, product_id, amount, price) 
            VALUES ($1, $2, $3, $4)`;
        const orderItemValues = [orderId, item.product_id, item.amount, price];
        await this.database.query(orderItemQuery, orderItemValues);
      }

      return res
        .status(201)
        .json({ message: "Order created successfully", orderId });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new OrderController();
