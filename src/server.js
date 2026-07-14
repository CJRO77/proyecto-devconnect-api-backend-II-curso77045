import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/database.js";


const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`📡 API base disponible en http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error("No fue posible iniciar el servidor.");
  }
};

startServer();