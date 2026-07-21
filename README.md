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
Git
GitHub


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
DELETE /api/v1/events/:id


🔒 **Permisos de acceso**


Endpoint	         User	      Organizer	              Admin
GET /events	          ✅	            ✅	                ✅
POST /events          ❌	            ✅	                ✅
PUT /events/ :id      ❌	            ✅ (solo propios)	✅
DELETE /events/ :id	  ❌	            ❌   	            ✅
GET /users	          ❌	            ❌	                ✅


🔑 **Variables de entorno**

Ver .env.example. Se requieren:

PORT=3000
MONGO_URI=mongodb://localhost:27017/devconnect
JWT_SECRET=tu_secreto_super_seguro
JWT_EXPIRES_IN=1h
NODE_ENV=development

📂 **Estructura del proyecto**

src/
├── config/
│   └── passport.config.js   # estrategias register, login y current
├── controllers/
├── models/
├── repositories/
├── routes/
├── services/
├── utils/
│   ├── bcrypt.js
│   └── jwt.js
├── app.js                   # passport.initialize()
└── server.js


⚙️ **Instalación**

bash  npm install

▶️ Ejecutar el proyecto

bash  npm run dev


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


👨‍💻 **Autor**

Carlos Jonathan Rodriguez Osorio

Backend Developer in Training

## 📄 Licencia

Este proyecto fue desarrollado con fines educativos y de aprobación, como parte del curso Backend II de Coderhouse.
No está destinado para uso comercial.
