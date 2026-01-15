/*
  Average Nigerian electricity tariff rates (₦ per kWh)
  Source: NERC averages (may vary by DISCO and review period)

  NOTE:
  - These are DEFAULT values
  - Users can override with a custom ₦/kWh in the UI
  - Update values here anytime without touching app.js
*/

const TARIFF_RATES_NGN_PER_KWH = {
    A: 225, // Highest supply hours
    B: 175,
    C: 125,
    D: 90,
    E: 70   // Lowest supply hours
  };
  