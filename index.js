const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Add this
const app = express();

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Default XAMPP MySQL password
  database: 'pbl',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ✅ LOGIN
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ success: false, message: "Email and password are required" });
  }

  try {
    const [results] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [username]
    );

    if (results.length === 0) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      enrollment_number: user.enrollment_number
    };

    return res.json({
      success: true,
      user: safeUser
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.json({ success: false, message: "An error occurred" });
  }
});

// ✅ SIGNUP
app.post('/signup', async (req, res) => {
  // Accept either username or email in the request
  const { username, email, password, enrollment_number } = req.body;
  
  // Use whichever is provided (username or email)
  const userEmail = email || username;

  if (!userEmail || !password || !enrollment_number) {
    return res.json({ success: false, message: "All fields are required" });
  }

  try {
    const [emailResults] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [userEmail]
    );

    if (emailResults.length > 0) {
      return res.json({ success: false, message: "Email is already registered" });
    }

    const [enrollmentResults] = await pool.query(
      "SELECT * FROM users WHERE enrollment_number = ?",
      [enrollment_number]
    );

    if (enrollmentResults.length > 0) {
      return res.json({ success: false, message: "Enrollment number is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const name = userEmail.split('@')[0];

    const [result] = await pool.query(
      "INSERT INTO users (email, name, password_hash, enrollment_number) VALUES (?, ?, ?, ?)",
      [userEmail, name, hashedPassword, enrollment_number]
    );

    console.log("User created successfully:", result);
    return res.json({ success: true, message: "Account created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    return res.json({ success: false, message: "Server error" });
  }
});

// ✅ REGISTER FOR EVENT
app.post('/register', async (req, res) => {
  try {
    const { user_id, event_id } = req.body;
    
    console.log("Registration request received:", req.body);

    if (!user_id || !event_id) {
      console.log("Missing required data:", { user_id, event_id });
      return res.status(400).json({ 
        success: false, 
        message: `Missing required data: ${!user_id ? 'User ID' : ''} ${!user_id && !event_id ? 'and' : ''} ${!event_id ? 'Event ID' : ''}` 
      });
    }

    // Check if already registered
    const [exists] = await pool.query(
      "SELECT * FROM registrations WHERE user_id = ? AND event_id = ?",
      [user_id, event_id]
    );

    if (exists.length > 0) {
      console.log("Already registered:", { user_id, event_id });
      return res.status(200).json({ 
        success: false, 
        message: "You're already registered for this event!" 
      });
    }

    // Perform registration
    console.log("Inserting registration:", { user_id, event_id });
    const [result] = await pool.query(
      "INSERT INTO registrations (user_id, event_id, registration_date) VALUES (?, ?, NOW())",
      [user_id, event_id]
    );
    
    console.log("Registration successful:", result);
    res.status(200).json({ 
      success: true, 
      message: "Registration successful" 
    });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: err.message
    });
  }
});

// ✅ FETCH EVENTS
app.get('/events', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT events.*, clubs.name AS club, clubs.logo_url AS clubLogo
      FROM events
      LEFT JOIN clubs ON events.club_id = clubs.id
      ORDER BY events.date ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching events", details: err.message });
  }
});

// Check if this route is working properly
app.get('/user-events/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Add some logging
    console.log(`Fetching events for user ID: ${userId}`);
    
    const [rows] = await pool.query(`
      SELECT events.*, clubs.name AS club, registrations.registration_date
      FROM registrations
      JOIN events ON registrations.event_id = events.id
      LEFT JOIN clubs ON events.club_id = clubs.id
      WHERE registrations.user_id = ?
      ORDER BY events.date ASC
    `, [userId]);
    
    console.log(`Found ${rows.length} registered events`);
    
    res.json(rows);
  } catch (err) {
    console.error("Error fetching user events:", err);
    res.status(500).json({ error: "Failed to fetch user events" });
  }
});

// ✅ FETCH CLUBS
app.get('/clubs', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM clubs");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching clubs:", error);
    res.status(500).json({ error: "Failed to fetch clubs" });
  }
});

// Improved search endpoint with better error handling and logging
app.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    console.log(`Processing search request for: "${query}"`);
    
    if (!query || query.trim() === '') {
      console.log("Empty search query received, returning empty results");
      return res.json({
        events: [],
        clubs: []
      });
    }
    
    const searchTerm = `%${query.trim()}%`;
    
    // Search events with improved query - fixed the JOIN syntax
    const [events] = await pool.query(`
      SELECT events.*, clubs.name AS club, clubs.logo_url AS clubLogo
      FROM events
      LEFT JOIN clubs ON events.club_id = clubs.id
      WHERE events.title LIKE ? 
      OR events.description LIKE ? 
      OR events.venue LIKE ?
      OR clubs.name LIKE ?
      ORDER BY events.date ASC
    `, [searchTerm, searchTerm, searchTerm, searchTerm]);
    
    // Search clubs
    const [clubs] = await pool.query(`
      SELECT * FROM clubs
      WHERE name LIKE ?
      OR description LIKE ?
      ORDER BY name ASC
    `, [searchTerm, searchTerm]);
    
    console.log(`Search results: ${events.length} events, ${clubs.length} clubs`);
    console.log("Events found:", events);
    console.log("Clubs found:", clubs);
    
    // Make sure the response has the correct structure
    const response = {
      events: events || [],
      clubs: clubs || []
    };
    
    res.json(response);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ 
      error: "Error performing search", 
      details: err.message,
      success: false,
      events: [],
      clubs: []
    });
  }
});

// ✅ START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on http://localhost:${PORT}`));
