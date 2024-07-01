const Database = require("../database/Database");

class ProductController extends Database {
  async createProduct(req, res) {
    try {
      const { name, amount, color, voltage, description, category_id } =
        req.body;

      if (!name || amount === undefined || !category_id) {
        return res
          .status(400)
          .json({ error: "Name, amount, and category_id are required" });
      }

      const query = `
        INSERT INTO products (name, amount, color, voltage, description, category_id) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *`;
      const product = await this.database.query(query, [
        name,
        amount,
        color,
        voltage,
        description,
        category_id
      ]);
      return res.status(201).json({
        message: "Product created successfully",
        product: product.rows[0]
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const { name, amount, color, voltage, description, category_id } =
        req.body;

      const productExists = await this.database.query(
        "SELECT * FROM products WHERE id = $1",
        [id]
      );

      if (productExists.rows.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      const query = `
        UPDATE products SET 
        name = $1, 
        amount = $2, 
        color = $3, 
        voltage = $4, 
        description = $5, 
        category_id = $6 
        WHERE id = $7 
        RETURNING *`;
      const productUpdated = await this.database.query(query, [
        name || productExists.rows[0].name,
        amount !== undefined ? amount : productExists.rows[0].amount,
        color || productExists.rows[0].color,
        voltage || productExists.rows[0].voltage,
        description || productExists.rows[0].description,
        category_id || productExists.rows[0].category_id,
        id
      ]);

      return res.json({
        message: "Product updated successfully",
        product: productUpdated.rows[0]
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;

      const productExists = await this.database.query(
        "SELECT * FROM products WHERE id = $1",
        [id]
      );

      if (productExists.rows.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      await this.database.query("DELETE FROM products WHERE id = $1", [id]);

      return res.status(204).json();
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ProductController();
