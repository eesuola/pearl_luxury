import app from "./app.js";
import { connectDB } from "./config/db.js";
import { configDotenv } from 'dotenv';

//Load Environment Variables
configDotenv();

const PORT = process.env.PORT || 5050;
const NODE_ENV = process.env.NODE_ENV || "development";

//Database Connection
async function startServer() {
  try {
    await connectDB();
    console.log("Database Connected Successfully");

    const server = app.listen(PORT, () => {
      console.log(`Business running on port ${PORT}`);
      console.log(`Environment: ${NODE_ENV}`);
      console.log(`server URL: http://localhost:${PORT}`);
    });
    process.on(`SIGTERM`, () => {
      console.log("SIGTERM received, shutting down gracefully");
      server.close(() => {
        console.log("process terminated");
      });
    });
  } catch (error) {
    console.error("failed to start server", error);
    process.exit(1);
  }
}
startServer();
