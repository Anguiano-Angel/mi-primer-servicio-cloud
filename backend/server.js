const express = require("express");
const cors = require("cors");
const axios = require("axios");
const csv = require("csvtojson");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const GOOGLE_SHEETS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTAEitsnT8EYA3BjWT5dlSErNwuObdrKbuXAob0UyxBMDYAE6D3SUk9P-7YnXTmcVyquAP3guJRW2Xx/pub?output=csv";

app.get("/", (req, res) => {
    res.json({ mensaje: "API Backend ejecutándose en la nube", estado: "Online" });
});

app.get("/api/productos", async (req, res) => {
    try {
        const response = await axios.get(GOOGLE_SHEETS_CSV_URL);

        // Convertimos el CSV mapeando explícitamente los campos esperados
        const jsonArray = await csv().fromString(response.data);

        // Limpiamos los objetos para asegurarnos de que tengan llaves en minúsculas estandarizadas
        const productosLimpios = jsonArray.map((item, index) => {
            // Extraemos valores buscando cualquier coincidencia de nombre de columna
            const id = item.ID || item.id || item.field2 || index + 1;
            const nombre = item.Nombre || item.nombre || item.field3 || "Sin nombre";
            const precio = item.Precio || item.precio || item.field4 || "0";
            const categoria = item.Categoría || item.Categoria || item.categoria || item.field5 || "General";

            return { id, nombre, precio, categoria };
        }).filter(p => p.nombre !== "Nombre"); // Filtramos la fila de encabezados si se coló

        res.json(productosLimpios);
    } catch (error) {
        console.error("Error leyendo Google Sheets:", error);
        res.status(500).json({ error: "Error al obtener datos de Google Sheets" });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor activo en puerto ${PORT}`);
});