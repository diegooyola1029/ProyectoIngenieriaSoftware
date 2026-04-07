document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("registerForm").addEventListener("submit", handleRegister);
});

function validateRegisterForm() {
    const form = document.getElementById("registerForm");
    clearFieldErrors(form);

    const values = {
        nombre: document.getElementById("nombre").value.trim(),
        email: document.getElementById("email").value.trim(),
        telefono: document.getElementById("telefono").value.trim(),
        password: document.getElementById("password").value.trim()
    };

    let valid = true;
    if (values.nombre.length < 3) {
        setFieldError("nombre", "Ingresa un nombre mas completo.");
        valid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        setFieldError("email", "Ingresa un correo valido.");
        valid = false;
    }
    if (!/^[+0-9\s-]{7,20}$/.test(values.telefono)) {
        setFieldError("telefono", "Ingresa un telefono valido.");
        valid = false;
    }
    if (values.password.length < 6) {
        setFieldError("password", "La contrasena debe tener minimo 6 caracteres.");
        valid = false;
    }

    return { valid, values };
}

async function handleRegister(event) {
    event.preventDefault();
    const { valid, values } = validateRegisterForm();
    if (!valid) {
        return;
    }

    const button = document.getElementById("registerButton");
    const messageNode = document.getElementById("registerMessage");
    button.disabled = true;
    button.textContent = "Creando cuenta...";
    messageNode.className = "inline-message hidden";

    try {
        await apiFetch("/usuarios/registro", {
            method: "POST",
            body: JSON.stringify(values)
        });

        messageNode.textContent = "Cuenta creada. Ahora puedes iniciar sesion.";
        messageNode.className = "inline-message success";
        window.setTimeout(() => {
            window.location.href = "login.html";
        }, 900);
    } catch (error) {
        messageNode.textContent = error.message;
        messageNode.className = "inline-message error";
    } finally {
        button.disabled = false;
        button.textContent = "Crear cuenta";
    }
}
