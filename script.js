const state = {
  vacations: [],
  nextId: 1,
  editingId: null,
  language: "en",
};

const AUTH_STORAGE_KEY = "vacationPlannerAuthRecord";
const CLOUD_SYNC_PATH = "betaCredentials";

const authState = {
  mode: "signup",
  record: null,
};

const cloudDatabaseUrl = (
  window.APP_CONFIG?.firebaseDatabaseUrl || ""
).replace(/\/+$/, "");

const createCurrencyFormatter = (language) => {
  const locale = language === "es" ? "es-ES" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
};

let currencyFormatter = createCurrencyFormatter(state.language);

const categories = [
  { key: "lodging", labelKey: "category_lodging" },
  { key: "flights", labelKey: "category_flights" },
  { key: "food", labelKey: "category_food" },
  { key: "transport", labelKey: "category_transport" },
  { key: "tours", labelKey: "category_tours" },
];

const translations = {
  en: {
    app_title: "Vacation Planner",
    kicker: "Vacation Cost Studio",
    hero_title: "Vacation Planner",
    hero_annual_label: "Total Annual Vacation Spend",
    hero_count_label: "Vacations Added",
    hero_avg_label: "Per Trip Average",
    step1_label: "Step 1",
    step1_title: "Add a Vacation",
    step1_sub:
      "Enter the cost breakdown and how many times you repeat the trip each year. All costs are per trip.",
    btn_reset_entry: "Reset Entry",
    btn_add_vacation: "Add Vacation",
    btn_save_changes: "Save Changes",
    label_name: "Vacation Name",
    placeholder_name: "e.g., Amalfi Coast Escape",
    label_lodging: "Vacation Amount (Stay)",
    label_flights: "Flights",
    label_food: "Food",
    label_transport: "Transportation",
    label_tours: "Tours & Activities",
    label_repeats: "Times Per Year",
    step2_label: "Step 2",
    step2_title: "Your Vacation Portfolio",
    step2_sub: "Review totals and see the cost split for each vacation added.",
    btn_reset_portfolio: "Reset Portfolio",
    summary_annual: "Total Annual Cost",
    summary_per_trip: "Combined Per Trip Cost",
    summary_repeats: "Total Trips / Year",
    empty_title: "No vacations yet",
    empty_body: "Add your first vacation to build a portfolio.",
    card_eyebrow: "Vacation",
    card_edit: "Edit",
    card_remove: "Remove",
    metric_per_trip_total: "Per Trip Total",
    metric_trips_per_year: "Trips Per Year",
    metric_annual_total: "Annual Total",
    breakdown_category: "Category",
    breakdown_per_trip: "Per Trip",
    breakdown_per_year: "Per Year",
    step3_label: "Step 3",
    step3_title: "Multi-Year Projection",
    step3_sub: "Estimate long-term vacation spending with inflation.",
    btn_reset_projection: "Reset Projection",
    btn_calc_projection: "Calculate Projection",
    label_years: "Number of Years",
    label_inflation: "Inflation Rate (%)",
    result_without_inflation: "Total Without Inflation",
    result_with_inflation: "Total With Inflation",
    result_final_year: "Final Year Annual Cost",
    label_language: "Language",
    option_lang_en: "English",
    option_lang_es: "Español",
    auth_kicker: "Secure Access",
    auth_create_title: "Create Account",
    auth_create_sub:
      "Enter email and password to continue beta testing.",
    auth_login_title: "Create Account",
    auth_login_sub: "Enter email and password to continue beta testing.",
    auth_label_username: "Email",
    auth_label_password: "Password",
    auth_label_confirm: "Confirm Password",
    auth_placeholder_username: "Enter email",
    auth_placeholder_password: "Enter password",
    auth_placeholder_confirm: "Confirm password",
    auth_storage_note:
      "Credentials are stored locally and synced to cloud in plain text for beta testing.",
    auth_btn_create: "Create and Continue",
    auth_btn_login: "Login",
    auth_error_username_required: "Enter an email or username.",
    auth_error_password_required: "Enter your password.",
    auth_error_password_min: "Password must be at least 1 character.",
    auth_error_invalid_credentials: "Invalid email or password.",
    auth_error_storage_unavailable:
      "Local storage is unavailable in this browser, so login cannot be saved.",
    auth_error_storage_failed: "Could not store login details. Try again.",
    auth_error_cloud_unconfigured:
      "Cloud sync is not configured. Set firebaseDatabaseUrl in config.js.",
    auth_error_cloud_sync:
      "Cloud sync failed. Check network or Firebase database settings.",
    auth_error_cloud_sync_status:
      "Cloud sync failed ({status}). Check Firebase rules/database URL.",
    update_available_message: "A new version is available.",
    btn_update_now: "Update now",
    btn_update_later: "Later",
    message_invalid_cost: "Add at least one cost above $0 to create a vacation.",
    message_invalid_repeats: "Times per year must be at least 1.",
    message_invalid_years: "Enter a valid number of years.",
    message_editing: 'Editing "{name}". Update values and press Save Changes.',
    default_vacation_name: "Vacation {id}",
    category_lodging: "Vacation Stay",
    category_flights: "Flights",
    category_food: "Food",
    category_transport: "Transportation",
    category_tours: "Tours & Activities",
  },
  es: {
    app_title: "Planificador de Vacaciones",
    kicker: "Estudio de Costos de Vacaciones",
    hero_title: "Planificador de Vacaciones",
    hero_annual_label: "Gasto Anual Total en Vacaciones",
    hero_count_label: "Vacaciones Agregadas",
    hero_avg_label: "Promedio por Viaje",
    step1_label: "Paso 1",
    step1_title: "Agregar unas Vacaciones",
    step1_sub:
      "Ingresa el desglose de costos y cuántas veces repites el viaje cada año. Todos los costos son por viaje.",
    btn_reset_entry: "Reiniciar Entrada",
    btn_add_vacation: "Agregar Vacaciones",
    btn_save_changes: "Guardar Cambios",
    label_name: "Nombre de las Vacaciones",
    placeholder_name: "ej., Escapada a la Costa Amalfitana",
    label_lodging: "Costo de Hospedaje",
    label_flights: "Vuelos",
    label_food: "Comida",
    label_transport: "Transporte",
    label_tours: "Tours y Actividades",
    label_repeats: "Veces por Año",
    step2_label: "Paso 2",
    step2_title: "Tu Portafolio de Vacaciones",
    step2_sub: "Revisa totales y el desglose de costos de cada viaje agregado.",
    btn_reset_portfolio: "Reiniciar Portafolio",
    summary_annual: "Costo Anual Total",
    summary_per_trip: "Costo Total por Viaje",
    summary_repeats: "Total de Viajes / Año",
    empty_title: "Aún no hay vacaciones",
    empty_body: "Agrega tu primer viaje para crear un portafolio.",
    card_eyebrow: "Vacaciones",
    card_edit: "Editar",
    card_remove: "Eliminar",
    metric_per_trip_total: "Total por Viaje",
    metric_trips_per_year: "Viajes por Año",
    metric_annual_total: "Total Anual",
    breakdown_category: "Categoría",
    breakdown_per_trip: "Por Viaje",
    breakdown_per_year: "Por Año",
    step3_label: "Paso 3",
    step3_title: "Proyección a Varios Años",
    step3_sub: "Estima el gasto a largo plazo con inflación.",
    btn_reset_projection: "Reiniciar Proyección",
    btn_calc_projection: "Calcular Proyección",
    label_years: "Número de Años",
    label_inflation: "Inflación (%)",
    result_without_inflation: "Total Sin Inflación",
    result_with_inflation: "Total Con Inflación",
    result_final_year: "Costo Anual del Último Año",
    label_language: "Idioma",
    option_lang_en: "Inglés",
    option_lang_es: "Español",
    auth_kicker: "Acceso Seguro",
    auth_create_title: "Crear Cuenta",
    auth_create_sub:
      "Ingresa correo y contraseña para continuar las pruebas beta.",
    auth_login_title: "Crear Cuenta",
    auth_login_sub:
      "Ingresa correo y contraseña para continuar las pruebas beta.",
    auth_label_username: "Correo",
    auth_label_password: "Contraseña",
    auth_label_confirm: "Confirmar Contraseña",
    auth_placeholder_username: "Ingresa correo",
    auth_placeholder_password: "Ingresa contraseña",
    auth_placeholder_confirm: "Confirma contraseña",
    auth_storage_note:
      "Las credenciales se guardan localmente y se sincronizan en la nube en texto plano para pruebas beta.",
    auth_btn_create: "Crear y Continuar",
    auth_btn_login: "Iniciar Sesión",
    auth_error_username_required:
      "Ingresa un correo o nombre de usuario.",
    auth_error_password_required: "Ingresa tu contraseña.",
    auth_error_password_min: "La contraseña debe tener al menos 1 carácter.",
    auth_error_invalid_credentials: "Correo o contraseña incorrectos.",
    auth_error_storage_unavailable:
      "El almacenamiento local no está disponible y no se puede guardar el acceso.",
    auth_error_storage_failed:
      "No se pudo guardar la información de acceso. Intenta de nuevo.",
    auth_error_cloud_unconfigured:
      "La nube no está configurada. Define firebaseDatabaseUrl en config.js.",
    auth_error_cloud_sync:
      "La sincronización en la nube falló. Revisa red o configuración de Firebase.",
    auth_error_cloud_sync_status:
      "La sincronización en la nube falló ({status}). Revisa reglas y URL de Firebase.",
    update_available_message: "Hay una nueva versión disponible.",
    btn_update_now: "Actualizar ahora",
    btn_update_later: "Después",
    message_invalid_cost:
      "Agrega al menos un costo mayor a $0 para crear unas vacaciones.",
    message_invalid_repeats: "Las veces por año deben ser al menos 1.",
    message_invalid_years: "Ingresa un número de años válido.",
    message_editing:
      'Editando "{name}". Actualiza los valores y presiona Guardar Cambios.',
    default_vacation_name: "Vacación {id}",
    category_lodging: "Hospedaje",
    category_flights: "Vuelos",
    category_food: "Comida",
    category_transport: "Transporte",
    category_tours: "Tours y Actividades",
  },
};

