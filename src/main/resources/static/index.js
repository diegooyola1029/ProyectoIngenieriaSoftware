const PRODUCT_IMAGES = [
    "assets/papitas-gallery-1.jpeg",
    "assets/papitas-gallery-2.jpeg",
    "assets/papitas-gallery-3.jpeg"
];

const state = {
    user: null,
    products: [],
    filteredProducts: [],
    cart: new Map(),
    history: [],
    pendingPayload: null
};

document.addEventListener("DOMContentLoaded", async () => {
    state.user = requireUser();
    if (!state.user) {
        return;
    }

    hydrateCart();
    document.getElementById("welcomeChip").textContent = state.user.nombre || state.user.email;
    document.getElementById("telefono").value = state.user.telefono || "";
    document.getElementById("adminLink").classList.toggle("hidden", state.user.rol !== "ADMIN");

    bindCatalogEvents();
    await Promise.all([loadProducts(), loadHistory()]);
    renderCart();
});

function bindCatalogEvents() {
    document.getElementById("logoutButton").addEventListener("click", () => {
        clearStoredUser();
        clearStoredCart();
        window.location.href = "login.html";
    });

    document.getElementById("searchInput").addEventListener("input", (event) => {
        const query = event.target.value.trim().toLowerCase();
        state.filteredProducts = state.products.filter((product) => product.nombre.toLowerCase().includes(query));
        renderProducts();
    });

    document.getElementById("refreshHistoryButton").addEventListener("click", loadHistory);
    document.getElementById("checkoutForm").addEventListener("submit", handleCheckoutSubmit);
    document.getElementById("cancelConfirmButton").addEventListener("click", closeConfirmModal);
    document.getElementById("confirmOrderButton").addEventListener("click", submitOrder);
    document.getElementById("closeSuccessButton").addEventListener("click", () => {
        document.getElementById("successModal").classList.add("hidden");
    });
    document.getElementById("floatingCartButton").addEventListener("click", () => {
        document.getElementById("cartPanel").scrollIntoView({ behavior: "smooth", block: "start" });
    });
}

function hydrateCart() {
    getStoredCart().forEach((item) => {
        state.cart.set(item.id, item);
    });
}

function persistCart() {
    setStoredCart([...state.cart.values()]);
}

async function loadProducts() {
    try {
        state.products = await apiFetch("/productos");
        state.filteredProducts = [...state.products];
        document.getElementById("productCount").textContent = state.products.length;
        document.getElementById("lowStockCount").textContent = state.products.filter((product) => product.stock > 0 && product.stock <= 5).length;
        reconcileCartWithStock();
        renderProducts();
    } catch (error) {
        showToast(error.message, "error");
    }
}

async function loadHistory() {
    try {
        state.history = await apiFetch(`/pedidos/usuario/${encodeURIComponent(state.user.email)}`);
        renderHistory(state.history);
    } catch (error) {
        state.history = [];
        renderHistory([]);
        showToast(error.message, "error");
    }
}

function reconcileCartWithStock() {
    state.cart.forEach((item, id) => {
        const product = state.products.find((entry) => entry.id === id);
        if (!product || product.stock === 0) {
            state.cart.delete(id);
            return;
        }

        state.cart.set(id, { ...product, cantidad: Math.min(item.cantidad, product.stock) });
    });
    persistCart();
}

function getPricingSnapshot() {
    const entries = [...state.cart.values()];
    const totalUnits = entries.reduce((sum, item) => sum + item.cantidad, 0);
    const retailSubtotal = entries.reduce((sum, item) => sum + item.cantidad * item.precio, 0);
    const wholesaleApplied = totalUnits >= WHOLESALE_THRESHOLD;
    const total = entries.reduce((sum, item) => sum + item.cantidad * (wholesaleApplied ? WHOLESALE_PRICE : item.precio), 0);
    const savings = Math.max(0, retailSubtotal - total);

    return { entries, totalUnits, retailSubtotal, wholesaleApplied, total, savings };
}

