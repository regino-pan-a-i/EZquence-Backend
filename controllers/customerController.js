/***********************************
 * Require Statements
 ************************************/

const customerController = {};

customerController.createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });

    return res.status(200).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
      },
    });
  } catch (error) {
    console.error('Internal Error:', error);
    // Handle other errors (e.g., network issues, parsing errors)
    return res.status(500).json({
      success: false,
      error: `Internal Server Error: ${error}`,
    });
  }
};
module.exports = customerController;