const t = (key, vars = {}) => {
  const fallback = translations.en[key] || key;
  const template = translations[state.language]?.[key] || fallback;
  return template.replace(/\{(\w+)\}/g, (_, token) =>
    Object.prototype.hasOwnProperty.call(vars, token) ? vars[token] : ""
  );
};

const syncLanguageFromStorage = () => {
  try {
    const stored = window.localStorage.getItem("vacationPlannerLang");
    if (stored === "en" || stored === "es") {
      state.language = stored;
    }
  } catch {
    state.language = "en";
  }
  currencyFormatter = createCurrencyFormatter(state.language);
};

const form = document.querySelector("#vacationForm");
const message = document.querySelector("#formMessage");
const addButton = document.querySelector("#addVacation");
const resetEntryButton = document.querySelector("#resetEntry");
const resetPortfolioButton = document.querySelector("#resetPortfolio");
const list = document.querySelector("#vacationList");
const emptyState = document.querySelector("#emptyState");
const annualTotal = document.querySelector("#annualTotal");
const vacationCount = document.querySelector("#vacationCount");
const avgTrip = document.querySelector("#avgTrip");
const portfolioAnnual = document.querySelector("#portfolioAnnual");
const portfolioPerTrip = document.querySelector("#portfolioPerTrip");
const portfolioRepeats = document.querySelector("#portfolioRepeats");