function renderProducts() {
    const grid = document.getElementById("productGrid");
    const emptyState = document.getElementById("emptyProducts");

    if (!state.filteredProducts.length) {
        grid.innerHTML = "";
        emptyState.classList.remove("hidden");
        return;
    }

    emptyState.classList.add("hidden");
    grid.innerHTML = state.filteredProducts.map((product, index) => {
        const quantity = state.cart.get(product.id)?.cantidad || 0;
        const stockVariant = product.stock === 0 ? "danger" : product.stock <= 5 ? "warning" : "success";
        const stockLabel = product.stock === 0 ? "Sin stock" : product.stock <= 5 ? `Stock bajo: ${product.stock}` : `Disponible: ${product.stock}`;

        const productImage = PRODUCT_IMAGES[index % PRODUCT_IMAGES.length];

        return `
            <article class="product-card commercial-card">
                <div class="product-photo-wrap">
                    <img src="${productImage}" alt="Papitas Limoncitas ${product.nombre}" class="product-photo">
                    <span class="product-badge ${stockVariant}">${stockLabel}</span>
                </div>
                <div class="product-copy">
                    <p class="eyebrow">Papitas Limoncitas</p>
                    <h3>${product.nombre}</h3>
                    <p class="muted">Crujientes, frescas y listas para compartir o revender.</p>
                    <div class="product-meta">
                        <span class="price-pill">${formatCurrency(product.precio)}</span>
                        <span class="meta-chip">Mayorista: ${formatCurrency(WHOLESALE_PRICE)}</span>
                    </div>
                </div>
                <div class="product-actions">
                    <div class="qty-controller">
                        <button class="qty-button" type="button" onclick="updateCart(${product.id}, -1)">-</button>
                        <span class="qty-value">${quantity}</span>
                        <button class="qty-button" type="button" onclick="updateCart(${product.id}, 1)" ${product.stock === 0 ? "disabled" : ""}>+</button>
                    </div>
                    <button class="primary-mini-button" type="button" onclick="addOne(${product.id})" ${product.stock === 0 ? "disabled" : ""}>Agregar</button>
                </div>
            </article>
        `;
    }).join("");
}

function addOne(productId) {
    updateCart(productId, 1);
}

function updateCart(productId, delta) {
    const product = state.products.find((item) => item.id === productId);
    if (!product) {
        return;
    }

    if (product.stock === 0) {
        showToast(`No hay stock disponible para ${product.nombre}.`, "error");
        return;
    }

    const current = state.cart.get(productId)?.cantidad || 0;
    const next = Math.max(0, Math.min(product.stock, current + delta));

    if (next === 0) {
        state.cart.delete(productId);
    } else {
        state.cart.set(productId, { ...product, cantidad: next });
    }

    persistCart();
    renderProducts();
    renderCart();
}

function removeFromCart(productId) {
    state.cart.delete(productId);
    persistCart();
    renderProducts();
    renderCart();
}

function renderCart() {
    const itemsNode = document.getElementById("cartItems");
    const emptyNode = document.getElementById("emptyCart");
    const { entries, totalUnits, retailSubtotal, wholesaleApplied, total, savings } = getPricingSnapshot();

    document.getElementById("cartCount").textContent = `${totalUnits} items`;
    document.getElementById("floatingCartCount").textContent = totalUnits;
    document.getElementById("unitsValue").textContent = totalUnits;
    document.getElementById("subtotalValue").textContent = formatCurrency(retailSubtotal);
    document.getElementById("savingValue").textContent = formatCurrency(savings);
    document.getElementById("totalValue").textContent = formatCurrency(total);

    document.getElementById("wholesaleStatus").className = wholesaleApplied ? "inline-banner success" : "inline-banner";
    document.getElementById("wholesaleStatus").textContent = wholesaleApplied
        ? `Mayorista activo. Tus ${totalUnits} unidades se calculan a ${formatCurrency(WHOLESALE_PRICE)} por unidad.`
        : `Compra ${WHOLESALE_THRESHOLD - totalUnits} unidades mas y activa el precio mayorista.`;

    document.getElementById("orderPreview").innerHTML = entries.length
        ? `
            <div class="summary-row"><span>Unidades totales</span><strong>${totalUnits}</strong></div>
            <div class="summary-row"><span>Modo de compra</span><strong>${wholesaleApplied ? "Mayorista" : "Regular"}</strong></div>
            <div class="summary-row"><span>Total estimado</span><strong>${formatCurrency(total)}</strong></div>
          `
        : "Tu resumen aparecera aqui cuando agregues productos.";

    if (!entries.length) {
        itemsNode.innerHTML = "";
        emptyNode.classList.remove("hidden");
        return;
    }

    emptyNode.classList.add("hidden");
    itemsNode.innerHTML = entries.map((item) => {
        const unitPrice = wholesaleApplied ? WHOLESALE_PRICE : item.precio;
        return `
            <article class="cart-card">
                <div class="cart-line">
                    <div>
                        <strong>${item.nombre}</strong>
                        <p class="muted">${formatCurrency(unitPrice)} por unidad</p>
                    </div>
                    <strong>${formatCurrency(item.cantidad * unitPrice)}</strong>
                </div>
                <div class="product-actions">
                    <div class="qty-controller">
                        <button class="qty-button" type="button" onclick="updateCart(${item.id}, -1)">-</button>
                        <span class="qty-value">${item.cantidad}</span>
                        <button class="qty-button" type="button" onclick="updateCart(${item.id}, 1)">+</button>
                    </div>
                    <button class="ghost-button" type="button" onclick="removeFromCart(${item.id})">Quitar</button>
                </div>
            </article>
        `;
    }).join("");
}

