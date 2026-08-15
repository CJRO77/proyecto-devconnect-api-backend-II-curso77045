*DevConnect Backend II API*

-Backend desarrollado como proyecto académico para el curso ( BACKEND II de Coderhouse, curso77045) utilizando Node.js, Express.js, MongoDB y Passport.js.

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
- El registro público nunca acepta role desde el body: siempre se crea como user
- Login de usuarios
- Registro de usuarios
- Obtención del usuario autenticado
- Logout
- Emisión de JWT
- Manejo de sesión mediante cookies HttpOnly
- Arquitectura en capas (Controller → Service → Repository → DAO → Model)
- DTOs para controlar los datos expuestos en cada respuesta (ningún endpoint expone password)
- Middleware centralizado de manejo de errores con códigos HTTP diferenciados (400/401/403/404/409/500)
- Protección de rutas privadas mediante Passport (JWT en cookie)
- Control de acceso mediante roles (user, organizer, admin)
- Autenticación basada en cookies HttpOnly (Passport + JWT)
- Inscripción de usuarios a eventos (tickets)
- Control de cupos disponibles
- Prevención de inscripciones duplicadas
- Cancelación de inscripciones (sin borrado físico) con liberación automática de cupo
- Notificación por email al confirmar una inscripción (Nodemailer)


🏗️ **Arquitectura del proyecto**


  El proyecto sigue una arquitectura por capas para mantener una correcta separación de responsabilidades.

  Controllers
    ↓
  Services
    ↓
  Repositories
    ↓
  DAO
    ↓
  Models
    ↓
  MongoDB

# Responsabilidad de cada capa

Capa /Responsabilidad

**Controllers**
Reciben la petición HTTP, extraen body/params/query, llaman al service correspondiente y devuelven la respuesta. No contienen lógica de negocio ni importan modelos de Mongoose.

**Services**
Concentran toda la lógica de negocio: validaciones, permisos sobre recursos propios, cálculo de cupos, envío de emails, reglas de estado. Nunca importan modelos ni DAOs directamente: siempre pasan por el Repository. Lanzan errores mediante la clase ServiceError, que incluye el código HTTP correspondiente.

**Repositories**
Capa intermedia orientada al dominio. Exponen métodos con nombre de negocio (findUserByEmail, getActiveTicketRepository, countReservedSeatsRepository, etc.) y delegan el acceso a datos al DAO correspondiente. No importan modelos de Mongoose directamente.

**DAO**	
Única capa que importa los modelos de Mongoose. Expone operaciones genéricas de acceso a datos (findById, findOne, create, updateById, count, etc.). Un DAO por entidad: UserDAO, EventDAO, TicketDAO.

**DTO**
Funciones puras que transforman un documento (o resultado .lean()) en el objeto exacto que se expone en la respuesta HTTP, filtrando campos sensibles. Existen userDTO, eventDTO y ticketDTO. Ninguna respuesta de la API expone el campo password, ni siquiera hasheado. Cuando un documento viene con populate (por ejemplo el organizer de un evento, o el user/event de un ticket), el DTO también filtra esos datos relacionados con su propio DTO.

**Models**
Definen la estructura de los documentos de MongoDB mediante Mongoose (schemas, validaciones a nivel de base, índices).

# Por qué esta separación

Antes de esta refactorización, los repositories accedían directamente a los modelos de Mongoose, y algunos controllers hacían lo mismo. Esto acoplaba la lógica de negocio y de presentación al motor de base de datos concreto (Mongoose), y hacía fácil olvidarse de filtrar campos sensibles en alguna respuesta (de hecho, así se detectó y corrigió un caso real: 3 de los 5 endpoints de usuarios exponían el password hasheado antes de este refactor).

# Con la arquitectura actual:

Si mañana se cambia el motor de base de datos, solo se reescribe la capa DAO.
Si se necesita una nueva regla de negocio, se agrega en el Service, sin tocar cómo se accede a los datos.
Es imposible que una respuesta exponga password por accidente, porque el DTO nunca copia ese campo al objeto de salida — no se trata de "borrarlo", sino de que nunca se incluye.

🚨Manejo de errores

Todos los services lanzan una clase de error propia, ServiceError (src/utils/ServiceError.js), que extiende de Error e incluye un statusCode explícito.

Criterio de códigos HTTP usado en toda la API:

Código	Cuándo se usa
400	Datos inválidos (campos faltantes, formato incorrecto, valores fuera de rango)
401	No autenticado (sin sesión, token inválido, credenciales incorrectas en login)
403	Autenticado pero sin permisos sobre el recurso (no es dueño ni admin)
404	Recurso no encontrado, o id con formato inválido
409	Conflicto de negocio con el estado actual del recurso (email duplicado, evento cancelado, sin cupos, inscripción duplicada)
500	Error interno no esperado

