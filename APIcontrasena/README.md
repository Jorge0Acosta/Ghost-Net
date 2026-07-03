# Integración de MySQL en APIcontrasena

Estos son los archivos que debes **agregar o reemplazar** dentro de tu carpeta `APIcontrasena`. No toca nada de tu `CSS/` ni `HTML/`.

## Archivos NUEVOS (copiar tal cual)

```
APIcontrasena/
├── config/
│   └── db.js                          ← NUEVO
├── database/
│   └── schema.sql                     ← NUEVO
├── services/
│   ├── usuarioService.js              ← NUEVO
│   ├── cuestionarioService.js         ← NUEVO
│   └── evaluacionService.js           ← NUEVO
├── controladores/
│   └── usuarioControladores.js        ← NUEVO
├── routers/
│   └── usuarioRouter.js               ← NUEVO
├── .env.example                       ← NUEVO
└── .gitignore                         ← NUEVO
```

## Archivos que REEMPLAZAN a los tuyos

- `server.js` → le agregué `dotenv`, la conexión a MySQL y el nuevo router de usuarios. Tu configuración de CORS y el comentario xdxd quedaron intactos.
- `controladores/contrasenaControladores.js` → ahora sí se usa (antes tu router llamaba directo al service). Se agregaron las funciones del cuestionario, sin tocar `evaluarPassword`.
- `routers/contrasenaRouter.js` → tu ruta `POST /evaluar` sigue funcionando exactamente igual, solo que ahora pasa por el controlador. Se agregaron las rutas del cuestionario.
- `package.json` → se agregaron `mysql2`, `dotenv` y `bcryptjs` a tus dependencias existentes (nada se quitó).

**No toqué** `services/passwordService.js` — tu lógica de análisis de contraseña queda igual.

## Pasos para integrar

1. Copia los archivos nuevos y reemplaza los indicados arriba en tu proyecto real.
2. Ejecuta en la terminal, dentro de `APIcontrasena`:
   ```bash
   npm install
   ```
3. En **MySQL Workbench**, abre `database/schema.sql` (`File > Open SQL Script`) y ejecútalo completo (rayo ⚡). Esto crea la base `ghost_net` con las 5 tablas y las 10 preguntas.
4. Renombra `.env.example` a `.env` y coloca tus credenciales reales de Workbench:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=tu_password_real
   DB_NAME=ghost_net
   ```
5. Corre el servidor:
   ```bash
   npm run dev
   ```
   Deberías ver:
   ```
   Servidor iniciado en http://localhost:3000
   ✅ Conexión a MySQL (ghost_net) exitosa
   ```

## ⚠️ Pendiente importante: la tabla `opciones` está vacía

Tu script solo inserta las **preguntas**, no las opciones de respuesta (A, B, C...) con su `puntaje`. Sin eso, `POST /api/evaluaciones` va a fallar porque no hay opciones válidas que referenciar.

Tienes dos caminos:
- Insertarlas tú mismo en Workbench.
- Decirme cuántas opciones quieres por pregunta (¿A/B/C fijas para las 10 preguntas, o varían?) y te genero el `INSERT INTO opciones` completo con puntajes coherentes.

## Endpoints nuevos disponibles

| Método | Ruta                                     | Descripción                              |
|--------|-------------------------------------------|--------------------------------------------|
| POST   | /api/registro                             | Registra un usuario (nombre, correo, password) |
| POST   | /api/login                                | Valida login y registra el inicio de sesión |
| GET    | /api/cuestionario                         | Preguntas con sus opciones                |
| POST   | /api/evaluaciones                         | Guarda respuestas y calcula nivel de riesgo |
| GET    | /api/evaluaciones/usuario/:id_usuario     | Historial de evaluaciones del usuario     |
| POST   | /api/evaluar                              | (tu endpoint original, sin cambios)       |

Body de registro:
```json
{ "nombre": "Juan Pérez", "correo": "juan@correo.com", "password": "123456" }
```

Body de evaluación de riesgo:
```json
{
  "id_usuario": 1,
  "respuestas": [
    { "id_pregunta": 1, "id_opcion": 3 },
    { "id_pregunta": 2, "id_opcion": 5 }
  ]
}
```

También ajusta los rangos de `Bajo/Medio/Alto` en `services/evaluacionService.js` (función `calcularNivelRiesgo`) según cómo definas el riesgo en tu proyecto.
