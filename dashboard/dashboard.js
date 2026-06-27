// @ts-nocheck -- This file runs directly in the browser; Polaris elements are registered by the CDN runtime.
const root = document.querySelector("#app");
const state = {
  token: localStorage.getItem("openmantle.session"),
  view: "overview",
  apps: [],
  credentials: [],
  selectedAppId: null,
  notice: null,
};

const views = [
  ["overview", "Overview"],
  ["apps", "Apps & shops"],
  ["usage", "Usage"],
  ["events", "Events"],
  ["developers", "Developers"],
];

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      accept: "application/json",
      ...(options.body ? { "content-type": "application/json" } : {}),
      ...(state.token ? { authorization: `Bearer ${state.token}` } : {}),
      ...options.headers,
    },
  });
  const body = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("openmantle.session");
      state.token = null;
    }
    throw new Error(body?.error || `Request failed with HTTP ${response.status}`);
  }
  return body;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function value(id) {
  return document.querySelector(`#${id}`)?.value?.trim() ?? "";
}

function formatDate(input) {
  return input ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(input)) : "—";
}

function badge(status) {
  const tone = status === "reported" || status === "active" || status === "delivered" || status === "verified"
    ? "success"
    : status === "failed" || status === "none" ? "critical" : "caution";
  return `<s-badge tone="${tone}">${escapeHtml(status || "unknown")}</s-badge>`;
}

function notice() {
  if (!state.notice) return "";
  return `<s-banner heading="${escapeHtml(state.notice.heading)}" tone="${state.notice.tone || "info"}" dismissible>${escapeHtml(state.notice.message)}</s-banner>`;
}

function shell(content, heading = "OpenMantle") {
  root.heading = heading;
  root.innerHTML = `
    <s-stack direction="block" gap="base">
      <s-stack direction="inline" gap="base">
        ${views.map(([id, label]) => `<s-button data-view="${id}" variant="${state.view === id ? "primary" : "secondary"}">${label}</s-button>`).join("")}
        <s-button data-action="logout" variant="tertiary">Log out</s-button>
      </s-stack>
      ${notice()}
      ${content}
    </s-stack>`;
  root.querySelectorAll("[data-view]").forEach((button) => button.addEventListener("click", () => {
    state.view = button.dataset.view;
    state.notice = null;
    void render();
  }));
  root.querySelector('[data-action="logout"]')?.addEventListener("click", () => {
    localStorage.removeItem("openmantle.session");
    state.token = null;
    renderAuth();
  });
}

function renderAuth(mode = "login", message = "") {
  root.heading = mode === "signup" ? "Create your OpenMantle organization" : "Sign in to OpenMantle";
  root.innerHTML = `
    <s-section heading="${mode === "signup" ? "Create account" : "Welcome back"}">
      <s-stack direction="block" gap="base">
        ${message ? `<s-banner heading="Couldn’t continue" tone="critical">${escapeHtml(message)}</s-banner>` : ""}
        ${mode === "signup" ? '<s-text-field id="organization-name" label="Organization name" required></s-text-field>' : ""}
        <s-email-field id="email" label="Email" autocomplete="email" required></s-email-field>
        <s-password-field id="password" label="Password" autocomplete="current-password" minLength="12" required></s-password-field>
        <s-stack direction="inline" gap="base">
          <s-button id="auth-submit" variant="primary">${mode === "signup" ? "Create account" : "Sign in"}</s-button>
          <s-button id="auth-toggle" variant="secondary">${mode === "signup" ? "I have an account" : "Create account"}</s-button>
        </s-stack>
      </s-stack>
    </s-section>`;
  document.querySelector("#auth-toggle").addEventListener("click", () => renderAuth(mode === "signup" ? "login" : "signup"));
  document.querySelector("#auth-submit").addEventListener("click", async () => {
    try {
      const path = mode === "signup" ? "/v1/auth/signup" : "/v1/auth/login";
      const payload = mode === "signup"
        ? { organizationName: value("organization-name"), email: value("email"), password: value("password") }
        : { email: value("email"), password: value("password") };
      const session = await api(path, { method: "POST", body: JSON.stringify(payload) });
      state.token = session.token;
      localStorage.setItem("openmantle.session", session.token);
      await render();
    } catch (error) {
      renderAuth(mode, error.message);
    }
  });
}

