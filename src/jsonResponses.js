const sendJSON = (res, status, object, isHead = false) => {
    const content = JSON.stringify(object);
    res.writeHead(status, {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(content),
    });
    if (!isHead) res.end(content);
    else res.end();
  };
  
  const sendMeta = (res, status) => {
    res.writeHead(status, {
      'Content-Type': 'application/json',
      'Content-Length': 0,
    });
    res.end();
  };
  
  // GET: /api/countries
  const getAllCountries = (req, res, data, query, isHead) => {
    let filtered = [...data];
  
    if (query.limit) {
      const limit = parseInt(query.limit, 10);
      if (!isNaN(limit)) {
        filtered = filtered.slice(0, limit);
      }
    }
  
    sendJSON(res, 200, { countries: filtered }, isHead);
  };
  
  // GET: /api/countries/region?name=Europe
  const getCountriesByRegion = (req, res, data, query, isHead) => {
    if (!query.name) {
      return sendJSON(res, 400, { error: 'Missing region name query parameter.' }, isHead);
    }
  
    const region = query.name.toLowerCase();
    const matches = data.filter(country => country.region.toLowerCase() === region);
  
    sendJSON(res, 200, { countries: matches }, isHead);
  };
  
  // GET: /api/countries/code?code=US
  const getCountryByCode = (req, res, data, query, isHead) => {
    if (!query.code) {
      return sendJSON(res, 400, { error: 'Missing country code query parameter.' }, isHead);
    }
  
    const code = query.code.toUpperCase();
    const match = data.find(country => country.alpha2Code === code || country.alpha3Code === code);
  
    if (!match) return sendJSON(res, 404, { error: 'Country not found.' }, isHead);
  
    sendJSON(res, 200, { country: match }, isHead);
  };
  
  // GET: /api/countries/nationality?term=nigerian
  const getByNationality = (req, res, data, query, isHead) => {
    if (!query.term) {
      return sendJSON(res, 400, { error: 'Missing nationality search term.' }, isHead);
    }
  
    const term = query.term.toLowerCase();
    const matches = data.filter(
      country =>
        country.demonym?.toLowerCase().includes(term) ||
        country.nationality?.toLowerCase().includes(term)
    );
  
    sendJSON(res, 200, { countries: matches }, isHead);
  };
  
  // POST: /api/countries/add
  const addCountry = (req, res, data, body) => {
    if (!body.name || !body.alpha2Code || !body.region) {
      return sendJSON(res, 400, { error: 'Missing required fields: name, alpha2Code, region.' });
    }
  
    const exists = data.find(c => c.alpha2Code === body.alpha2Code || c.name === body.name);
    if (exists) {
      return sendJSON(res, 400, { error: 'Country with same name or code already exists.' });
    }
  
    const newCountry = {
      name: body.name,
      alpha2Code: body.alpha2Code,
      alpha3Code: body.alpha3Code || '',
      region: body.region,
      demonym: body.demonym || '',
      nationality: body.nationality || '',
    };
  
    data.push(newCountry);
    sendJSON(res, 201, { message: 'Country added.', country: newCountry });
  };
  
  // POST: /api/countries/edit
  const editCountry = (req, res, data, body) => {
    if (!body.alpha2Code || !body.name) {
      return sendJSON(res, 400, { error: 'Missing required fields: alpha2Code, name.' });
    }
  
    const index = data.findIndex(c => c.alpha2Code === body.alpha2Code);
    if (index === -1) {
      return sendJSON(res, 404, { error: 'Country not found to edit.' });
    }
  
    data[index] = {
      ...data[index],
      name: body.name,
      region: body.region || data[index].region,
      demonym: body.demonym || data[index].demonym,
      nationality: body.nationality || data[index].nationality,
      alpha3Code: body.alpha3Code || data[index].alpha3Code,
    };
  
    sendJSON(res, 200, { message: 'Country updated.', country: data[index] });
  };
  
  // 404 handler
  const notFound = (req, res, isHead = false) => {
    sendJSON(res, 404, { error: 'Endpoint not found.' }, isHead);
  };
  
  // 400 handler
  const badRequest = (res, message) => {
    sendJSON(res, 400, { error: message });
  };
  
  module.exports = {
    getAllCountries,
    getCountriesByRegion,
    getCountryByCode,
    getByNationality,
    addCountry,
    editCountry,
    notFound,
    badRequest,
  };
  