const yearsInput = document.querySelector("#years");
const inflationInput = document.querySelector("#inflation");
const projectionMessage = document.querySelector("#projectionMessage");
const calcProjectionButton = document.querySelector("#calcProjection");
const resetProjectionButton = document.querySelector("#resetProjection");
const totalNoInflation = document.querySelector("#totalNoInflation");
const totalWithInflation = document.querySelector("#totalWithInflation");
const finalYearCost = document.querySelector("#finalYearCost");
const langSelect = document.querySelector("#langSelect");
const appShell = document.querySelector("#appShell");
const authGate = document.querySelector("#authGate");
const authForm = document.querySelector("#authForm");
const authHeading = document.querySelector("#authHeading");
const authSubtitle = document.querySelector("#authSubtitle");
const authUsernameInput = document.querySelector("#authUsername");
const authPasswordInput = document.querySelector("#authPassword");
const authConfirmInput = document.querySelector("#authConfirm");
const authConfirmWrap = document.querySelector("#authConfirmWrap");
const authMessage = document.querySelector("#authMessage");
const authSubmitButton = document.querySelector("#authSubmit");
const updateToast = document.querySelector("#updateToast");
const updateNowButton = document.querySelector("#updateNow");
const updateLaterButton = document.querySelector("#updateLater");

