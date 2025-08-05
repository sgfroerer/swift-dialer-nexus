require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { neon } = require("@neondatabase/serverless");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const sql = neon(process.env.DATABASE_URL);

async function createTables() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS call_lists (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        company TEXT,
        notes TEXT,
        propertyType TEXT,
        lastCalled TIMESTAMP,
        callCount INTEGER DEFAULT 0,
        disposition TEXT,
        status TEXT,
        tags TEXT[],
        call_list_id INTEGER REFERENCES call_lists(id)
      );
    `;
    console.log("Tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
}

app.get("/", (req, res) => {
  res.send("Server is running");
});

// Get all call lists
app.get("/api/call-lists", async (req, res) => {
  try {
    const callLists = await sql`SELECT * FROM call_lists`;
    res.json(callLists);
  } catch (error) {
    console.error("Error fetching call lists:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new call list
app.post("/api/call-lists", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  try {
    const newCallList = await sql`
      INSERT INTO call_lists (name)
      VALUES (${name})
      RETURNING *
    `;
    res.status(201).json(newCallList[0]);
  } catch (error) {
    console.error("Error creating call list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all contacts or filter by call_list_id
app.get("/api/contacts", async (req, res) => {
  const { call_list_id } = req.query;
  try {
    let contacts;
    if (call_list_id) {
      contacts = await sql`SELECT * FROM contacts WHERE call_list_id = ${call_list_id}`;
    } else {
      contacts = await sql`SELECT * FROM contacts`;
    }
    res.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new contact
app.post("/api/contacts", async (req, res) => {
  const { name, phone, email, company, notes, propertyType, call_list_id } = req.body;
  if (!name || !phone || !call_list_id) {
    return res.status(400).json({ error: "Name, phone, and call_list_id are required" });
  }
  try {
    const newContact = await sql`
      INSERT INTO contacts (name, phone, email, company, notes, propertyType, call_list_id)
      VALUES (${name}, ${phone}, ${email}, ${company}, ${notes}, ${propertyType}, ${call_list_id})
      RETURNING *
    `;
    res.status(201).json(newContact[0]);
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a contact
app.put("/api/contacts/:id", async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, company, notes, propertyType, status, disposition, callCount, lastCalled } = req.body;
  try {
    const updatedContact = await sql`
      UPDATE contacts
      SET
        name = ${name},
        phone = ${phone},
        email = ${email},
        company = ${company},
        notes = ${notes},
        propertyType = ${propertyType},
        status = ${status},
        disposition = ${disposition},
        callCount = ${callCount},
        lastCalled = ${lastCalled}
      WHERE id = ${id}
      RETURNING *
    `;
    if (updatedContact.length === 0) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.json(updatedContact[0]);
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a contact
app.delete("/api/contacts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedContact = await sql`
      DELETE FROM contacts
      WHERE id = ${id}
      RETURNING *
    `;
    if (deletedContact.length === 0) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, async () => {
  await createTables();
  console.log(`Server running on port ${port}`);
});