# Caso particular: login y registro (Passport)

Las rutas POST /sessions/login y POST /sessions/register usan estrategias passport-local. Por defecto, Passport responde siempre 401 ante cualquier fallo de autenticación, sin distinguir "credenciales incorrectas" de "email ya registrado". Para respetar el criterio de códigos HTTP de la tabla anterior, se armó un middleware propio (src/middlewares/localAuth.middleware.js) que ejecuta la estrategia de Passport con un callback manual, lee el statusCode que el service adjunta al error, y responde con el código correcto (por ejemplo 409 si el email ya está registrado, en vez de un 401 genérico).


🔐 **Autenticación**


*Estrategia*	                *Tipo*               	             *Descripción*

-register	                 -passport-local	         -Registra un nuevo usuario validando sus datos y encriptando la contraseña.
-login	                   -passport-local	         -Valida las credenciales del usuario.
-current	                 -passport-jwt	           -Obtiene el usuario autenticado desde el JWT almacenado en la cookie.

📡 **Rutas de sesión**


Base: /api/v1/sessions

MétodoRutaDescripciónRespuesta exitosaPOST/registerRegistra un nuevo usuario201 { "status": "success", "message": "Usuario registrado correctamente" }POST/loginAutentica al usuario y setea cookie currentUser200 { "status": "success", "message": "Login correcto" }GET/currentDevuelve los datos del usuario autenticado (requiere cookie válida)200 { "status": "success", "payload": { "id", "email", "role" } }POST/logoutElimina la cookie de sesión200 { "status": "success", "message": "Sesión cerrada correctamente" }

Credenciales inválidas o token ausente/inválido → 401 { "status": "error", "message": "..." }

👤 **Usuarios de prueba**

Estos usuarios ya están cargados en la base de datos usada durante el desarrollo. Para replicar el ambiente en otra instalación, hay que registrarlos vía POST /sessions/register (quedan como user por defecto) y, para los roles organizer y admin, actualizar manualmente el campo role en MongoDB (Compass o mongosh), ya que el endpoint de actualización de perfil bloquea intencionalmente el cambio de role por seguridad.

# Email                      Rol	                                             Uso sugerido
jonathan2026@gmail.com	   admin	    Probar rutas exclusivas de admin: GET /users, POST /users, PUT /users/:id, DELETE /users/:id, modificar/cancelar cualquier evento,cancelarcualquier ticket
maria@example.com	         organizer  Crear y publicar eventos, gestionar inscriptos de sus propios eventos
organizer2@test.com        organizer  Probar el caso de "organizer intenta modificar/consultar un evento ajeno → 403"
jonathan@gmail.com	       user	      Inscribirse a eventos, consultar y cancelar sus propias inscripciones
lucace@gmail.com	         user	      Igual que el anterior; útil para probar inscripciones duplicadas o cupos entre dos usuarios distintos

Las contraseñas no se documentan aquí por seguridad. Para crear tu propio set de usuarios de prueba desde cero, registrá cada uno vía /sessions/register y ajustá el rol en la base según necesites.








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

*Tickets*

POST   /api/v1/events/:eid/tickets
GET    /api/v1/tickets/my-tickets
GET    /api/v1/events/:eid/tickets
PATCH  /api/v1/tickets/:tid/cancel

🔒 **Permisos de acceso**


