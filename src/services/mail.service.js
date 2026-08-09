import { transporter } from "../config/mailer.config.js";

// Función para enviar un correo de confirmación de ticket

export const sendTicketConfirmationEmail = async ({
    to,
    userName,
    eventTitle,
    eventDate,
    eventLocation,
    reservationCode,
    quantity,
}) => {

    const formattedDate = new Date(eventDate).toLocaleString(
        "es-AR",
        {
            dateStyle: "long",
            timeStyle: "short",
        }
    );

    const text = `
Hola ${userName},

Tu inscripción al evento "${eventTitle}" quedó confirmada.

Código de reserva: ${reservationCode}
Fecha: ${formattedDate}
Lugar: ${eventLocation}
Cantidad de lugares: ${quantity}

Nos vemos ahí!
`.trim();

    await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject: `Confirmación de inscripción - ${eventTitle}`,
        text,
    });
};