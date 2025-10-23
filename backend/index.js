import express from "express";
import cors from "cors"; // Para navegador. No es necesario si se utiliza Postman.

import teasProductsRouter from "./src/routes/teasProducts.router.js"; // teasProductsRouter (nombre personalizado) por uso de default
import craftsProductsRouter from "./src/routes/craftsProducts.router.js";
import offersRouter from "./src/routes/offers.router.js";
import eventsRouter from "./src/routes/events.router.js";
import reservationsRouter from "./src/routes/reservations.router.js";
import usersRouter from "./src/routes/users.router.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", teasProductsRouter); // Prefijo /api, buenas prácticas para versionamiento.
app.use("/api", craftsProductsRouter);
app.use("/api", offersRouter);
app.use("/api", eventsRouter);
app.use("/api", reservationsRouter);
app.use("/api", usersRouter);

app.use((req, res, next) => {
  // Middleware para manejar rutas no definidas (404).
  // Sirve para cualquier metodo.

  res.status(404).json({ error: "MIDDLE: Ruta no encontrada" })
  next();
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
