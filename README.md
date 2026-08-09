*DevConnect Backend II API*

-Backend desarrollado como proyecto académico para el curso ( BACKEND II de Coderhouse) utilizando Node.js, Express.js, MongoDB y Passport.js.

-Este proyecto implementa una API REST para la gestión de usuarios y eventos utilizando una arquitectura por capas (**Controller → Service → Repository**), autenticación mediante **JWT**, autorización basada en **roles**, contraseñas encriptadas con **bcrypt** y autenticación centralizada con **Passport.js**.


📚 **Tecnologías utilizadas**


Node.js
Express.js
MongoDB
Mongoose
Passport.js (passport-local, passport-jwt)
JSON Web Tokens (JWT)
bcrypt
Cookie-parser
Dotenv
Nodemon
Git
GitHub
Nodemailer


✅ **Funcionalidades implementadas**


- Crear usuarios
- Obtener todos los usuarios
- Obtener usuario por ID
- Actualizar usuario
- Eliminar usuario
- Validación de campos obligatorios
- Validación de formato de email
- Validación de email existente
- Encriptación de contraseñas con bcrypt
- Login de usuarios
- Registro de usuarios
- Obtención del usuario autenticado
- Logout
- Emisión de JWT
- Manejo de sesión mediante cookies HttpOnly
- Arquitectura por capas (Controller → Service → Repository)
- Protección de rutas privadas
- Control de acceso mediante roles
- Autenticación basada en cookies HttpOnly
- Inscripción de usuarios a eventos (tickets)
- Control de cupos disponibles
- Cancelación de inscripciones
- Notificación por email al confirmar una inscripción


🏗️ **Arquitectura del proyecto**


  El proyecto sigue una arquitectura por capas para mantener una correcta separación de responsabilidades.

  Controllers
      ↓
  Services
      ↓
  Repositories
      ↓
   Models
      ↓
   MongoDB

   Responsabilidad de cada capa
   Controllers: reciben las peticiones HTTP y construyen las respuestas.
   Services: contienen la lógica de negocio.
   Repositories: realizan las operaciones sobre la base de datos.
   Models: definen la estructura de los documentos de MongoDB mediante Mongoose.


🔐 **Autenticación**


*Estrategia*	                *Tipo*               	             *Descripción*

-register	               -passport-local	         -Registra un nuevo usuario validando sus datos y encriptando la contraseña.
-login	                   -passport-local	         -Valida las credenciales del usuario.
-current	               -passport-jwt	         -Obtiene el usuario autenticado desde el JWT almacenado en la cookie.

📡 **Rutas de sesión**


Base: /api/v1/sessions

MétodoRutaDescripciónRespuesta exitosaPOST/registerRegistra un nuevo usuario201 { "status": "success", "message": "Usuario registrado correctamente" }POST/loginAutentica al usuario y setea cookie currentUser200 { "status": "success", "message": "Login correcto" }GET/currentDevuelve los datos del usuario autenticado (requiere cookie válida)200 { "status": "success", "payload": { "id", "email", "role" } }POST/logoutElimina la cookie de sesión200 { "status": "success", "message": "Sesión cerrada correctamente" }

Credenciales inválidas o token ausente/inválido → 401 { "status": "error", "message": "..." }


👥 **Sistema de roles**

*User*

Puede:

Iniciar sesión.
Consultar eventos.

No puede:

Crear eventos.
Modificar eventos.
Eliminar eventos.
Administrar usuarios.

*Organizer*

Puede:

Crear eventos.
Modificar únicamente los eventos que él mismo creó.
Consultar eventos.
Cambiar el estado de sus propios eventos.

No puede:

Eliminar cualquier evento.
Administrar usuarios.

*Admin*

Tiene acceso completo al sistema.

Puede:

Administrar usuarios.
Crear eventos.
Modificar cualquier evento.
Eliminar cualquier evento.


📡 **Endpoints principales**

*Sessions*
POST   /api/v1/sessions/register
POST   /api/v1/sessions/login
POST   /api/v1/sessions/logout
GET    /api/v1/sessions/current

*Users*
GET    /api/v1/users
GET    /api/v1/users/:id
PUT    /api/v1/users/:id
DELETE /api/v1/users/:id

*Events*
GET    /api/v1/events
GET    /api/v1/events/:id
POST   /api/v1/events
PUT    /api/v1/events/:id
PATCH  /api/v1/events/:id/status


🔒 **Permisos de acceso**


Endpoint	                   User	          Organizer	              Admin
GET /events	                   ✅	            ✅	                ✅
POST /events                   ❌	            ✅	                ✅
PUT /events/ :id               ❌	            ✅ (solo propios)	✅
PATCH /events/:id/status	   ❌	            ✅ (solo propios)    ✅
GET /users	                   ❌	            ❌	                ✅


🔑 **Variables de entorno**

Ver .env.example. Se requieren:

PORT=3000
MONGODB_URI=mongodb://localhost:27017/devconnect
JWT_SECRET=tu_secreto_super_seguro
JWT_EXPIRES_IN=1h
NODE_ENV=development

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=tu_correo@gmail.com
MAIL_PASS=tu_contraseña_de_aplicación
MAIL_FROM=DevConnect <tu_correo@gmail.com>

⚠️ Si usás Gmail, MAIL_PASS debe ser una contraseña de aplicación (generada en https://myaccount.google.com/apppasswords 
con la verificación en 2 pasos activada), no la contraseña normal de la cuenta.



📂 **Estructura del proyecto**

