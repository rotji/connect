// setting up paystack client
const Paystack = require('paystack-node');
const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);
