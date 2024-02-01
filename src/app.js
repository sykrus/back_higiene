import express from "express";
import morgan from "morgan";
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importa el paquete cors

const port = process.env.PORT || 4000;



// Routes

import EstatusRoutes from "./routes/estatus.routes";
import AuthRoutes  from "./routes/auth.routes";
import UserRoutes  from "./routes/user.routes";
import DocumentosRoutes  from "./routes/documentos.routes";
import OrganigramaRoutes  from "./routes/organigrama.route";
import TipoDocumentosRoutes  from "./routes/tipo_documentos.routes";
import DocumentosPublicosRoutes  from "./routes/documentos_publicos.route";
import movimientosRoutes   from "./routes/movimientos.route";
import EmisoresRoutes  from "./routes/emisor.route";
import NormasRoutes  from "./routes/normas.route";
import AntecedentesRoutes  from "./routes/antecedentes.route";
import DocumentosControladosRoutes  from "./routes/documentos_controlados.route";
import FormatosRoutes  from "./routes/formatos.route";

const app = express();

// Configura CORS
app.use(cors({
   //origin: 'http://localhost:5173', // Cambia esto al dominio de tu aplicación Vue.js
     origin: 'http://172.16.0.65',
    optionsSuccessStatus: 200, // Algunas versiones de CORS pueden requerir esto
  }));

  // Configurar el encabezado 'Cache-Control' en todas las respuestas
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});


// Settings
app.set("port", port);

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(session({
  secret: 'hola', // Cambia esto a un valor seguro
  resave: false,
  saveUninitialized: true
}));

// Configurar middleware para servir archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static('uploads'));



// Routes

app.use("/api/estatus", EstatusRoutes);
app.use('/auth', AuthRoutes);
app.use('/user', UserRoutes);
app.use("/api/documentos", DocumentosRoutes);
app.use("/api/organigrama", OrganigramaRoutes);
app.use("/api/tipodocumentos", TipoDocumentosRoutes);
app.use("/api/documentos/publicos", DocumentosPublicosRoutes);
app.use("/api/movimientos", movimientosRoutes);
app.use("/api/emisores", EmisoresRoutes);
app.use("/api/normas", NormasRoutes);
app.use("/api/controlados", DocumentosControladosRoutes);
app.use("/api/antecedentes", AntecedentesRoutes);
app.use("/api/formatos", FormatosRoutes);



export default app;
