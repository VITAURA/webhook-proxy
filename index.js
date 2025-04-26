const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const TARGET_URL = 'https://hooks.zapier.com/hooks/catch/21031514/2puheog/';

app.post('/', async (req, res) => {
  console.log('✅ Otrzymano dane:', req.body); // <<<<<< WAŻNE: logowanie danych

  try {
    const response = await axios.post(TARGET_URL, req.body);
    console.log('✅ Wysłano do Zapiera:', response.data);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Błąd przy wysyłce do Zapiera:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// dodatkowy GET, opcjonalny
app.get('/', (req, res) => {
  res.send('Webhook proxy działa ✅');
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Serwer działa na porcie ${PORT}`);
});
