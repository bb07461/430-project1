// api.js
const express = require('express');
const router = express.Router();
const countries = require('./data');

// GET /api/countries?name=Chile
router.get('/countries', (req, res) => {
  const name = req.query.name?.toLowerCase();
  if (name) {
    const result = countries.filter(c => c.name.toLowerCase().includes(name));
    res.json(result);
  } else {
    res.json(countries);
  }
});

// GET /api/countries/:code
router.get('/countries/:code', (req, res) => {
  const code = req.params.code.toUpperCase();
  const country = countries.find(c => c.code?.toUpperCase() === code);
  if (country) {
    res.json(country);
  } else {
    res.status(404).json({ error: "Country not found" });
  }
});

// POST /api/countries
router.post('/countries', express.json(), (req, res) => {
  const { name, code } = req.body;
  if (!name || !code) {
    return res.status(400).json({ error: 'Name and code are required' });
  }
  const exists = countries.find(c => c.code?.toUpperCase() === code.toUpperCase());
  if (exists) {
    return res.status(409).json({ error: 'Country already exists' });
  }
  const newCountry = { name, code };
  countries.push(newCountry); // Note: This is in-memory; won't persist on restart
  res.status(201).json(newCountry);
});

module.exports = router;
