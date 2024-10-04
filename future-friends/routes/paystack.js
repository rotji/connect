const express = require('express');
const router = express.Router();
const axios = require('axios');

// Initialize a Paystack transaction
router.post('/pay', async (req, res) => {
  const { email, amount } = req.body;

  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: amount * 100, // Convert amount to kobo
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Return Paystack response to the frontend (including the authorization URL)
    res.status(200).json({
      message: 'Payment initialized successfully',
      authorization_url: response.data.data.authorization_url,
      reference: response.data.data.reference,
    });
  } catch (error) {
    console.error('Error during payment initialization:', error);
    res.status(500).json({ error: 'Payment initialization failed' });
  }
});

// Verify a Paystack transaction
router.get('/verify/:reference', async (req, res) => {
  const { reference } = req.params;

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    // Return the verification result from Paystack
    res.status(200).json({
      message: 'Transaction verified successfully',
      data: response.data.data,
    });
  } catch (error) {
    console.error('Error during payment verification:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// Handle Paystack webhook events
router.post('/webhook', (req, res) => {
  const event = req.body;

  // Add logic based on event type (e.g., charge.success)
  if (event.event === 'charge.success') {
    // Process the event, e.g., update the user's payment status in your database
    console.log('Payment was successful:', event.data);
  }

  // Respond to Paystack that the webhook was received successfully
  res.status(200).send('Webhook received successfully');
});

module.exports = router;