async function loadCore() {
  const [apps, credentials] = await Promise.all([api("/v1/apps"), api("/v1/partner-credentials")]);
  state.apps = apps.data;
  state.credentials = credentials.data;
  state.selectedAppId ||= state.apps[0]?.id ?? null;
}

async function renderOverview() {
  const overview = await api("/v1/dashboard/overview");
  const metrics = [
    ["Apps", overview.appCount], ["Shops", overview.shopCount],
    ["Pending usage", overview.pendingUsageCount], ["Needs attention", overview.failedUsageCount + overview.deadLetterCount + overview.failedWebhookCount],
  ];
  shell(`
    <s-section heading="${escapeHtml(overview.name)}">
      <s-grid gridTemplateColumns="repeat(4, minmax(0, 1fr))" gap="base">
        ${metrics.map(([label, count]) => `<s-box padding="base" border="base" borderRadius="base"><s-stack direction="block" gap="small"><s-text tone="neutral" color="subdued">${label}</s-text><s-heading>${count}</s-heading></s-stack></s-box>`).join("")}
      </s-grid>
    </s-section>
    ${state.credentials.length && state.apps.length ? `
      <s-section heading="System status">
        <s-stack direction="block" gap="base">
          <s-banner heading="Partner connection ready" tone="success">Subscription polling and historical event synchronization are configured.</s-banner>
          ${overview.failedUsageCount || overview.deadLetterCount || overview.failedWebhookCount
            ? '<s-banner heading="Some deliveries need attention" tone="warning">Review Usage and Developers for failed records.</s-banner>'
            : '<s-banner heading="All delivery pipelines are healthy" tone="success">No failed usage records, dead letters, or webhooks.</s-banner>'}
        </s-stack>
      </s-section>` : `
      <s-section heading="Finish setup">
        <s-ordered-list>
          <s-list-item>Connect a Shopify Partner credential.</s-list-item>
          <s-list-item>Register an app and its installed shops.</s-list-item>
          <s-list-item>Add meters and App Events credentials.</s-list-item>
          <s-list-item>Create an API key for usage ingestion.</s-list-item>
        </s-ordered-list>
        <s-button data-jump="apps" variant="primary">Start setup</s-button>
      </s-section>`}`);
  root.querySelector("[data-jump]")?.addEventListener("click", () => { state.view = "apps"; void render(); });
}