src/
├── config/
│   ├── passport.config.js    # estrategias register, login y current
│   └── mailer.config.js      # transporter de Nodemailer
├── controllers/
├── models/
├── repositories/
├── routes/
├── services/
│   └── mail.service.js       # envío de emails de confirmación
├── utils/
│   ├── bcrypt.js
│   ├── jwt.js
│   └── generateReservationCode.js
├── app.js                    # passport.initialize()
└── server.js

⚙️ **Instalación**

```bash
npm install
```

▶️ Ejecutar el proyecto

```bash
npm run dev
```


🌐 **API Base**

http://localhost:3000/api/v1


## 🧪 Pruebas realizadas

- Registro de usuarios.
- Login.
- Logout.
- Usuario autenticado.
- CRUD de usuarios.
- CRUD de eventos.
- Protección mediante JWT.
- Protección por roles.
- Cambio de estado de eventos.
- Filtros de eventos.
- Paginación.
- Ordenamiento.
- Inscripción exitosa a un evento (con envío de email).
- Inscripción sin sesión.
- Inscripción a un evento inexistente.
- Inscripción a un evento cancelado o finalizado.
- Inscripción sin cupos disponibles.
- Inscripción duplicada para el mismo usuario y evento.
- Cancelación de una inscripción propia y liberación del cupo.
- Intento de cancelar un ticket ajeno.
- Consulta de inscriptos de un evento como usuario común.
- Consulta de inscriptos de un evento como organizer de otro evento.

## 🎟 Gestión de Eventos

La API permite:

- Crear eventos.
- Consultar eventos.
- Filtrar eventos.
- Ordenar resultados.
- Paginar resultados.
- Modificar eventos.
- Cambiar el estado de un evento.


## 🎫 Gestión de Tickets (Inscripciones)

La API permite que un usuario autenticado se inscriba a un evento publicado, controlando cupos disponibles, evitando inscripciones duplicadas,
 y notificando la confirmación por email.

**Modelo Ticket**

Representa la relación entre un usuario y un evento (solo referencias, sin datos embebidos):

## Campo	                               Tipo                                          Descripción
   user	                                 ObjectId	                             Referencia al usuario que se inscribió
   event	                             ObjectId	                             Referencia al evento
   quantity	                             Number	                                 Cantidad de lugares reservados (mínimo 1)
   status	                             String	                                 pending | confirmed | cancelled
   reservationCode	                     String	                                 Código único de reserva (ej. TCK-8F3A2X)
   cancelledAt	                         Date	                                 Fecha de cancelación (null si sigue activo)
   createdAt	                         Date	                                 Fecha de creación (automático)

**Estados del ticket**

-confirmed: la inscripción está vigente y ocupa cupo.
-pending: reservado pero no confirmado (ocupa cupo).
-cancelled: el usuario canceló, o fue anulado. No ocupa cupo. El documento nunca se elimina físicamente, solo cambia de estado.

**Flujo de inscripción**

-El usuario autenticado envía POST /api/v1/events/:eid/tickets.
-El servicio valida, en este orden:

 *El evento existe.
 *El evento está en estado published.
 *El evento no finalizó (date no es pasada).
 *quantity es un entero mayor a 0.
 *El usuario no tiene ya un ticket activo (pending/confirmed) para ese evento.
 *Hay cupos disponibles (capacity - tickets activos ≥ quantity).

Si todo es válido, se crea el ticket con status: "confirmed" y un reservationCode único.
Se envía un email de confirmación (si falla el envío, no afecta la creación del ticket).

**Regla de cupos**
Los cupos ocupados se calculan sumando el campo quantity de todos los tickets activos (pending o confirmed) de un evento. Los tickets cancelled no cuentan, 
por lo que cancelar un ticket libera el cupo automáticamente para nuevas inscripciones.

**Endpoints**
## Método	                     Ruta	           Acceso	                                       Descripción
POST	     /api/v1/events/:eid/tickets      	 Autenticado	                                 Inscribirse a un evento
GET	         /api/v1/tickets/my-tickets          Autenticado	                                 Ver mis inscripciones
GET	         /api/v1/events/:eid/tickets	     Organizer (dueño del evento) o Admin	         Ver inscriptos a un evento
PATCH	     /api/v1/tickets/:tid/cancel	     Dueño del ticket o Admin	                     Cancelar una inscripción

**Cancelación**
-Cambia status a cancelled y registra cancelledAt. El documento no se elimina.
-Solo puede cancelar el dueño del ticket o un admin.
-No se puede cancelar un ticket ya cancelado.

**Notificaciones por email**
Al confirmarse una inscripción, se envía un email con Nodemailer usando las credenciales definidas en variables de entorno (ver .env.example). Un fallo en el envío
 no revierte la creación del ticket, solo se registra en consola.

**Casos de prueba realizados**
✅ Inscripción exitosa (con envío de email)
✅ Inscripción sin sesión → 401
✅ Inscripción a evento inexistente → 404
✅ Inscripción a evento cancelado/finalizado → 409
✅ Inscripción sin cupo suficiente → 409
✅ Inscripción duplicada activa → 409
✅ Cancelación propia → cupo liberado
✅ Cancelación de ticket ajeno como user → 403
✅ Consulta de inscriptos como user común → 403
✅ Con


👨‍💻 **Autor**

Carlos Jonathan Rodriguez Osorio

Backend Developer in Training

## 📄 Licencia

Este proyecto fue desarrollado con fines educativos y de aprobación, como parte del curso Backend II de Coderhouse.
No está destinado para uso comercial.