let waitingServiceWorker = null;
let isRefreshingForUpdate = false;

const defaults = {
  vacationName: "",
  lodging: 0,
  flights: 0,
  food: 0,
  transport: 0,
  tours: 0,
  repeats: 1,
};

const parseMoney = (value) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? Math.max(parsed, 0) : 0;
};

const parseCount = (value) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

const parseYears = (value) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

const hasLocalStorageAccess = () => {
  try {
    const key = "__vacation_planner_storage_test__";
    window.localStorage.setItem(key, "1");
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

const normalizeEmail = (value) => value.trim();
const isCloudConfigured = () => cloudDatabaseUrl.length > 0;
const toCloudKey = (email) => {
  const bytes = new TextEncoder().encode(normalizeEmail(email));
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return window.btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};
const cloudRecordUrl = (email) =>
  `${cloudDatabaseUrl}/${CLOUD_SYNC_PATH}/${toCloudKey(email)}.json`;

const loadAuthRecord = () => {
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed.username !== "string" ||
      typeof parsed.password !== "string"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

const saveAuthRecord = (record) => {
  try {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(record));
    return true;
  } catch {
    return false;
  }
};

const setCloudAuthRecord = async (record) => {
  const payload = {
    username: record.username,
    password: record.password,
    updatedAt: new Date().toISOString(),
  };
  const response = await fetch(cloudRecordUrl(record.username), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`cloud_write_failed:${response.status}`);
  }
};

const setAuthMessage = (value) => {
  if (!authMessage) return;
  authMessage.textContent = value;
};

const setAuthMode = (mode) => {
  authState.mode = mode;

  if (authHeading) {
    authHeading.textContent = t(
      mode === "signup" ? "auth_create_title" : "auth_login_title"
    );
  }

  if (authSubtitle) {
    authSubtitle.textContent = t(
      mode === "signup" ? "auth_create_sub" : "auth_login_sub"
    );
  }

  if (authSubmitButton) {
    authSubmitButton.textContent = t(
      mode === "signup" ? "auth_btn_create" : "auth_btn_login"
    );
  }

  if (authConfirmWrap) {
    authConfirmWrap.hidden = true;
  }

  if (authConfirmInput) {
    authConfirmInput.required = false;
    authConfirmInput.value = "";
  }

  if (authPasswordInput) {
    authPasswordInput.autocomplete =
      mode === "signup" ? "new-password" : "current-password";
  }

  if (authUsernameInput) {
    authUsernameInput.autocomplete = "email";
  }
};

const lockApp = () => {
  if (!authGate) return;
  document.body.classList.add("app-locked");
  authGate.hidden = false;
  if (appShell) {
    appShell.setAttribute("aria-hidden", "true");
  }
  window.setTimeout(() => {
    authUsernameInput?.focus();
  }, 0);
};

const unlockApp = () => {
  if (!authGate) return;
  document.body.classList.remove("app-locked");
  authGate.hidden = true;
  if (appShell) {
    appShell.removeAttribute("aria-hidden");
  }
  authForm?.reset();
  setAuthMessage("");
};

const updateAddButtonLabel = () => {
  addButton.textContent = state.editingId
    ? t("btn_save_changes")
    : t("btn_add_vacation");
};

const applyTranslations = () => {
  document.title = t("app_title");
  document.documentElement.lang = state.language;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = t(key);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    element.placeholder = t(key);
  });

  updateAddButtonLabel();
  setAuthMode(authState.mode);

  if (document.body.classList.contains("app-locked") && !isCloudConfigured()) {
    setAuthMessage(t("auth_error_cloud_unconfigured"));
  }
};

