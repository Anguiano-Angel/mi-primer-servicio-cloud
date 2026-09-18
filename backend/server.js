const express = require("express");
const cors = require("cors");
const axios = require("axios");
const csv = require("csvtojson");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Reemplaza esta URL con el enlace CSV de Google Sheets
const GOOGLE_SHEETS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTAEitsnT8EYA3BjWT5dlSErNwuObdrKbuXAob0UyxBMDYAE6D3SUk9P-7YnXTmcVyquAP3guJRW2Xx/pub?output=csv";

app.get("/", (req, res) => {
    res.json({ mensaje: "API Backend ejecutándose en la nube", estado: "Online" });
});

app.get("/api/productos", async (req, res) => {
    try {
        const response = await axios.get(GOOGLE_SHEETS_CSV_URL);

        // Parseamos el CSV omitiendo columnas vacías y limpiando la estructura
        const rawData = await csv({ noheader: true }).fromString(response.data);

        // La fila 0 contiene los encabezados reales ("ID", "Nombre", "Precio", "Categoría")
        const headers = Object.values(rawData[0]).filter(Boolean);

        // Mapeamos las filas siguientes usando los encabezados reales
        const productos = rawData.slice(1).map((row) => {
            const values = Object.values(row).filter(Boolean);
            const item = {};
            headers.forEach((header, index) => {
                item[header] = values[index] || "";
            });
            return item;
        });

        res.json(productos);
    } catch (error) {
        console.error("Error leyendo Google Sheets:", error);
        res.status(500).json({ error: "Error al obtener datos de Google Sheets" });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor activo en puerto ${PORT}`);
});