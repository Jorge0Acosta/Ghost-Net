CREATE DATABASE ghost_net
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE ghost_net;

/*TABLA USUARIOS*/

CREATE TABLE usuarios(
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('Activo','Inactivo') DEFAULT 'Activo'
);

/*HISTORIAL DE INICIO DE SESIÓN*/

CREATE TABLE inicios_sesion(
    id_inicio INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    direccion_ip VARCHAR(45),
    dispositivo VARCHAR(100),

    CONSTRAINT fk_login_usuario
    FOREIGN KEY(id_usuario)
    REFERENCES usuarios(id_usuario)
    ON DELETE CASCADE
);

/*PREGUNTAS DEL PERFIL DE RIESGO*/

CREATE TABLE preguntas(
    id_pregunta INT AUTO_INCREMENT PRIMARY KEY,
    pregunta VARCHAR(255) NOT NULL
);

/*OPCIONES DE RESPUESTA*/

CREATE TABLE opciones(
    id_opcion INT AUTO_INCREMENT PRIMARY KEY,
    id_pregunta INT NOT NULL,
    opcion CHAR(1) NOT NULL,
    descripcion VARCHAR(150) NOT NULL,
    puntaje INT NOT NULL,

    CONSTRAINT fk_opcion_pregunta
    FOREIGN KEY(id_pregunta)
    REFERENCES preguntas(id_pregunta)
    ON DELETE CASCADE
);

/*EVALUACIÓN REALIZADA*/

CREATE TABLE evaluaciones(
    id_evaluacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_evaluacion_usuario
    FOREIGN KEY(id_usuario)
    REFERENCES usuarios(id_usuario)
    ON DELETE CASCADE
);

/*RESPUESTAS DEL USUARIO*/

CREATE TABLE respuestas(
    id_respuesta INT AUTO_INCREMENT PRIMARY KEY,
    id_evaluacion INT NOT NULL,
    id_pregunta INT NOT NULL,
    id_opcion INT NOT NULL,

    CONSTRAINT fk_respuesta_evaluacion
    FOREIGN KEY(id_evaluacion)
    REFERENCES evaluaciones(id_evaluacion)
    ON DELETE CASCADE,

    CONSTRAINT fk_respuesta_pregunta
    FOREIGN KEY(id_pregunta)
    REFERENCES preguntas(id_pregunta),

    CONSTRAINT fk_respuesta_opcion
    FOREIGN KEY(id_opcion)
    REFERENCES opciones(id_opcion)
);

/*RESULTADO FINAL*/

CREATE TABLE resultados(
    id_resultado INT AUTO_INCREMENT PRIMARY KEY,
    id_evaluacion INT NOT NULL,
    puntaje_total INT NOT NULL,
    nivel_riesgo ENUM('Bajo','Medio','Alto') NOT NULL,

    CONSTRAINT fk_resultado_evaluacion
    FOREIGN KEY(id_evaluacion)
    REFERENCES evaluaciones(id_evaluacion)
    ON DELETE CASCADE
);

/* PREGUNTAS DEL CUESTIONARIO*/

INSERT INTO preguntas(pregunta) VALUES
('¿Usas autenticación de dos factores (2FA) en tus cuentas importantes?'),
('¿Reutilizas la misma contraseña en múltiples servicios?'),
('¿Utilizas un gestor de contraseñas?'),
('¿Verificas el remitente y los enlaces antes de hacer clic en correos?'),
('¿Mantienes actualizado tu sistema operativo y aplicaciones?'),
('¿Usas VPN cuando te conectas a redes WiFi públicas?'),
('¿Realizas copias de seguridad de tus datos importantes?'),
('¿Cuál es la longitud promedio de tus contraseñas?'),
('¿Cuánta información personal compartes en redes sociales?'),
('¿Sabes identificar intentos de phishing o ingeniería social?');