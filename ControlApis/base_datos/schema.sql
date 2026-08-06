USE railway;

/* TABLA USUARIOS */
CREATE TABLE usuarios(
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('Activo','Inactivo') DEFAULT 'Activo'
);

/* HISTORIAL DE INICIO DE SESIÓN */
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

/* ESTADÍSTICAS DE CONTRASEÑAS */
CREATE TABLE verificaciones_contrasenas(
    id_verificacion INT AUTO_INCREMENT PRIMARY KEY,
    resultado ENUM(
        'Muy insegura',
        'Insegura',
        'Regular',
        'Segura',
        'Excelente'
    ) NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP
);

/* ESTADÍSTICAS DE CORREOS */
CREATE TABLE verificaciones_correos(
    id_verificacion INT AUTO_INCREMENT PRIMARY KEY,
    resultado ENUM(
        'Muy inseguro',
        'Inseguro',
        'Regular',
        'Seguro',
        'Excelente'
    ) NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP
);