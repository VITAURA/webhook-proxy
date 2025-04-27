const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const TARGET_URL = 'https://hooks.zapier.com/hooks/catch/21031514/2puheog/';
const RECAPTCHA_SECRET_KEY = '6LcihSYrAAAAAAQ4JtF-xZjw7nGbHO1-QXaQBxRa'; // Twój klucz prywatny reCAPTCHA

app.post('/', async (req, res) => {
  console.log('✅ Otrzymano dane:', req.body);

  const { token, ...leadData } = req.body;

  if (!token) {
    console.error('❌ Brak tokenu reCAPTCHA');
    return res.status(400).json({ success: false, error: 'Brak tokenu reCAPTCHA' });
  }

  try {
    // Weryfikacja tokenu reCAPTCHA
    const captchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
    const captchaResponse = await axios.post(captchaVerifyUrl, null, {
      params: {
        secret: RECAPTCHA_SECRET_KEY,
        response: token
      }
    });

    const captchaData = captchaResponse.data;

    if (!captchaData.success || captchaData.score < 0.5) {
      console.error('❌ Błąd reCAPTCHA:', captchaData);
      return res.status(400).json({ success: false, error: 'Błąd weryfikacji reCAPTCHA' });
    }

    // Jeśli captcha OK -> wysyłamy lead do Zapiera
    const response = await axios.post(TARGET_URL, leadData);
    console.log('✅ Wysłano do Zapiera:', response.data);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Błąd:', error.message);
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