const showUpdateToast = (worker) => {
  if (!updateToast) return;
  waitingServiceWorker = worker;
  updateToast.hidden = false;
  requestAnimationFrame(() => {
    updateToast.classList.add("is-visible");
  });
};

const hideUpdateToast = () => {
  if (!updateToast) return;
  updateToast.classList.remove("is-visible");
  updateToast.hidden = true;
  waitingServiceWorker = null;
};

const watchServiceWorkerRegistration = (registration) => {
  if (!registration) return;

  if (registration.waiting) {
    showUpdateToast(registration.waiting);
  }

  registration.addEventListener("updatefound", () => {
    const installingWorker = registration.installing;
    if (!installingWorker) return;

    installingWorker.addEventListener("statechange", () => {
      if (
        installingWorker.state === "installed" &&
        navigator.serviceWorker.controller
      ) {
        showUpdateToast(installingWorker);
      }
    });
  });
};

const initializeAuthentication = () => {
  if (!authGate || !authForm) return;

  if (!hasLocalStorageAccess()) {
    setAuthMode("signup");
    lockApp();
    setAuthMessage(t("auth_error_storage_unavailable"));
    if (authSubmitButton) {
      authSubmitButton.disabled = true;
    }
    return;
  }

  if (!isCloudConfigured()) {
    setAuthMode("login");
    lockApp();
    setAuthMessage(t("auth_error_cloud_unconfigured"));
    if (authSubmitButton) {
      authSubmitButton.disabled = true;
    }
    return;
  }

  authState.record = loadAuthRecord();
  setAuthMode(authState.record ? "login" : "signup");
  lockApp();
};

const sumCosts = (costs) =>
  categories.reduce((total, category) => total + costs[category.key], 0);

const resetEntryForm = () => {
  Object.entries(defaults).forEach(([key, value]) => {
    const input = form.elements[key];
    if (input) {
      input.value = value;
    }
  });
  state.editingId = null;
  updateAddButtonLabel();
  message.textContent = "";
};

const getFormData = (idOverride, fallbackName) => {
  const costs = {
    lodging: parseMoney(form.elements.lodging.value),
    flights: parseMoney(form.elements.flights.value),
    food: parseMoney(form.elements.food.value),
    transport: parseMoney(form.elements.transport.value),
    tours: parseMoney(form.elements.tours.value),
  };

  const repeats = parseCount(form.elements.repeats.value);
  const name = form.elements.vacationName.value.trim();

  return {
    id: idOverride ?? state.nextId,
    name:
      name ||
      fallbackName ||
      t("default_vacation_name", { id: idOverride ?? state.nextId }),
    costs,
    repeats,
  };
};

const validateVacation = (vacation) => {
  const total = sumCosts(vacation.costs);
  if (total <= 0) {
    return t("message_invalid_cost");
  }
  if (vacation.repeats <= 0) {
    return t("message_invalid_repeats");
  }
  return "";
};

const renderPortfolio = () => {
  list.innerHTML = "";

  if (state.vacations.length === 0) {
    emptyState.style.display = "block";
    list.appendChild(emptyState);
  } else {
    emptyState.style.display = "none";
    state.vacations.forEach((vacation) => {
      const perTrip = sumCosts(vacation.costs);
      const perYear = perTrip * vacation.repeats;

      const card = document.createElement("article");
      card.className = "vacation-card";
      card.innerHTML = `
        <div class="card-header">
          <div>
            <p class="card-eyebrow">${t("card_eyebrow")}</p>
            <h3 class="card-title"></h3>
          </div>
          <div class="card-actions">
            <button type="button" data-action="edit" data-id="${vacation.id}">
              ${t("card_edit")}
            </button>
            <button type="button" data-action="remove" data-id="${vacation.id}">
              ${t("card_remove")}
            </button>
          </div>
        </div>
        <div class="card-metrics">
          <div class="metric-card">
            <p>${t("metric_per_trip_total")}</p>
            <h4>${currencyFormatter.format(perTrip)}</h4>
          </div>
          <div class="metric-card">
            <p>${t("metric_trips_per_year")}</p>
            <h4>${vacation.repeats}</h4>
          </div>
          <div class="metric-card">
            <p>${t("metric_annual_total")}</p>
            <h4>${currencyFormatter.format(perYear)}</h4>
          </div>
        </div>
        <div class="breakdown">
          <div class="breakdown-header">
            <span>${t("breakdown_category")}</span>
            <span>${t("breakdown_per_trip")}</span>
            <span>${t("breakdown_per_year")}</span>
          </div>
          <div class="breakdown-rows"></div>
        </div>
      `;

      card.querySelector(".card-title").textContent = vacation.name;
      const rows = card.querySelector(".breakdown-rows");
      rows.innerHTML = categories
        .map((category) => {
          const perTripCost = vacation.costs[category.key];
          const perYearCost = perTripCost * vacation.repeats;
          return `
            <div class="breakdown-row">
              <span>${t(category.labelKey)}</span>
              <span>${currencyFormatter.format(perTripCost)}</span>
              <span>${currencyFormatter.format(perYearCost)}</span>
            </div>
          `;
        })
        .join("");

      list.appendChild(card);
    });
  }
};

