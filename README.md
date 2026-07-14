DevConnect Backend II API

-Backend desarrollado como proyecto académico para el curso ( BACKEND II de Coderhouse) utilizando Node.js, Express.js, MongoDB y Passport.js.

-Este proyecto implementa una API REST para la gestión de usuarios utilizando una arquitectura por capas (**Controller → Service → Repository**), autenticación mediante **JWT**, contraseñas encriptadas con **bcrypt** y autenticación centralizada con **Passport.js**.


📚 Tecnologías utilizadas


Node.js
Express.js
MongoDB
Mongoose
Passport.js (passport-local, passport-jwt)
JSON Web Tokens (JWT)
bcrypt
Git
GitHub


✅ Funcionalidades implementadas


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


🔐 Autenticación

La autenticación está centralizada en src/config/passport.config.js mediante tres estrategias de Passport:

EstrategiaTipoDescripciónregisterpassport-localValida y normaliza los datos, verifica que el email no exista, hashea la contraseña con bcrypt y crea el usuario con rol por defecto (user).loginpassport-localValida las credenciales del usuario contra la base de datos. Si son inválidas, responde con un mensaje genérico ("Credenciales inválidas").currentpassport-jwtExtrae el JWT desde la cookie currentUser, lo valida y deja el payload (id, email, role) disponible en req.user.

Importante: las estrategias register y login no generan el JWT. Esa responsabilidad es del controller (sessions.controller.js), que genera el token tras una autenticación exitosa y lo setea en una cookie httpOnly.

El sistema está preparado para agregar nuevas estrategias (por ejemplo, Google o GitHub OAuth) simplemente sumando un nuevo passport.use(...) dentro de passport.config.js, sin necesidad de modificar app.js ni las rutas existentes.

📡 Rutas de sesión

Base: /api/v1/sessions

MétodoRutaDescripciónRespuesta exitosaPOST/registerRegistra un nuevo usuario201 { "status": "success", "message": "Usuario registrado correctamente" }POST/loginAutentica al usuario y setea cookie currentUser200 { "status": "success", "message": "Login correcto" }GET/currentDevuelve los datos del usuario autenticado (requiere cookie válida)200 { "status": "success", "payload": { "id", "email", "role" } }POST/logoutElimina la cookie de sesión200 { "status": "success", "message": "Sesión cerrada correctamente" }

Credenciales inválidas o token ausente/inválido → 401 { "status": "error", "message": "..." }

🔑 Variables de entorno

Ver .env.example. Se requieren:

PORT=3000
MONGO_URI=mongodb://localhost:27017/devconnect
JWT_SECRET=tu_secreto_super_seguro
JWT_EXPIRES_IN=1h
NODE_ENV=development

📂 Estructura del proyecto

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

⚙️ Instalación

bash  npm install

▶️ Ejecutar el proyecto

bash  npm run dev

🌐 API Base

http://localhost:3000/api/v1

👨‍💻 Autor

Carlos Jonathan Rodriguez Osorio

Backend Developer in Training
