const API_BASE_URL = "http://localhost:8081";
const CART_STORAGE_KEY = "papitas_cart";
const WHOLESALE_THRESHOLD = 50;
const WHOLESALE_PRICE = 2200;
const RETAIL_SUGGESTED_PRICE = 3000;

function getStoredUser() {
    const raw = localStorage.getItem("usuario");
    return raw ? JSON.parse(raw) : null;
}

function setStoredUser(user) {
    localStorage.setItem("usuario", JSON.stringify(user));
}

function clearStoredUser() {
    localStorage.removeItem("usuario");
}

function getStoredCart() {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}

function setStoredCart(cartItems) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
}

function clearStoredCart() {
    localStorage.removeItem(CART_STORAGE_KEY);
}

async function apiFetch(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        ...options
    });

    const isJson = response.headers.get("content-type")?.includes("application/json");
    const payload = isJson ? await response.json() : null;

    if (!response.ok) {
        throw new Error(payload?.message || "No fue posible completar la solicitud.");
    }

    return payload;
}

function formatCurrency(value) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    }).format(value || 0);
}

function formatDate(value) {
    if (!value) {
        return "Sin fecha";
    }

    return new Intl.DateTimeFormat("es-CO", {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(new Date(value));
}

function getStatusMeta(status) {
    const normalized = (status || "").toUpperCase();
    if (normalized === "EN_PROCESO") {
        return { label: "En proceso", className: "processing" };
    }
    if (normalized === "DESPACHADO") {
        return { label: "Despachado", className: "shipped" };
    }
    if (normalized === "ENTREGADO") {
        return { label: "Entregado", className: "delivered" };
    }
    return { label: "Pendiente", className: "pending" };
}

function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    if (!toast) {
        return;
    }

    toast.textContent = message;
    toast.className = `toast ${type}`;
    clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
        toast.className = "toast hidden";
    }, 3200);
}

function setFieldError(name, message = "") {
    const errorNode = document.querySelector(`[data-error-for="${name}"]`);
    if (errorNode) {
        errorNode.textContent = message;
    }
}

function clearFieldErrors(form) {
    form.querySelectorAll("[data-error-for]").forEach((node) => {
        node.textContent = "";
    });
}

function requireUser(options = {}) {
    const user = getStoredUser();
    if (!user) {
        window.location.href = "login.html";
        return null;
    }

    if (options.adminOnly && user.rol !== "ADMIN") {
        window.location.href = "index.html";
        return null;
    }

    return user;
}
