const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/send', async (req, res) => {
  try {
    const { name, phone } = req.body;

    // TWÓJ WEBHOOK Z ZAPIERA:
    const webhookURL = 'https://hooks.zapier.com/hooks/catch/21031514/2puheog/';

    await axios.post(webhookURL, { name, phone });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to send data to Zapier' });
  }
});

app.get('/', (req, res) => {
  res.send('Proxy server is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
