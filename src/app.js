import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routers/login.routes.js';
import config from './config.js';


const app = express();

// Reconstruir __filename y __dirname para las vistas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de la vista
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



//Milldeware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // Para manejar formularios

// Configuración de sesiones
app.use(session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// Rutas
app.use('/api', router);

//validar si la ruta no existe
app.use((req, res, next) => {
    res.status(404).json(
        {
            message: "Ruta no encontrada"
        });
})

export default app;