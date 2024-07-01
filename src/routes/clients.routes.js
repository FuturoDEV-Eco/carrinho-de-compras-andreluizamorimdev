const { Router } = require("express");

const ClientController = require("../controllers/ClientController");

const clientsRoutes = new Router();

clientsRoutes.post("/", ClientController.createClient.bind(ClientController));
clientsRoutes.get("/", ClientController.listClients.bind(ClientController));
clientsRoutes.get("/:id", ClientController.getClient.bind(ClientController));
clientsRoutes.put("/:id", ClientController.updateClient.bind(ClientController));
clientsRoutes.delete(
  "/:id",
  ClientController.deleteClient.bind(ClientController)
);

module.exports = clientsRoutes;