const updateSummary = () => {
  const totals = state.vacations.map((vacation) => {
    const perTrip = sumCosts(vacation.costs);
    return {
      perTrip,
      perYear: perTrip * vacation.repeats,
      repeats: vacation.repeats,
    };
  });

  const totalAnnual = totals.reduce((sum, item) => sum + item.perYear, 0);
  const totalTrips = totals.reduce((sum, item) => sum + item.repeats, 0);
  const averageTripCost = totals.length
    ? totals.reduce((sum, item) => sum + item.perTrip, 0) / totals.length
    : 0;

  annualTotal.textContent = currencyFormatter.format(totalAnnual);
  vacationCount.textContent = state.vacations.length.toString();
  avgTrip.textContent = currencyFormatter.format(averageTripCost);

  portfolioAnnual.textContent = currencyFormatter.format(totalAnnual);
  portfolioPerTrip.textContent = currencyFormatter.format(
    totals.reduce((sum, item) => sum + item.perTrip, 0)
  );
  portfolioRepeats.textContent = totalTrips.toString();

  return totalAnnual;
};

const calculateProjection = () => {
  projectionMessage.textContent = "";
  const totalAnnual = updateSummary();
  const years = parseYears(yearsInput.value);
  const inflationRate = Math.max(parseFloat(inflationInput.value) || 0, 0) / 100;

  if (years <= 0) {
    projectionMessage.textContent = t("message_invalid_years");
    return;
  }

  const totalWithoutInflation = totalAnnual * years;
  let totalWithInflationValue = totalWithoutInflation;
  let finalYearValue = totalAnnual;

  if (inflationRate > 0) {
    totalWithInflationValue =
      totalAnnual * years +
      totalAnnual * inflationRate * ((years - 1) * years) / 2;
    finalYearValue = totalAnnual * (1 + inflationRate * (years - 1));
  }

  totalNoInflation.textContent = currencyFormatter.format(totalWithoutInflation);
  totalWithInflation.textContent =
    currencyFormatter.format(totalWithInflationValue);
  finalYearCost.textContent = currencyFormatter.format(finalYearValue);
};

addButton.addEventListener("click", () => {
  const editingVacation = state.vacations.find(
    (vacation) => vacation.id === state.editingId
  );
  const vacation = getFormData(state.editingId, editingVacation?.name);
  const error = validateVacation(vacation);
  if (error) {
    message.textContent = error;
    return;
  }

  message.textContent = "";
  if (state.editingId && editingVacation) {
    const index = state.vacations.findIndex(
      (entry) => entry.id === state.editingId
    );
    if (index !== -1) {
      state.vacations[index] = vacation;
    }
  } else {
    state.vacations.push(vacation);
    state.nextId += 1;
  }
  renderPortfolio();
  calculateProjection();
  resetEntryForm();
});

resetEntryButton.addEventListener("click", () => {
  resetEntryForm();
});

resetPortfolioButton.addEventListener("click", () => {
  state.vacations = [];
  state.nextId = 1;
  renderPortfolio();
  calculateProjection();
  resetEntryForm();
});