async function renderApps() {
  await loadCore();
  const credentialOptions = state.credentials.map((item) => `<s-option value="${item.id}">${escapeHtml(item.partnerOrganizationId)}</s-option>`).join("");
  const appOptions = state.apps.map((item) => `<s-option value="${item.id}" ${item.id === state.selectedAppId ? "selected" : ""}>${escapeHtml(item.name)}</s-option>`).join("");
  let shops = [];
  let meters = [];
  if (state.selectedAppId) {
    [shops, meters] = await Promise.all([
      api(`/v1/apps/${state.selectedAppId}/shops`).then((item) => item.data),
      api(`/v1/apps/${state.selectedAppId}/meters`).then((item) => item.data),
    ]);
    shops = await Promise.all(shops.map(async (shop) => {
      try { return { ...shop, subscription: await api(`/v1/shops/${shop.id}/subscription`) }; }
      catch { return { ...shop, subscription: null }; }
    }));
  }
  shell(`
    <s-section heading="Partner connection">
      <s-stack direction="block" gap="base">
        ${state.credentials.length ? `<s-table><s-table-header-row><s-table-header listSlot="primary">Organization ID</s-table-header><s-table-header>Verified</s-table-header></s-table-header-row><s-table-body>${state.credentials.map((item) => `<s-table-row><s-table-cell>${escapeHtml(item.partnerOrganizationId)}</s-table-cell><s-table-cell>${badge("verified")}</s-table-cell></s-table-row>`).join("")}</s-table-body></s-table>` : '<s-banner heading="No Partner credential" tone="info">Connect a credential with Manage apps and View financials permissions.</s-banner>'}
        <s-grid gridTemplateColumns="1fr 2fr auto" gap="base" alignItems="end">
          <s-text-field id="partner-org-id" label="Partner organization ID"></s-text-field>
          <s-password-field id="partner-token" label="Partner access token"></s-password-field>
          <s-button data-action="connect-partner" variant="primary">Connect</s-button>
        </s-grid>
      </s-stack>
    </s-section>
    <s-section heading="Apps">
      <s-stack direction="block" gap="base">
        ${state.credentials.length ? `<s-grid gridTemplateColumns="1fr 2fr 2fr auto" gap="base" alignItems="end"><s-select id="app-credential" label="Credential">${credentialOptions}</s-select><s-text-field id="app-name" label="App name"></s-text-field><s-text-field id="shopify-app-id" label="Shopify app GID" placeholder="gid://shopify/App/123"></s-text-field><s-button data-action="create-app" variant="primary">Add app</s-button></s-grid>` : ""}
        ${state.apps.length ? `<s-select id="selected-app" label="Manage app">${appOptions}</s-select>` : '<s-banner heading="No apps registered" tone="info">Add your first Shopify app after connecting a Partner credential.</s-banner>'}
      </s-stack>
    </s-section>
    ${state.selectedAppId ? `
      <s-section heading="App Events and meters">
        <s-stack direction="block" gap="base">
          <s-grid gridTemplateColumns="1fr 2fr auto" gap="base" alignItems="end"><s-text-field id="events-client-id" label="Dev Dashboard client ID"></s-text-field><s-password-field id="events-client-secret" label="Dev Dashboard client secret"></s-password-field><s-button data-action="save-events-credentials" variant="primary">Verify and save</s-button></s-grid>
          <s-grid gridTemplateColumns="2fr auto" gap="base" alignItems="end"><s-text-field id="meter-key" label="Meter event handle" placeholder="sms_sent"></s-text-field><s-button data-action="create-meter" variant="primary">Add meter</s-button></s-grid>
          ${meters.length ? `<s-stack direction="inline" gap="small">${meters.map((meter) => `<s-chip accessibilityLabel="Meter ${escapeHtml(meter.key)}">${escapeHtml(meter.key)}</s-chip>`).join("")}</s-stack>` : '<s-text tone="neutral" color="subdued">No meters configured.</s-text>'}
        </s-stack>
      </s-section>
      <s-section heading="Installed shops">
        <s-grid gridTemplateColumns="2fr 2fr auto" gap="base" alignItems="end"><s-text-field id="shop-domain" label="Shop domain" placeholder="example.myshopify.com"></s-text-field><s-text-field id="shopify-shop-id" label="Shopify shop GID" placeholder="gid://shopify/Shop/123"></s-text-field><s-button data-action="create-shop" variant="primary">Add shop</s-button></s-grid>
        ${shops.length ? `<s-table><s-table-header-row><s-table-header listSlot="primary">Shop</s-table-header><s-table-header>Plan</s-table-header><s-table-header>Status</s-table-header><s-table-header>Observed</s-table-header></s-table-header-row><s-table-body>${shops.map((shop) => `<s-table-row><s-table-cell>${escapeHtml(shop.domain)}</s-table-cell><s-table-cell>${escapeHtml(shop.subscription?.planHandle || "—")}</s-table-cell><s-table-cell>${badge(shop.subscription?.status || "pending")}</s-table-cell><s-table-cell>${formatDate(shop.subscription?.observedAt)}</s-table-cell></s-table-row>`).join("")}</s-table-body></s-table>` : '<s-text tone="neutral" color="subdued">No shops registered for this app.</s-text>'}
      </s-section>` : ""}`,
    "Apps & shops");
  bindAppsActions();
}

