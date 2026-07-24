-- database/opciones.sql
-- Ejecuta esto DESPUÉS de schema.sql (las preguntas ya deben existir)
USE railway;
-- Escala: Siempre=3, A veces=2, Rara vez=1, Nunca=0
-- (invertida en preguntas 2 y 9, donde "Siempre" es una mala práctica)

-- 1. ¿Usas 2FA? (positiva)
INSERT INTO opciones (id_pregunta, opcion, descripcion, puntaje) VALUES
(1, 'A', 'Siempre', 3),
(1, 'B', 'A veces', 2),
(1, 'C', 'Rara vez', 1),
(1, 'D', 'Nunca', 0);

-- 2. ¿Reutilizas la misma contraseña? (negativa -> invertida)
INSERT INTO opciones (id_pregunta, opcion, descripcion, puntaje) VALUES
(2, 'A', 'Siempre', 0),
(2, 'B', 'A veces', 1),
(2, 'C', 'Rara vez', 2),
(2, 'D', 'Nunca', 3);

-- 3. ¿Usas gestor de contraseñas? (positiva)
INSERT INTO opciones (id_pregunta, opcion, descripcion, puntaje) VALUES
(3, 'A', 'Siempre', 3),
(3, 'B', 'A veces', 2),
(3, 'C', 'Rara vez', 1),
(3, 'D', 'Nunca', 0);

-- 4. ¿Verificas remitente/enlaces antes de clic? (positiva)
INSERT INTO opciones (id_pregunta, opcion, descripcion, puntaje) VALUES
(4, 'A', 'Siempre', 3),
(4, 'B', 'A veces', 2),
(4, 'C', 'Rara vez', 1),
(4, 'D', 'Nunca', 0);

-- 5. ¿Mantienes actualizado tu sistema? (positiva)
INSERT INTO opciones (id_pregunta, opcion, descripcion, puntaje) VALUES
(5, 'A', 'Siempre', 3),
(5, 'B', 'A veces', 2),
(5, 'C', 'Rara vez', 1),
(5, 'D', 'Nunca', 0);

-- 6. ¿Usas VPN en redes públicas? (positiva)
INSERT INTO opciones (id_pregunta, opcion, descripcion, puntaje) VALUES
(6, 'A', 'Siempre', 3),
(6, 'B', 'A veces', 2),
(6, 'C', 'Rara vez', 1),
(6, 'D', 'Nunca', 0);

-- 7. ¿Realizas copias de seguridad? (positiva)
INSERT INTO opciones (id_pregunta, opcion, descripcion, puntaje) VALUES
(7, 'A', 'Siempre', 3),
(7, 'B', 'A veces', 2),
(7, 'C', 'Rara vez', 1),
(7, 'D', 'Nunca', 0);

-- 8. ¿Longitud promedio de tus contraseñas? (mismatch semántico, ver nota arriba)
INSERT INTO opciones (id_pregunta, opcion, descripcion, puntaje) VALUES
(8, 'A', 'Siempre', 3),
(8, 'B', 'A veces', 2),
(8, 'C', 'Rara vez', 1),
(8, 'D', 'Nunca', 0);

-- 9. ¿Cuánta información personal compartes en redes sociales? (negativa -> invertida)
INSERT INTO opciones (id_pregunta, opcion, descripcion, puntaje) VALUES
(9, 'A', 'Siempre', 0),
(9, 'B', 'A veces', 1),
(9, 'C', 'Rara vez', 2),
(9, 'D', 'Nunca', 3);

-- 10. ¿Sabes identificar phishing/ingeniería social? (positiva)
INSERT INTO opciones (id_pregunta, opcion, descripcion, puntaje) VALUES
(10, 'A', 'Siempre', 3),
(10, 'B', 'A veces', 2),
(10, 'C', 'Rara vez', 1),
(10, 'D', 'Nunca', 0);
