/**
 * The flights shown on the home page's "Available Flights" list.
 *
 * Kept out of the FlightCard component module on purpose: exporting a plain
 * array alongside a component breaks React fast refresh, so the data lives here
 * and both the card and the page import it.
 */
const flights = [
  { airline: "Delta Airlines", from: "JKIA", to: "ITIA", time: "14h 45m", price: "2100" },
  { airline: "British Airways", from: "DPS", to: "CGK", time: "10h 50m", price: "2020" },
  { airline: "Qatar Airways", from: "JKIA", to: "ITIA", time: "12h 30m", price: "1900" },
  { airline: "Emirates", from: "DPS", to: "CGK", time: "12h 15m", price: "2160" },
  { airline: "Ethiopian Airlines", from: "JKIA", to: "ITIA", time: "13h 10m", price: "1800" },
  { airline: "Aeroflot Russian Airlines", from: "DPS", to: "CGK", time: "13h 25m", price: "2800" },
  { airline: "Air Canada", from: "JKIA", to: "CGK", time: "14h 00m", price: "2200" },
  { airline: "Singapore Airlines", from: "DPS", to: "ITIA", time: "14h 30m", price: "2400" },
  { airline: "Qantas Airways", from: "JKIA", to: "CGK", time: "15h 15m", price: "2600" },
  { airline: "Turkish Airlines", from: "CGK", to: "ITIA", time: "15h 45m", price: "2800" },
];

export { flights };
