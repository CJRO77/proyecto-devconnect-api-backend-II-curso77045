import "dotenv/config";
import { sendTicketConfirmationEmail } from "./src/services/mail.service.js";

// Prueba de envío de correo electrónico

try {

    await sendTicketConfirmationEmail({
        to: process.env.MAIL_USER,
        userName: "Jonathan",
        eventTitle: "Conferencia Node.js",
        eventDate: "2026-12-20T18:00:00.000Z",
        eventLocation: "Buenos Aires",
        reservationCode: "TCK-PRUEBA-001",
        quantity: 1,
    });

    console.log("✅ Correo enviado correctamente");

} catch (error) {

    console.error("❌ Error al enviar el correo:");
    console.error(error.message);

}