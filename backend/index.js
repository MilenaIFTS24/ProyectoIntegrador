import dotenv from "dotenv";
// Configuración de variables de entorno
dotenv.config();
import express from "express";
import cors from "cors";


// 1. Importación de la conexión (Capa de Datos)
import sequelize from "./src/data/database.js";

// 2. Importación de Modelos (Obligatorio para que Sequelize los reconozca al sincronizar)
import "./src/models/products.model.js";

// 3. Importación de Routers
import productsRouter from "./src/routes/products.router.js";
import offersRouter from "./src/routes/offers.router.js";
import eventsRouter from "./src/routes/events.router.js";
import reservationsRouter from "./src/routes/reservations.router.js";
import usersRouter from "./src/routes/users.router.js";
import authRouter from "./src/routes/auth.router.js";



const app = express();

// --- MIDDLEWARES GLOBALES ---
app.use(express.json()); // Analiza cuerpos JSON
app.use(cors());         // Habilita peticiones desde tu Frontend Angular

// --- DEFINICIÓN DE RUTAS (API VERSIONING) ---
app.use("/api/auth", authRouter);
// Tal como solicitaste, unificamos tés y artesanías bajo /api/products
app.use("/api/products", productsRouter);

// Rutas pendientes de migración a SQL (mantienen su ruta original)
app.use("/api/offers", offersRouter);
app.use("/api/events", eventsRouter);
app.use("/api/reservations", reservationsRouter);
app.use("/api/users", usersRouter);

// --- MANEJO DE ERRORES: RUTA NO ENCONTRADA ---
app.use((req, res, next) => {
  res.status(404).json({ error: "MIDDLE: Ruta no encontrada" });
});
await sequelize.sync({ alter: true });
// --- INICIALIZACIÓN DEL SERVIDOR Y BASE DE DATOS ---
const PORT = process.env.PORT || 3000;

/**
 * Bootstrap: Función para asegurar que la base de datos esté lista 
 * antes de empezar a escuchar peticiones.
 */
async function startApplication() {
  try {
    // Autenticar conexión con Supabase
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa a PostgreSQL (Supabase).');

    // Sincronizar modelos con la DB
    // force: false no borra los datos; solo crea las tablas si no existen.
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos de Sequelize sincronizados.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor de CoreCode corriendo en: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error crítico al iniciar la aplicación:', error);
    process.exit(1); // Cierra el proceso si no hay base de datos
  }
}

startApplication();