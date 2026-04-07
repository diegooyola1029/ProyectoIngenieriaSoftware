document.addEventListener("DOMContentLoaded", () => {
    const currentUser = getStoredUser();
    if (currentUser) {
        window.location.href = currentUser.rol === "ADMIN" ? "admin.html" : "index.html";
        return;
    }

    document.getElementById("togglePasswordButton").addEventListener("click", togglePassword);
    document.getElementById("loginForm").addEventListener("submit", handleLogin);
});

function togglePassword() {
    const input = document.getElementById("password");
    const button = document.getElementById("togglePasswordButton");
    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";
    button.textContent = isHidden ? "Ocultar" : "Mostrar";
}

function validateLoginForm() {
    const form = document.getElementById("loginForm");
    clearFieldErrors(form);

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    let valid = true;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setFieldError("email", "Ingresa un correo valido.");
        valid = false;
    }
    if (password.length < 6) {
        setFieldError("password", "La contrasena debe tener al menos 6 caracteres.");
        valid = false;
    }

    return valid;
}

async function handleLogin(event) {
    event.preventDefault();
    if (!validateLoginForm()) {
        return;
    }

    const button = document.getElementById("loginButton");
    const messageNode = document.getElementById("authMessage");
    button.disabled = true;
    button.textContent = "Validando...";
    messageNode.className = "inline-message hidden";

    try {
        const user = await apiFetch("/usuarios/login", {
            method: "POST",
            body: JSON.stringify({
                email: document.getElementById("email").value.trim(),
                password: document.getElementById("password").value.trim()
            })
        });

        setStoredUser(user);
        messageNode.textContent = "Acceso correcto. Redirigiendo...";
        messageNode.className = "inline-message success";
        window.setTimeout(() => {
            window.location.href = user.rol === "ADMIN" ? "admin.html" : "index.html";
        }, 700);
    } catch (error) {
        messageNode.textContent = error.message;
        messageNode.className = "inline-message error";
    } finally {
        button.disabled = false;
        button.textContent = "Entrar al sistema";
    }
}