function bindAppsActions() {
  document.querySelector("#selected-app")?.addEventListener("change", (event) => { state.selectedAppId = event.target.value; void render(); });
  bind("connect-partner", async () => api("/v1/partner-credentials", { method: "POST", body: JSON.stringify({ partnerOrganizationId: value("partner-org-id"), accessToken: value("partner-token") }) }), "Partner credential connected");
  bind("create-app", async () => api("/v1/apps", { method: "POST", body: JSON.stringify({ partnerCredentialId: value("app-credential"), shopifyAppId: value("shopify-app-id"), name: value("app-name") }) }), "App registered");
  bind("save-events-credentials", async () => api(`/v1/apps/${state.selectedAppId}/app-events-credentials`, { method: "PUT", body: JSON.stringify({ clientId: value("events-client-id"), clientSecret: value("events-client-secret") }) }), "App Events credentials verified");
  bind("create-meter", async () => api(`/v1/apps/${state.selectedAppId}/meters`, { method: "POST", body: JSON.stringify({ key: value("meter-key") }) }), "Meter added");
  bind("create-shop", async () => api(`/v1/apps/${state.selectedAppId}/shops`, { method: "POST", body: JSON.stringify({ domain: value("shop-domain"), shopifyShopId: value("shopify-shop-id") }) }), "Shop registered");
}

function bind(action, operation, success) {
  document.querySelector(`[data-action="${action}"]`)?.addEventListener("click", async () => {
    try {
      const result = await operation();
      state.notice = result?.notice ?? { heading: success, message: "The change was saved.", tone: "success" };
    } catch (error) {
      state.notice = { heading: "Couldn’t save", message: error.message, tone: "critical" };
    }
    await render();
  });
}

async function renderUsage() {
  const [analytics, events] = await Promise.all([
    api("/v1/dashboard/usage-analytics?days=30").then((item) => item.data),
    api("/v1/dashboard/usage-events?limit=100").then((item) => item.data),
  ]);
  const max = Math.max(1, ...analytics.map((item) => Math.abs(Number(item.quantity))));
  shell(`
    <s-section heading="30-day usage trend">
      <s-stack direction="block" gap="small">
        ${analytics.length ? analytics.slice(0, 30).map((item) => {
          const filled = Math.max(1, Math.round(Math.abs(Number(item.quantity)) / max * 12));
          return `<s-grid gridTemplateColumns="9rem 7rem ${filled}fr ${13 - filled}fr 5rem" gap="small" alignItems="center"><s-text>${escapeHtml(new Date(item.day).toLocaleDateString())}</s-text><s-text>${escapeHtml(item.meterKey)}</s-text><s-box background="subdued" padding="small" borderRadius="base"><s-text>${escapeHtml(item.quantity)}</s-text></s-box><s-box padding="small"><s-text> </s-text></s-box><s-text>${item.reportedCount}/${item.eventCount}</s-text></s-grid>`;
        }).join("") : '<s-banner heading="No usage yet" tone="info">Usage analytics appear after events are ingested.</s-banner>'}
      </s-stack>
    </s-section>
    <s-section heading="Recent usage events">
      ${events.length ? `<s-table><s-table-header-row><s-table-header listSlot="primary">Shop</s-table-header><s-table-header>Meter</s-table-header><s-table-header format="numeric">Quantity</s-table-header><s-table-header>Status</s-table-header><s-table-header>Created</s-table-header></s-table-header-row><s-table-body>${events.map((event) => `<s-table-row><s-table-cell>${escapeHtml(event.shopDomain || "—")}</s-table-cell><s-table-cell>${escapeHtml(event.meterKey)}</s-table-cell><s-table-cell>${escapeHtml(event.quantity)}</s-table-cell><s-table-cell>${badge(event.status)}</s-table-cell><s-table-cell>${formatDate(event.createdAt)}</s-table-cell></s-table-row>`).join("")}</s-table-body></s-table>` : '<s-text tone="neutral" color="subdued">No usage events.</s-text>'}
    </s-section>`, "Usage");
}

