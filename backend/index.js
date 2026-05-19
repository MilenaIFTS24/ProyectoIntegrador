import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

// 1. Importación de la conexión y relaciones
import sequelize from "./src/data/database.js";
import "./src/models/index.js"; 

// 2. Importación de Routers
import productsRouter from "./src/routes/products.router.js";
import offersRouter from "./src/routes/offers.router.js";
import eventsRouter from "./src/routes/events.router.js";
import reservationsRouter from "./src/routes/reservations.router.js";
import usersRouter from "./src/routes/users.router.js";
import authRouter from "./src/routes/auth.router.js";
import eventRegistrationsRouter from "./src/routes/eventRegistrations.router.js";

const app = express();

// --- MIDDLEWARES GLOBALES ---
app.use(express.json()); // Analiza cuerpos JSON
app.use(cors());         // Habilita peticiones desde Angular

// --- DEFINICIÓN DE RUTAS (API VERSIONING) ---
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/offers", offersRouter);
app.use("/api/events", eventsRouter);
app.use("/api/reservations", reservationsRouter);
app.use("/api/users", usersRouter);
app.use("/api/registrations", eventRegistrationsRouter);

// --- MANEJO DE ERRORES: RUTA NO ENCONTRADA ---
app.use((req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// --- INICIALIZACIÓN DEL SERVIDOR Y BASE DE DATOS ---
const PORT = process.env.PORT || 3000;

async function startApplication() {
  try {
    // 1. Autenticar conexión con Supabase
    await sequelize.authenticate();
    console.log('Conexión exitosa a PostgreSQL (Supabase).');

    // 2. Sincronizar modelos con la DB
    await sequelize.sync({ alter: true });
    console.log('Modelos y Relaciones de Sequelize sincronizados.');

    // 3. Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error crítico al iniciar la aplicación:', error);
    process.exit(1); // Cierra el proceso si no hay base de datos
  }
}

startApplication();