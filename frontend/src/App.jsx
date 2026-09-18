import { useEffect, useState } from "react";

function App() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("https://mi-primer-servicio-cloud-bhn7.onrender.com/api/productos")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en el servidor");
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setProductos(data);
        } else {
          setProductos([]);
        }
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error al obtener productos:", error);
        setError(true);
        setCargando(false);
      });
  }, []);

  return (
    <div style={styles.container}>
      {/* Encabezado */}
      <header style={styles.header}>
        <div style={styles.badgeCloud}>☁️ Cloud Powered</div>
        <h1 style={styles.title}>Mi Primer Servicio Cloud</h1>
        <p style={styles.subtitle}>
          Catálogo dinámico consumiendo datos de <strong>Google Sheets</strong> a través de una API en <strong>Node.js (Render)</strong>.
        </p>
      </header>

      {/* Estados de Carga y Error */}
      {cargando && (
        <div style={styles.statusBox}>
          <div style={styles.spinner}></div>
          <p>Cargando catálogo en tiempo real...</p>
        </div>
      )}

      {error && (
        <div style={styles.errorBox}>
          <p>⚠️ No fue posible conectar con el servicio.</p>
        </div>
      )}

      {/* Cuadrícula de Productos */}
      {!cargando && !error && (
        <main style={styles.grid}>
          {productos.map((producto, index) => (
            <div key={producto.id || index} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.categoryBadge}>{producto.categoria}</span>
                <span style={styles.idBadge}>#{producto.id || index + 1}</span>
              </div>

              <h3 style={styles.productName}>{producto.nombre}</h3>

              <div style={styles.cardFooter}>
                <span style={styles.priceLabel}>Precio</span>
                <span style={styles.priceValue}>${producto.precio}</span>
              </div>
            </div>
          ))}
        </main>
      )}
    </div>
  );
}

// Estilos en línea para un acabado limpio y moderno
const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0f172a",
    color: "#f8fafc",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    padding: "40px 20px",
    boxSizing: "border-box",
  },
  header: {
    textAlign: "center",
    maxWidth: "800px",
    margin: "0 auto 40px auto",
  },
  badgeCloud: {
    display: "inline-block",
    backgroundColor: "rgba(56, 189, 248, 0.1)",
    color: "#38bdf8",
    padding: "6px 16px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
    border: "1px solid rgba(56, 189, 248, 0.3)",
    marginBottom: "16px",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "800",
    margin: "0 0 12px 0",
    background: "linear-gradient(90deg, #38bdf8 0%, #818cf8 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#94a3b8",
    lineHeight: "1.6",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: "16px",
    padding: "24px",
    border: "1px solid #334155",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "transform 0.2s ease, border-color 0.2s ease",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  categoryBadge: {
    backgroundColor: "#334155",
    color: "#cbd5e1",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  idBadge: {
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "bold",
  },
  productName: {
    fontSize: "1.4rem",
    fontWeight: "700",
    margin: "0 0 20px 0",
    color: "#f1f5f9",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    borderTop: "1px solid #334155",
    paddingTop: "16px",
  },
  priceLabel: {
    color: "#94a3b8",
    fontSize: "14px",
  },
  priceValue: {
    fontSize: "1.5rem",
    fontWeight: "800",
    color: "#34d399",
  },
  statusBox: {
    textAlign: "center",
    padding: "40px",
    color: "#94a3b8",
  },
  errorBox: {
    textAlign: "center",
    padding: "20px",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    border: "1px solid #ef4444",
    borderRadius: "12px",
    color: "#fca5a5",
    maxWidth: "500px",
    margin: "0 auto",
  },
};

export default App;