async function renderEvents() {
  const events = await api("/v1/historical-events?limit=100").then((item) => item.data);
  shell(`<s-section heading="Shopify historical events">${events.length ? `<s-table><s-table-header-row><s-table-header listSlot="primary">Event</s-table-header><s-table-header>Shop</s-table-header><s-table-header>Subject</s-table-header><s-table-header>Occurred</s-table-header></s-table-header-row><s-table-body>${events.map((event) => `<s-table-row><s-table-cell>${escapeHtml(event.eventType)}</s-table-cell><s-table-cell>${escapeHtml(event.shopifyShopId || "—")}</s-table-cell><s-table-cell>${escapeHtml(event.subjectType || "—")}</s-table-cell><s-table-cell>${formatDate(event.occurredAt)}</s-table-cell></s-table-row>`).join("")}</s-table-body></s-table>` : '<s-banner heading="No historical events" tone="info">Events appear after the Partner synchronization job runs.</s-banner>'}</s-section>`, "Events");
}

async function renderDevelopers() {
  const [keys, endpoints, deliveries, deadLetters] = await Promise.all([
    api("/v1/api-keys").then((item) => item.data), api("/v1/webhook-endpoints").then((item) => item.data),
    api("/v1/webhook-deliveries").then((item) => item.data), api("/v1/dead-letter-jobs").then((item) => item.data),
  ]);
  shell(`
    <s-section heading="API keys">
      <s-grid gridTemplateColumns="2fr auto" gap="base" alignItems="end"><s-text-field id="api-key-name" label="Key name" placeholder="Production SDK"></s-text-field><s-button data-action="create-api-key" variant="primary">Create key</s-button></s-grid>
      ${keys.length ? `<s-table><s-table-header-row><s-table-header listSlot="primary">Name</s-table-header><s-table-header>Prefix</s-table-header><s-table-header>Last used</s-table-header><s-table-header>Action</s-table-header></s-table-header-row><s-table-body>${keys.map((key) => `<s-table-row><s-table-cell>${escapeHtml(key.name)}</s-table-cell><s-table-cell>${escapeHtml(key.prefix)}</s-table-cell><s-table-cell>${formatDate(key.lastUsedAt)}</s-table-cell><s-table-cell>${key.revokedAt ? badge("revoked") : `<s-button data-revoke-key="${key.id}" variant="tertiary" tone="critical">Revoke</s-button>`}</s-table-cell></s-table-row>`).join("")}</s-table-body></s-table>` : '<s-text tone="neutral" color="subdued">No API keys.</s-text>'}
    </s-section>
    <s-section heading="Outbound webhooks">
      <s-grid gridTemplateColumns="1fr 2fr auto" gap="base" alignItems="end"><s-select id="webhook-app" label="App">${state.apps.map((item) => `<s-option value="${item.id}">${escapeHtml(item.name)}</s-option>`).join("")}</s-select><s-url-field id="webhook-url" label="HTTPS endpoint"></s-url-field><s-button data-action="create-webhook" variant="primary">Add endpoint</s-button></s-grid>
      ${endpoints.length ? `<s-table><s-table-header-row><s-table-header listSlot="primary">URL</s-table-header><s-table-header>Status</s-table-header><s-table-header>Action</s-table-header></s-table-header-row><s-table-body>${endpoints.map((endpoint) => `<s-table-row><s-table-cell>${escapeHtml(endpoint.url)}</s-table-cell><s-table-cell>${badge(endpoint.active ? "active" : "disabled")}</s-table-cell><s-table-cell>${endpoint.active ? `<s-button data-disable-webhook="${endpoint.id}" variant="tertiary" tone="critical">Disable</s-button>` : "—"}</s-table-cell></s-table-row>`).join("")}</s-table-body></s-table>` : '<s-text tone="neutral" color="subdued">No webhook endpoints.</s-text>'}
    </s-section>
    <s-section heading="Recent webhook deliveries">${deliveries.length ? `<s-table><s-table-header-row><s-table-header listSlot="primary">Event</s-table-header><s-table-header>Status</s-table-header><s-table-header format="numeric">Attempts</s-table-header><s-table-header>Created</s-table-header></s-table-header-row><s-table-body>${deliveries.slice(0, 25).map((delivery) => `<s-table-row><s-table-cell>${escapeHtml(delivery.eventType)}</s-table-cell><s-table-cell>${badge(delivery.status)}</s-table-cell><s-table-cell>${delivery.attempts}</s-table-cell><s-table-cell>${formatDate(delivery.createdAt)}</s-table-cell></s-table-row>`).join("")}</s-table-body></s-table>` : '<s-text tone="neutral" color="subdued">No webhook deliveries.</s-text>'}</s-section>
    <s-section heading="Dead-letter jobs">${deadLetters.length ? `<s-table><s-table-header-row><s-table-header listSlot="primary">Queue</s-table-header><s-table-header>Error</s-table-header><s-table-header format="numeric">Attempts</s-table-header><s-table-header>Action</s-table-header></s-table-header-row><s-table-body>${deadLetters.map((job) => `<s-table-row><s-table-cell>${escapeHtml(job.queue)}</s-table-cell><s-table-cell>${escapeHtml(job.error)}</s-table-cell><s-table-cell>${job.attempts}</s-table-cell><s-table-cell><s-button data-resolve-job="${job.id}" variant="tertiary">Resolve</s-button></s-table-cell></s-table-row>`).join("")}</s-table-body></s-table>` : '<s-banner heading="No unresolved dead letters" tone="success">The forwarding queue is clear.</s-banner>'}</s-section>`, "Developers");
  bindDeveloperActions();
}