function validateCheckoutForm() {
    const form = document.getElementById("checkoutForm");
    clearFieldErrors(form);

    const direccion = document.getElementById("direccion").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const metodoPago = document.getElementById("metodoPago").value;
    let valid = true;

    if (!state.cart.size) {
        showToast("Agrega al menos un producto al carrito.", "error");
        valid = false;
    }
    if (direccion.length < 8) {
        setFieldError("direccion", "Ingresa una direccion mas completa.");
        valid = false;
    }
    if (!/^[+0-9\s-]{7,20}$/.test(telefono)) {
        setFieldError("telefono", "Ingresa un telefono valido.");
        valid = false;
    }
    if (!metodoPago) {
        setFieldError("metodoPago", "Selecciona un metodo de pago.");
        valid = false;
    }

    return valid;
}

function buildOrderPayload() {
    return {
        nombreCliente: state.user.nombre,
        emailCliente: state.user.email,
        direccion: document.getElementById("direccion").value.trim(),
        telefono: document.getElementById("telefono").value.trim(),
        metodoPago: document.getElementById("metodoPago").value,
        detalles: [...state.cart.values()].map((item) => ({
            productoId: item.id,
            cantidad: item.cantidad
        }))
    };
}

function handleCheckoutSubmit(event) {
    event.preventDefault();
    if (!validateCheckoutForm()) {
        return;
    }

    state.pendingPayload = buildOrderPayload();
    openConfirmModal();
}

function openConfirmModal() {
    const { entries, totalUnits, wholesaleApplied, total } = getPricingSnapshot();
    document.getElementById("confirmContent").innerHTML = `
        <div class="summary-row"><span>Cliente</span><strong>${state.pendingPayload.nombreCliente}</strong></div>
        <div class="summary-row"><span>Entrega</span><strong>${state.pendingPayload.direccion}</strong></div>
        <div class="summary-row"><span>Pago</span><strong>${state.pendingPayload.metodoPago}</strong></div>
        <div class="summary-row"><span>Modalidad</span><strong>${wholesaleApplied ? "Mayorista" : "Regular"}</strong></div>
        <hr>
        ${entries.map((item) => `<div class="summary-row"><span>${item.nombre} x${item.cantidad}</span><strong>${formatCurrency(item.cantidad * (wholesaleApplied ? WHOLESALE_PRICE : item.precio))}</strong></div>`).join("")}
        <hr>
        <div class="summary-row"><span>Unidades</span><strong>${totalUnits}</strong></div>
        <div class="summary-row"><span>Total final</span><strong>${formatCurrency(total)}</strong></div>
    `;
    document.getElementById("confirmModal").classList.remove("hidden");
}

function closeConfirmModal() {
    document.getElementById("confirmModal").classList.add("hidden");
}

function openProcessingModal() {
    document.getElementById("processingModal").classList.remove("hidden");
}

function closeProcessingModal() {
    document.getElementById("processingModal").classList.add("hidden");
}

async function submitOrder() {
    const button = document.getElementById("confirmOrderButton");
    button.disabled = true;
    button.textContent = "Enviando...";
    closeConfirmModal();
    openProcessingModal();

    try {
        const order = await apiFetch("/pedidos", {
            method: "POST",
            body: JSON.stringify(state.pendingPayload)
        });

        state.cart.clear();
        persistCart();
        document.getElementById("checkoutForm").reset();
        document.getElementById("telefono").value = state.user.telefono || "";
        renderProducts();
        renderCart();
        await Promise.all([loadProducts(), loadHistory()]);
        closeProcessingModal();
        openSuccessModal(order);
        showToast("Pedido registrado correctamente.");
    } catch (error) {
        closeProcessingModal();
        showToast(error.message, "error");
    } finally {
        button.disabled = false;
        button.textContent = "Enviar ahora";
    }
}

function openSuccessModal(order) {
    document.getElementById("successMessage").textContent = `Pedido #${order.id} confirmado por ${formatCurrency(order.total)}. Estado inicial: ${getStatusMeta(order.estado).label}.`;
    document.getElementById("successModal").classList.remove("hidden");
}

function renderHistory(orders) {
    const list = document.getElementById("historyList");
    if (!orders.length) {
        list.innerHTML = `<div class="empty-state">Todavia no tienes pedidos registrados.</div>`;
        return;
    }

    list.innerHTML = orders.map((order) => {
        const status = getStatusMeta(order.estado);
        return `
            <article class="history-card premium-history-card">
                <div class="order-header">
                    <div>
                        <h4>Pedido #${order.id}</h4>
                        <p class="muted">${formatDate(order.fechaCreacion)}</p>
                    </div>
                    <span class="status-pill ${status.className}">${status.label}</span>
                </div>
                <div class="history-meta">
                    <span class="meta-chip">${formatCurrency(order.total)}</span>
                    <span class="meta-chip">${order.metodoPago}</span>
                    <span class="meta-chip">${order.mayorista ? "Mayorista" : "Regular"}</span>
                </div>
                <ul class="history-items">
                    ${order.detalles.map((detail) => `<li>${detail.productoNombre} x${detail.cantidad}</li>`).join("")}
                </ul>
            </article>
        `;
    }).join("");
}