list.addEventListener("click", (event) => {
  const target = event.target.closest("button[data-action]");
  if (!target) return;
  const id = Number.parseInt(target.dataset.id, 10);

  if (target.dataset.action === "remove") {
    state.vacations = state.vacations.filter((vacation) => vacation.id !== id);
    if (state.editingId === id) {
      resetEntryForm();
    }
    renderPortfolio();
    calculateProjection();
    return;
  }

  if (target.dataset.action === "edit") {
    const vacation = state.vacations.find((entry) => entry.id === id);
    if (!vacation) return;
    state.editingId = id;
    form.elements.vacationName.value = vacation.name;
    form.elements.lodging.value = vacation.costs.lodging;
    form.elements.flights.value = vacation.costs.flights;
    form.elements.food.value = vacation.costs.food;
    form.elements.transport.value = vacation.costs.transport;
    form.elements.tours.value = vacation.costs.tours;
    form.elements.repeats.value = vacation.repeats;
    updateAddButtonLabel();
    message.textContent = t("message_editing", { name: vacation.name });
  }
});

calcProjectionButton.addEventListener("click", () => {
  calculateProjection();
});

if (authForm) {
  authForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setAuthMessage("");

    const username = normalizeEmail(authUsernameInput?.value || "");
    const password = authPasswordInput?.value || "";

    if (!username) {
      setAuthMessage(t("auth_error_username_required"));
      return;
    }

    if (!password) {
      setAuthMessage(t("auth_error_password_required"));
      return;
    }

    const record = { username, password };
    if (!isCloudConfigured()) {
      setAuthMessage(t("auth_error_cloud_unconfigured"));
      return;
    }

    try {
      await setCloudAuthRecord(record);
    } catch (error) {
      const detail =
        typeof error?.message === "string" ? error.message.split(":")[1] : "";
      if (detail) {
        setAuthMessage(t("auth_error_cloud_sync_status", { status: detail }));
      } else {
        setAuthMessage(t("auth_error_cloud_sync"));
      }
      return;
    }

    const stored = saveAuthRecord(record);
    if (!stored) {
      setAuthMessage(t("auth_error_storage_failed"));
      return;
    }

    authState.record = record;
    setAuthMode("login");
    unlockApp();
  });
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (isRefreshingForUpdate) return;
    isRefreshingForUpdate = true;
    window.location.reload();
  });

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then((registration) => {
        watchServiceWorkerRegistration(registration);
        registration.update().catch(() => {});

        window.setInterval(() => {
          registration.update().catch(() => {});
        }, 60 * 60 * 1000);
      })
      .catch(() => {});
  });
}

if (updateNowButton) {
  updateNowButton.addEventListener("click", () => {
    if (waitingServiceWorker) {
      const worker = waitingServiceWorker;
      hideUpdateToast();
      worker.postMessage({ type: "SKIP_WAITING" });
    } else {
      window.location.reload();
    }
  });
}

if (updateLaterButton) {
  updateLaterButton.addEventListener("click", () => {
    hideUpdateToast();
  });
}

langSelect.addEventListener("change", () => {
  state.language = langSelect.value;
  currencyFormatter = createCurrencyFormatter(state.language);
  try {
    window.localStorage.setItem("vacationPlannerLang", state.language);
  } catch {
    // Ignore storage write failures (private mode / blocked storage).
  }
  applyTranslations();
  renderPortfolio();
  calculateProjection();

  if (state.editingId) {
    const vacation = state.vacations.find(
      (entry) => entry.id === state.editingId
    );
    if (vacation) {
      message.textContent = t("message_editing", { name: vacation.name });
    }
  } else {
    message.textContent = "";
  }
  projectionMessage.textContent = "";
});

resetProjectionButton.addEventListener("click", () => {
  yearsInput.value = 5;
  inflationInput.value = 3;
  projectionMessage.textContent = "";
  calculateProjection();
});

syncLanguageFromStorage();
langSelect.value = state.language;
applyTranslations();
resetEntryForm();
renderPortfolio();
calculateProjection();
initializeAuthentication();