function bindDeveloperActions() {
  bind("create-api-key", async () => {
    const created = await api("/v1/api-keys", { method: "POST", body: JSON.stringify({ name: value("api-key-name") }) });
    return { notice: { heading: "Copy this API key now", message: created.key, tone: "warning" } };
  }, "API key created");
  bind("create-webhook", async () => {
    const created = await api("/v1/webhook-endpoints", { method: "POST", body: JSON.stringify({ appId: value("webhook-app"), url: value("webhook-url") }) });
    return { notice: { heading: "Copy this signing secret now", message: created.secret, tone: "warning" } };
  }, "Webhook created");
  document.querySelectorAll("[data-revoke-key]").forEach((button) => button.addEventListener("click", async () => { await api(`/v1/api-keys/${button.dataset.revokeKey}`, { method: "DELETE" }); await render(); }));
  document.querySelectorAll("[data-disable-webhook]").forEach((button) => button.addEventListener("click", async () => { await api(`/v1/webhook-endpoints/${button.dataset.disableWebhook}`, { method: "DELETE" }); await render(); }));
  document.querySelectorAll("[data-resolve-job]").forEach((button) => button.addEventListener("click", async () => { await api(`/v1/dead-letter-jobs/${button.dataset.resolveJob}/resolve`, { method: "POST" }); await render(); }));
}

async function render() {
  if (!state.token) return renderAuth();
  try {
    await loadCore();
    if (state.view === "apps") return await renderApps();
    if (state.view === "usage") return await renderUsage();
    if (state.view === "events") return await renderEvents();
    if (state.view === "developers") return await renderDevelopers();
    return await renderOverview();
  } catch (error) {
    if (!state.token) return renderAuth("login", error.message);
    shell(`<s-banner heading="Dashboard couldn’t load" tone="critical">${escapeHtml(error.message)}</s-banner>`);
  }
}

async function initialize() {
  if (!state.token) {
    try {
      const session = await api("/v1/auth/single-tenant-session", { method: "POST" });
      state.token = session.token;
      localStorage.setItem("openmantle.session", session.token);
    } catch (error) {
      if (!error.message.includes("disabled")) console.warn(error);
    }
  }
  await render();
}

void initialize();
