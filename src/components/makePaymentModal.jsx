import React, { useState, useEffect } from 'react';
import { CardElement, CardNumberElement, CardExpiryElement, CardCvcElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import useForm from '../helpers/useForm';
import { Modal, Form, Button } from 'react-bootstrap';
import MakePaymentForm from './makePaymentForm';

const stripePromise = loadStripe('pk_test_51JJ27ZDNsgRFFMO8Zef74FpSKjn1osb464WMkp7XrFaLr0HlbprrTtmsXd1Pv05msCdMrAXduO7MqqPR2OlrnWVI00YtLIQDb2');

export default function MakePaymentModal(props){

    const [show, setShow] = useState(false);

    const handleOpen = () => {setShow(true)};
    const handleClose = () => {setShow(false)};


    return(
        <React.Fragment>

            <Button variant='success' onClick={handleOpen}>Make A Payment</Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Make Payment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Elements stripe={stripePromise}>
                        <MakePaymentForm user={props.user} handleClose={handleClose}/>
                    </Elements>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>

        </React.Fragment>
    )
}