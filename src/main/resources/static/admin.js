const POLLING_INTERVAL_MS = 7000;

const adminState = {
    user: null,
    orders: [],
    products: [],
    lastOrderId: null,
    pollingHandle: null
};

document.addEventListener("DOMContentLoaded", async () => {
    adminState.user = requireUser({ adminOnly: true });
    if (!adminState.user) {
        return;
    }

    document.getElementById("adminWelcomeChip").textContent = adminState.user.nombre || "Administrador";
    bindAdminEvents();
    await loadAdminData({ silent: true });
    adminState.pollingHandle = window.setInterval(() => loadAdminData({ silent: false, fromPolling: true }), POLLING_INTERVAL_MS);
});

function bindAdminEvents() {
    document.getElementById("adminLogoutButton").addEventListener("click", () => {
        clearStoredUser();
        window.location.href = "login.html";
    });
    document.getElementById("adminSearchInput").addEventListener("input", renderOrders);
    document.getElementById("statusFilter").addEventListener("change", renderOrders);
}

async function loadAdminData({ silent = false, fromPolling = false } = {}) {
    try {
        const [orders, products] = await Promise.all([
            apiFetch("/pedidos"),
            apiFetch("/productos")
        ]);

        const previousLastOrderId = adminState.lastOrderId;
        adminState.orders = orders;
        adminState.products = products;
        adminState.lastOrderId = orders[0]?.id || null;

        renderMetrics();
        renderOrders();
        renderLowStock();
        renderInsight();

        if (fromPolling && previousLastOrderId && adminState.lastOrderId && adminState.lastOrderId !== previousLastOrderId) {
            showToast("Llego un pedido nuevo. Revisa la cola de despacho.");
        }
    } catch (error) {
        if (!silent) {
            showToast(error.message, "error");
        }
        document.getElementById("liveIndicator").className = "inline-banner";
        document.getElementById("liveIndicator").textContent = "No pudimos actualizar automaticamente en este momento.";
    }
}

function renderMetrics() {
    const today = new Date().toDateString();
    const totalSales = adminState.orders.reduce((sum, order) => sum + order.total, 0);
    const todayOrders = adminState.orders.filter((order) => new Date(order.fechaCreacion).toDateString() === today).length;
    const pending = adminState.orders.filter((order) => order.estado === "PENDIENTE").length;
    const inProcess = adminState.orders.filter((order) => order.estado === "EN_PROCESO").length;
    const shipped = adminState.orders.filter((order) => order.estado === "DESPACHADO").length;
    const delivered = adminState.orders.filter((order) => order.estado === "ENTREGADO").length;

    document.getElementById("metricSales").textContent = formatCurrency(totalSales);
    document.getElementById("metricToday").textContent = todayOrders;
    document.getElementById("metricPending").textContent = pending;
    document.getElementById("metricProcess").textContent = inProcess;
    document.getElementById("metricShipped").textContent = shipped;
    document.getElementById("metricDelivered").textContent = delivered;
    document.getElementById("liveIndicator").className = "inline-banner success";
    document.getElementById("liveIndicator").textContent = "Monitoreo automatico activo.";
}

function renderOrders() {
    const container = document.getElementById("ordersList");
    const query = document.getElementById("adminSearchInput").value.trim().toLowerCase();
    const statusFilter = document.getElementById("statusFilter").value;

    const filtered = adminState.orders.filter((order) => {
        const matchesQuery = !query
            || order.nombreCliente.toLowerCase().includes(query)
            || order.emailCliente.toLowerCase().includes(query);
        const matchesStatus = statusFilter === "TODOS" || order.estado === statusFilter;
        return matchesQuery && matchesStatus;
    });

    if (!filtered.length) {
        container.innerHTML = `<div class="empty-state">No hay pedidos que coincidan con ese filtro.</div>`;
        return;
    }

    container.innerHTML = filtered.map((order) => {
        const status = getStatusMeta(order.estado);
        return `
            <article class="order-card operational-card">
                <div class="order-header">
                    <div>
                        <h4>${order.nombreCliente}</h4>
                        <p class="muted">${order.emailCliente} - ${order.telefono}</p>
                    </div>
                    <span class="status-pill ${status.className}">${status.label}</span>
                </div>
                <div class="order-meta">
                    <span class="meta-chip">${formatDate(order.fechaCreacion)}</span>
                    <span class="meta-chip">${order.metodoPago}</span>
                    <span class="meta-chip">${order.mayorista ? "Mayorista" : "Regular"}</span>
                    <span class="meta-chip">${order.totalUnidades} unidades</span>
                </div>
                <p class="muted">${order.direccion}</p>
                <div class="summary-row admin-order-total">
                    <span>Total del pedido</span>
                    <strong>${formatCurrency(order.total)}</strong>
                </div>
                <ul class="order-items">
                    ${order.detalles.map((detail) => `<li>${detail.productoNombre} x${detail.cantidad} - ${formatCurrency(detail.subtotal)}</li>`).join("")}
                </ul>
                <div class="status-actions">
                    ${renderStatusButton(order.id, "PENDIENTE", order.estado, "Pendiente")}
                    ${renderStatusButton(order.id, "EN_PROCESO", order.estado, "En proceso")}
                    ${renderStatusButton(order.id, "DESPACHADO", order.estado, "Despachar pedido")}
                    ${renderStatusButton(order.id, "ENTREGADO", order.estado, "Entregado")}
                </div>
            </article>
        `;
    }).join("");
}

function renderStatusButton(orderId, statusValue, currentStatus, label) {
    const active = statusValue === currentStatus ? "active" : "";
    return `<button class="status-button ${active}" type="button" onclick="updateOrderStatus(${orderId}, '${statusValue}')">${label}</button>`;
}

async function updateOrderStatus(orderId, status) {
    try {
        await apiFetch(`/pedidos/${orderId}/estado`, {
            method: "PUT",
            body: JSON.stringify({ estado: status })
        });
        await loadAdminData({ silent: true });
        showToast("Estado actualizado correctamente.");
    } catch (error) {
        showToast(error.message, "error");
    }
}

function renderLowStock() {
    const lowStock = adminState.products.filter((product) => product.stock <= 8);
    const container = document.getElementById("lowStockList");

    if (!lowStock.length) {
        container.innerHTML = `<div class="empty-state">Todo el inventario esta en niveles saludables.</div>`;
        return;
    }

    container.innerHTML = lowStock.map((product) => `
        <article class="stock-card ${product.stock === 0 ? "stock-zero" : "stock-alert"}">
            <strong>${product.nombre}</strong>
            <p class="muted">${product.stock === 0 ? "Agotado" : `${product.stock} unidades restantes`}</p>
        </article>
    `).join("");
}

function renderInsight() {
    const pending = adminState.orders.filter((order) => order.estado === "PENDIENTE").length;
    const todaySales = adminState.orders
        .filter((order) => new Date(order.fechaCreacion).toDateString() === new Date().toDateString())
        .reduce((sum, order) => sum + order.total, 0);
    const lowStock = adminState.products.filter((product) => product.stock <= 8).length;

    const insight = pending > 0
        ? `Tienes ${pending} pedidos esperando gestion. Prioriza confirmar y pasar a despacho.`
        : lowStock > 0
            ? `No hay cola critica de pedidos, pero ${lowStock} productos necesitan reposicion.`
            : `Operacion estable hoy. Las ventas del dia van en ${formatCurrency(todaySales)}.`;

    document.getElementById("adminInsight").textContent = insight;
}
