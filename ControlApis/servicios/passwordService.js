function analizarPassword(password) {
    let score = 0;
    const issues = [];
    const recommendations = [];

    // Seguridad mínima
    if (!password || password.length < 8) {
        return {
            password,
            score: 0,
            nivel: "Muy débil",
            label: "Muy débil",
            mensaje: "Contraseña demasiado corta",
            reason: "Contraseña demasiado corta",
            is_common: false,
            issues: ["demasiado corta"],
            recommendations: ["Usa al menos 12 caracteres y mezcla mayúsculas, minúsculas, números y símbolos."]
        };
    }

    // Longitud
    if (password.length >= 8) score += 15;
    if (password.length >= 12) score += 25;
    if (password.length >= 15) score += 35;

    // Complejidad
    if (/[A-Z]/.test(password)) score += 10;
    else issues.push("sin mayúsculas");

    if (/[a-z]/.test(password)) score += 10;
    else issues.push("sin minúsculas");

    if (/[0-9]/.test(password)) score += 10;
    else issues.push("sin números");

    if (/[^A-Za-z0-9]/.test(password)) score += 15;
    else issues.push("sin símbolos");

    // Contraseñas débiles comunes
    const isCommon = /12345678910|password|qwerty|admin/i.test(password);
    if (isCommon) {
        score -= 25;
        issues.push("muy común o predecible");
    }

    if (score < 0) score = 0;

    // Nivel final
    let nivel = "Débil";

    if (score >= 80) nivel = "Fuerte";
    else if (score >= 50) nivel = "Media";

    if (!recommendations.length) {
        recommendations.push("Usa una contraseña única y evita patrones comunes");
    }

    const reason = issues.length > 0
        ? `La evaluación detectó: ${issues.join(", ")}`
        : "Evaluación completada";

    return {
        password,
        score,
        nivel,
        label: nivel,
        mensaje: reason,
        reason,
        is_common: isCommon,
        issues,
        recommendations
    };
}

module.exports = { analizarPassword };