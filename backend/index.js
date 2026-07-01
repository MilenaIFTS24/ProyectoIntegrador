import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import sequelize from "./src/data/database.js";
import "./src/models/index.js";

import productsRouter from "./src/routes/products.router.js";
import offersRouter from "./src/routes/offers.router.js";
import eventsRouter from "./src/routes/events.router.js";
import reservationsRouter from "./src/routes/reservations.router.js";
import usersRouter from "./src/routes/users.router.js";
import authRouter from "./src/routes/auth.router.js";
import eventRegistrationsRouter from "./src/routes/eventRegistrations.router.js";

const app = express();

// --- Middlewares Globales ---
app.use(express.json());
app.use(cors());

// --- Definición de Rutas ---
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/offers", offersRouter);
app.use("/api/events", eventsRouter);
app.use("/api/reservations", reservationsRouter);
app.use("/api/users", usersRouter);
app.use("/api/registrations", eventRegistrationsRouter);
app.use('/api/offers', offersRouter);

// --- Manejo de error: Ruta no encontrada ---
app.use((req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// --- Inicializacion de Servidor y Base de Datos ---
const PORT = process.env.PORT || 3000;

async function startApplication() {
  try {
    await sequelize.authenticate();

    await sequelize.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error crítico al iniciar la aplicación:', error);
    process.exit(1);
  }
}

startApplication();