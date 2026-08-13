import mongoose from "mongoose";

// Conexión a la base de datos MongoDB

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB conectado correctamente");
  } catch (error) {
    console.error("❌ Error al conectar MongoDB");
    console.error(error.message);

    process.exit(1);
  }
};