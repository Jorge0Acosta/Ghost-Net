function analizarPassword(password) {
    let score = 0;

    // Seguridad mínima
    if (!password || password.length < 8) {
        return {
            password,
            score: 0,
            nivel: "Muy débil",
            mensaje: "Contraseña demasiado corta"
        };
    }

    // Longitud
    if (password.length >= 8) score += 15;
    if (password.length >= 12) score += 25;
    if (password.length >= 15) score += 35;

    // Complejidad
    if (/[A-Z]/.test(password)) score += 10;
    if (/[a-z]/.test(password)) score += 10;
    if (/[0-9]/.test(password)) score += 10;
    if (/[^A-Za-z0-9]/.test(password)) score += 15;

    // Contraseñas débiles comunes
    if (/12345678910|password|qwerty|admin/i.test(password)) {
        score -= 25;
    }

    // Nivel final
    let nivel = "Débil";

    if (score >= 80) nivel = "Fuerte";
    else if (score >= 50) nivel = "Media";

    return {
        password,
        score,
        nivel,
        mensaje: "Evaluación completada"
    };
}

module.exports = { analizarPassword };