Endpoint	                   User	          Organizer	             Admin
GET /events	                   ✅	            ✅	                ✅
POST /events                   ❌	            ✅	                ✅
PUT /events/ :id               ❌	            ✅ (solo propios)	✅
PATCH /events/:id/status	     ❌	            ✅ (solo propios)  ✅
GET /users	                   ❌	            ❌	                ✅
GET /users/:id	               ✅	            ✅	                ✅
POST /users	                   ❌	            ❌	                ✅
PUT /users/:id	               ❌	            ❌	                ✅
DELETE /users/:id	             ❌	            ❌	                ✅
POST /events/:eid/tickets	     ✅	            ✅	                ✅
GET /tickets/my-tickets	       ✅	            ✅	                ✅
GET /events/:eid/tickets	     ❌	            ✅ (solo propios)	✅
PATCH /tickets/:tid/cancel	   ✅ (propios)	  ✅ (propios)	      ✅ (cualquiera)



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
│   ├── passport.config.js       # estrategias register, login y current
│   └── mailer.config.js         # transporter de Nodemailer
├── controllers/                 # Solo request/response, sin lógica de negocio
├── dao/                         # Única capa que importa modelos de Mongoose
│   ├── user.dao.js
│   ├── event.dao.js
│   └── ticket.dao.js
├── dto/                         # Filtran los datos expuestos en cada respuesta
│   ├── user.dto.js
│   ├── event.dto.js
│   └── ticket.dto.js
├── middlewares/
│   ├── authorize.middleware.js  # autorización por rol
│   └── localAuth.middleware.js  # login/register con status codes reales
├── models/
├── repositories/                # Capa de dominio, usan el DAO
├── routes/
├── services/                    # Lógica de negocio, usan el Repository
│   └── mail.service.js          # envío de emails de confirmación
├── utils/
│   ├── bcrypt.js
│   ├── jwt.js
│   ├── generateReservationCode.js
│   └── ServiceError.js          # clase de error con statusCode
├── app.js                       # passport.initialize()
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
- Cancelación de ticket ajeno → 403.
- Consulta de inscriptos de un evento como user común → 403.
- Consulta de inscriptos de un evento como organizer de otro evento → 403.
- Respuesta de ticket con populate sin exponer password del usuario.
- Endpoints de error devolviendo el código HTTP correcto (400/401/403/404/409), no 500 genérico.
- Registro con email duplicado → 409 (en vez del 401 genérico por defecto de Passport).
- Rutas de usuarios sin sesión → 401; con sesión pero sin rol admin → 403.

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
   user	                             ObjectId	                              Referencia al usuario que se inscribió
   event	                           ObjectId	                              Referencia al evento
   quantity	                         Number	                                Cantidad de lugares reservados (mínimo 1)
   status	                           String	                                pending | confirmed | cancelled
   reservationCode	                 String	                                Código único de reserva (ej. TCK-8F3A2X)
   cancelledAt	                     Date	                                  Fecha de cancelación (null si sigue activo)
   createdAt	                       Date	                                  Fecha de creación (automático)

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
## Método	               Ruta	                     Acceso	                                       Descripción
POST	         /api/v1/events/:eid/tickets      	 Autenticado	                                 Inscribirse a un evento
GET	           /api/v1/tickets/my-tickets          Autenticado	                                 Ver mis inscripciones
GET	           /api/v1/events/:eid/tickets	       Organizer (dueño del evento) o Admin	         Ver inscriptos a un evento
PATCH	         /api/v1/tickets/:tid/cancel	       Dueño del ticket o Admin	                     Cancelar una inscripción

**Cancelación**
-Cambia status a cancelled y registra cancelledAt. El documento no se elimina.
-Solo puede cancelar el dueño del ticket o un admin.
-No se puede cancelar un ticket ya cancelado.

**Notificaciones por email**
Al confirmarse una inscripción, se envía un email con Nodemailer usando las credenciales definidas en variables de entorno (ver .env.example). Un fallo en el envío
 no revierte la creación del ticket, solo se registra en consola.

**Casos de prueba realizados**

✅ Registro → login → /current → logout → /current devuelve 401.
✅ user intenta crear evento → 403.
✅ organizer crea evento → user se inscribe → email recibido → cupo descontado.
✅ user intenta inscribirse nuevamente al mismo evento → 409 (duplicado).
✅ user intenta inscribirse a evento sin cupo → 409, mensaje claro.
✅ user cancela su ticket → cupo liberado → nueva inscripción funciona.
✅ organizer intenta modificar evento ajeno → 403.
✅ admin modifica evento de otro organizador → éxito.
✅ Respuestas de usuario, evento y ticket no contienen password.
✅ Listado de eventos con ?status=published&page=2&limit=5 devuelve estructura paginada correcta.
✅ Inscripción exitosa (con envío de email).
✅ Inscripción sin sesión → 401.
✅ Inscripción a evento inexistente → 404.
✅ Inscripción a evento cancelado/finalizado → 409.
✅ Inscripción sin cupo suficiente → 409.
✅ Inscripción duplicada activa → 409.
✅ Cancelación propia → cupo liberado.
✅ Cancelación de ticket ajeno como user → 403.
✅ Consulta de inscriptos como user común → 403.
✅ Consulta de inscriptos de un evento como organizer de otro evento → 403.


👨‍💻 **Autor**

Carlos Jonathan Rodriguez Osorio

Backend Developer in Training

## 📄 Licencia

Este proyecto fue desarrollado con fines educativos y de aprobación, como parte del curso Backend II de Coderhouse.
No está destinado para uso comercial.
