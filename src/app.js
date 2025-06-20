import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import compression from "compression";
import path from 'path';
import session from "express-session";
import receiptRoutes from "./routes/receipt.routes.js";

dotenv.config();

//Routes import

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
//Middlewares
//session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || "yourSecretKeyHere",
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // Only secure in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
// app.use((req, res, next) => {
//   res.locals.nonce = crypto.randomBytes(16).toString('base64');
//   next();
// });
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
    },
  },
}));
app.use(compression());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));


//API REQUEST
app.use("/api", receiptRoutes);
// Serve the HTML file as the root route

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

//Check endpoint

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timeStamp: new Date().toISOString(),
    service: "Pearl and Luxury API",
  });
});
app.get('/', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/dashboard.html');
  } else {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  }
});
// app.use('*', (req,res) =>{
//     res.status(404).json({
//         error: 'Routes not define',
//         path: req.originalUrl,
//         method: req.method
//     })
// })

export default app;
