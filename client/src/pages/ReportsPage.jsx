import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";

const API_BASE = "http://localhost:5000/api/reports";

function ReportsPage() {
  const { token, user } = useAuth();
  const [reportType, setReportType] = useState("volunteers"); // 'volunteers' | 'events'
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);

  async function fetchReportJson() {
    setLoading(true);
    setError(null);

    try {
        if (!token) {
        throw new Error("unauthorized");
        }

        const endpoint =
            reportType === "volunteers" ? "/volunteers" : "/events";

        const res = await fetch(`${API_BASE}${endpoint}?format=json`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,   // ⬅️ send JWT
          },
        });

        if (res.status === 401) {
          throw new Error("unauthorized");
        }
        if (!res.ok) {
          throw new Error(`Server responded with ${res.status}`);
        }

        const data = await res.json();
        const tableRows = Array.isArray(data)
          ? data
          : data.items || data.rows || [];

        setRows(tableRows);
      } catch (err) {
        console.error(err);
        if (err.message === "unauthorized") {
          setError("You must be signed in to view reports.");
        } else {
          setError("Failed to load report data.");
        }
      } finally {
        setLoading(false);
      }
  }

  async function downloadCsv() {
    setError(null);

    try {
        if (!token) {
          throw new Error("unauthorized");
        }

        const endpoint =
          reportType === "volunteers" ? "/volunteers" : "/events";

        const res = await fetch(`${API_BASE}${endpoint}?format=csv`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,   // ⬅️ send JWT
          },
        });

        if (res.status === 401) {
          throw new Error("unauthorized");
        }
        if (!res.ok) {
          throw new Error(`Server responded with ${res.status}`);
        }

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        const filename =
          reportType === "volunteers"
            ? "volunteer_report.csv"
            : "event_report.csv";

        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error(err);
        if (err.message === "unauthorized") {
          setError("You must be signed in to download reports.");
        } else {
          setError("Failed to download CSV.");
        }
    }
  }

  async function downloadPdf() {
    setError(null);

    try {
      if (!token) {
        throw new Error("unauthorized");
      }

      const endpoint =
        reportType === "volunteers" ? "/volunteers" : "/events";

      const res = await fetch(`${API_BASE}${endpoint}?format=pdf`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        throw new Error("unauthorized");
      }
      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      const filename =
        reportType === "volunteers"
          ? "volunteer_report.pdf"
          : "event_report.pdf";

      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      if (err.message === "unauthorized") {
        setError("You must be signed in to download reports.");
      } else {
        setError("Failed to download PDF.");
      }
    }
  }

  // derive simple columns from first row
  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

  return (
    <div style={{ padding: "1.5rem" }}>
      <h2>Admin Reports</h2>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <label>
          <span style={{ marginRight: "0.5rem" }}>Report type:</span>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="volunteers">Volunteers & History</option>
            <option value="events">Events & Assignments</option>
          </select>
        </label>

        <button onClick={fetchReportJson} disabled={loading}>
          {loading ? "Loading..." : "View as Table"}
        </button>

        <button onClick={downloadCsv}>Download CSV</button>

        <button onClick={downloadPdf}>Download PDF</button>
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
      )}

      {rows.length === 0 && !loading && !error && (
        <p>No data loaded yet. Click “View as Table”.</p>
      )}

      {rows.length > 0 && (
        <div style={{ overflowX: "auto", maxHeight: "60vh" }}>
          <table
            style={{
              borderCollapse: "collapse",
              minWidth: "600px",
              width: "100%",
            }}
          >
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col}
                    style={{
                      border: "1px solid #ccc",
                      padding: "0.5rem",
                      background: "#f5f5f5",
                      textAlign: "left",
                      color: "black"
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx}>
                  {columns.map((col) => (
                    <td
                      key={col}
                      style={{ border: "1px solid #eee", padding: "0.5rem", color: "black" }}
                    >
                      {Array.isArray(row[col])
                        ? row[col].join(", ")
                        : row[col] != null
                        ? String(row[col])
                        : ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ReportsPage;
