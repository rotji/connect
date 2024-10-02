import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = () => {
    const [email, setEmail] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/pay', { email, amount });
            // Handle the response (e.g., redirect to Paystack for payment)
            console.log('Payment successful', response.data);
        } catch (error) {
            console.error('Error during payment:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Amount (in kobo):</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Pay</button>
        </form>
    );
};

export default PaymentForm;
