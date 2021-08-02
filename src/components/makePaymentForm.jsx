import { CardElement, CardNumberElement, CardExpiryElement, CardCvcElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { Button } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';

export default function MakePaymentForm(props){

    const stripe = useStripe();
    const elements = useElements();
    const [values, setValues] = useState({});

    const handleSubmit = async (event) => {
        event.preventDefaults();
        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);
        const result = await stripe.createToken(card);

        if (result.error) {
            console.log(result.error.message);
          } 
        else {
            stripeTokenHandler(result.token);
        }
    };

    const handleChange = (event) => {
        event.persist();
        setValues(values => ({...values, [event.target.name]: event.target.value}));
    };

    async function stripeTokenHandler(token) {
        const paymentData = {token: token.id};
        const response = await fetch('/charge', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(paymentData),
        });

        return response.json();
    }

    return(
        <form onSubmit={handleSubmit}>
            <CardElement />
            <div className='mt-4 d-flex justify-content-center'>
                <Button type="submit" disabled={!stripe}>Submit</Button>
            </div>
        </form>
    )
}