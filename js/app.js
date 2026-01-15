const el = (id) => document.getElementById(id);

/* =========================
   ELEMENTS
========================= */
const tariffBandEl = el("tariffBand");
const unitsEl = el("units");
const cityEl = el("city");
const stateEl = el("state");

const useCustomRateEl = el("useCustomRate");
const customRateWrapperEl = el("customRateWrapper");
const customRateEl = el("customRate");

const resultsEl = el("results");
const amountEl = resultsEl.querySelector(".amount");
const breakdownEl = resultsEl.querySelector(".breakdown");

const yearEl = el("year");

// Theme buttons
const lightModeBtn = el("lightModeBtn");
const darkModeBtn = el("darkModeBtn");

/* =========================
   HELPERS
========================= */
function formatNaira(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "₦0.00";
  return "₦" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* =========================
   THEME
========================= */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  lightModeBtn.classList.toggle("active", theme === "light");
  darkModeBtn.classList.toggle("active", theme === "dark");
}

/* =========================
   CALCULATION
========================= */
function getRate() {
  if (useCustomRateEl.checked) {
    const custom = Number(customRateEl.value);
    return Number.isFinite(custom) && custom > 0 ? custom : null;
  }

  const band = tariffBandEl.value;
  if (!band) return null;

  return TARIFF_RATES_NGN_PER_KWH[band] ?? null;
}

function calculate() {
  const units = Number(unitsEl.value);
  const rate = getRate();

  if (!Number.isFinite(units) || units <= 0 || rate === null) {
    amountEl.textContent = "₦0.00";
    breakdownEl.textContent =
      "Select your tariff band and enter total kWh for the month.";
    return;
  }

  const bill = units * rate;

  const city = cityEl.value.trim();
  const state = stateEl.value.trim();
  const location =
    city || state ? ` • Location: ${[city, state].filter(Boolean).join(", ")}` : "";

  const rateText = useCustomRateEl.checked
    ? `Custom rate: ₦${rate}/kWh`
    : `Band ${tariffBandEl.value}: ₦${rate}/kWh`;

  amountEl.textContent = formatNaira(bill);
  breakdownEl.textContent = `${rateText} • Units: ${units} kWh${location}`;
}

/* =========================
   UI SYNC
========================= */
function syncCustomRateUI() {
  const enabled = useCustomRateEl.checked;
  customRateWrapperEl.hidden = !enabled;

  if (!enabled) customRateEl.value = "";
  calculate();
}

/* =========================
   INIT
========================= */
function init() {
  // Footer year
  yearEl.textContent = new Date().getFullYear();

  // Theme init
  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);

  lightModeBtn.addEventListener("click", () => applyTheme("light"));
  darkModeBtn.addEventListener("click", () => applyTheme("dark"));

  // Events
  tariffBandEl.addEventListener("change", calculate);
  unitsEl.addEventListener("input", calculate);
  cityEl.addEventListener("input", calculate);
  stateEl.addEventListener("input", calculate);
  useCustomRateEl.addEventListener("change", syncCustomRateUI);
  customRateEl.addEventListener("input", calculate);

  breakdownEl.textContent =
    "Select your tariff band and enter total kWh for the month.";
  syncCustomRateUI();
}

document.addEventListener("DOMContentLoaded", init);
