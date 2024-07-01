const Database = require("../database/Database");

class ClientController extends Database {
  async createClient(req, res) {
    try {
      const { name, email, cpf, contact } = req.body;

      if (!name || !email || !cpf || !contact) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const query = `INSERT INTO clients (name, email, cpf, contact) VALUES ($1, $2, $3, $4)`;
      const client = await this.database.query(query, [
        name,
        email,
        cpf,
        contact
      ]);
      return res.status(201).json({ message: "Client created successfully" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async listClients(req, res) {
    try {
      const filtros = req.query;
      if (filtros.filtro) {
        const query = `SELECT * FROM clients WHERE name LIKE $1 OR email LIKE $1 OR cpf LIKE $1 OR contact LIKE $1`;
        const clients = await this.database.query(query, [
          `%${filtros.filtro}%`
        ]);
        return res.status(200).json(clients.rows);
      } else {
        const query = `SELECT * FROM clients`;
        const clients = await this.database.query(query);
        return res.status(200).json(clients.rows);
      }
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getClient(req, res) {
    try {
      const { id } = req.params;

      const query = `SELECT * FROM clients WHERE id = $1`;

      const clientExists = await this.database.query(query, [id]);

      if (clientExists.rows.length === 0) {
        return res.status(404).json({ error: "Client not found" });
      }

      return res.status(200).json(clientExists.rows[0]);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async updateClient(req, res) {
    try {
      const { id } = req.params;
      const { name, email, cpf, contact } = req.body;

      const clientExists = await this.database.query(
        `SELECT * FROM clients WHERE id = $1`,
        [id]
      );

      const query = `UPDATE clients SET name = $1, email = $2, cpf = $3, contact = $4 WHERE id = $5`;

      const clientUpdated = await this.database.query(query, [
        name || clientExists.rows[0].name,
        email || clientExists.rows[0].email,
        cpf || clientExists.rows[0].cpf,
        contact || clientExists.rows[0].contact,
        id
      ]);

      res.json({
        message: "Client updated successfully",
        client: clientUpdated.rows[0]
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async deleteClient(req, res) {
    try {
      const { id } = req.params;

      const client = await this.database.query(
        `SELECT * FROM clients WHERE id = $1`,
        [id]
      );

      if (client.rowCount === 0) {
        return res.status(404).json({ error: "Client not found" });
      }

      const query = `DELETE FROM clients WHERE id = $1`;
      await this.database.query(query, [id]);
      return res.status(204).json();
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ClientController();
