const db = require("../db");
const PDFDocument = require("pdfkit");

// run SELECT queries as a Promise
function queryAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
  });
}

//  CSV builder
function toCsv(rows, columns) {
  const escape = (val) => {
    if (val === null || val === undefined) return "";
    const s = String(val);
    if (/[",\n]/.test(s)) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const header = columns.join(",");
  const lines = rows.map((row) =>
    columns.map((col) => escape(row[col])).join(",")
  );
  return [header, ...lines].join("\n");
}

/* ---------------------- VOLUNTEER REPORT ---------------------- */

// List of volunteers and their participation history
exports.getVolunteerReport = async (req, res) => {
  const format = (req.query.format || "json").toLowerCase();

  const sql = `
    SELECT
      uc.id            AS userId,
      uc.email         AS email,
      up.fullName      AS fullName,
      up.city          AS city,
      up.state         AS state,
      vh.id            AS assignmentId,
      vh.status        AS status,
      ev.id            AS eventId,
      ev.eventName     AS eventName,
      ev.eventDate     AS eventDate,
      ev.location      AS eventLocation
    FROM UserCredentials uc
    LEFT JOIN UserProfile up
      ON up.userId = uc.id
    LEFT JOIN VolunteerHistory vh
      ON vh.userId = uc.id
    LEFT JOIN EventDetails ev
      ON ev.id = vh.eventId
    ORDER BY uc.id, ev.eventDate
  `;

  try {
    const rows = await queryAll(sql);

    if (format === "csv") {
      const csv = toCsv(rows, [
        "userId",
        "email",
        "fullName",
        "city",
        "state",
        "assignmentId",
        "status",
        "eventId",
        "eventName",
        "eventDate",
        "eventLocation",
      ]);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="volunteer_report.csv"'
      );
      return res.send(csv);
    }

    if (format === "pdf") {
      // PDFkit
      const doc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="volunteer_report.pdf"'
      );
      doc.pipe(res);

      doc.fontSize(18).text("Volunteer Participation Report", {
        align: "center",
      });
      doc.moveDown();

      if (rows.length === 0) {
        doc.fontSize(12).text("No volunteer data available.");
        doc.end();
        return;
      }

      let lastUserId = null;
      rows.forEach((row) => {
        if (row.userId !== lastUserId) {
          doc.moveDown();
          doc.fontSize(14).text(
            `Volunteer: ${row.fullName || "(no profile name)"}`
          );
          doc.fontSize(11).text(`Email: ${row.email || "N/A"}`);
          if (row.city || row.state) {
            doc.text(
              `Location: ${row.city || ""}${
                row.state ? ", " + row.state : ""
              }`
            );
          }
          doc.moveDown(0.3);
          doc.fontSize(12).text("Assignments:");
          lastUserId = row.userId;
        }

        if (row.eventId) {
          doc
            .fontSize(10)
            .text(
              `• ${row.eventName || "Unknown event"} ` +
                `(${row.eventDate || "no date"}) - Status: ${
                  row.status || "N/A"
                }`
            );
        }
      });

      doc.end();
      return; // response is streaming
    }

    // default: JSON
    return res.json({ items: rows });
  } catch (err) {
    console.error("Error generating volunteer report:", err);
    return res.status(500).json({ message: "Failed to generate report" });
  }
};

/* ------------------------ EVENT REPORT ------------------------ */

// Event details and volunteer assignments
exports.getEventReport = async (req, res) => {
  const format = (req.query.format || "json").toLowerCase();

  const sql = `
    SELECT
      ev.id         AS eventId,
      ev.eventName  AS eventName,
      ev.description AS description,
      ev.location   AS location,
      ev.urgency    AS urgency,
      ev.eventDate  AS eventDate,
      vh.id         AS assignmentId,
      vh.status     AS status,
      uc.id         AS userId,
      uc.email      AS email,
      up.fullName   AS fullName
    FROM EventDetails ev
    LEFT JOIN VolunteerHistory vh
      ON vh.eventId = ev.id
    LEFT JOIN UserCredentials uc
      ON uc.id = vh.userId
    LEFT JOIN UserProfile up
      ON up.userId = uc.id
    ORDER BY ev.eventDate, ev.id, uc.id
  `;

  try {
    const rows = await queryAll(sql);

    if (format === "csv") {
      const csv = toCsv(rows, [
        "eventId",
        "eventName",
        "description",
        "location",
        "urgency",
        "eventDate",
        "assignmentId",
        "status",
        "userId",
        "email",
        "fullName",
      ]);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="event_report.csv"'
      );
      return res.send(csv);
    }

    if (format === "pdf") {
      const doc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="event_report.pdf"'
      );
      doc.pipe(res);

      doc.fontSize(18).text("Event & Assignment Report", {
        align: "center",
      });
      doc.moveDown();

      if (rows.length === 0) {
        doc.fontSize(12).text("No event data available.");
        doc.end();
        return;
      }

      let lastEventId = null;
      rows.forEach((row) => {
        if (row.eventId !== lastEventId) {
          doc.moveDown();
          doc
            .fontSize(14)
            .text(`Event: ${row.eventName} (${row.eventDate || "no date"})`);
          doc.fontSize(11).text(`Location: ${row.location}`);
          doc.text(`Urgency: ${row.urgency}`);
          doc.moveDown(0.3);
          doc.fontSize(12).text("Volunteers:");
          lastEventId = row.eventId;
        }

        if (row.userId) {
          doc
            .fontSize(10)
            .text(
              `• ${row.fullName || "Unknown volunteer"} <${row.email || "N/A"}> - Status: ${
                row.status || "N/A"
              }`
            );
        }
      });

      doc.end();
      return;
    }

    // default JSON
    return res.json({ items: rows });
  } catch (err) {
    console.error("Error generating event report:", err);
    return res.status(500).json({ message: "Failed to generate report" });
  }
};
