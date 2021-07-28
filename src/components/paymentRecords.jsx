import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function PaymentRecords(props){

    const [payments, setPayments] = useState(null);
    const [user, setUser] = useState(props.user);
    const [relationships, setRelationships] = useState(null);

    useEffect(() => {
        getPayments();
        if(user.role === 'Student'){
            getMyRelationships();
        }
    }, []);

    async function getMyRelationships(){
        try{
            let response = await axios.get(`https://localhost:44394/api/relationships/get_my`, { headers: {Authorization: "Bearer " + props.user.token}});
            console.log(response.data);
            setRelationships(response.data);
        }
        catch(err){
            alert('Error getting teacher info.\n' + err)
        }
    }

    async function getPayments(){
        try{
            let response = await axios.get('https://localhost:44394/api/payments/all', { headers: {Authorization: "Bearer " + props.user.token}});
            let records = response.data;
            records.sort(function(a,b){return a.dateTime.localeCompare(b.dateTime)});
            setPayments(records.reverse());
        }
        catch(err){
            alert(err);
        }
    }

    function getTimeFromDateObject(d){
        let h = d.getHours();
        let m = d.getMinutes();
        if (m == 0){
            m ='00'
        }
        else if (0 < m && m < 10){
            m = '0'+`${m}`;
        }
        let amPm = 'AM';
        if (h > 12){
            h = h - 12;
            amPm = 'PM';
        }
        return (`${h}:${m} ${amPm}`)
    }

    function getDateFromDateObject(d){
        let day = d.getDate();
        let year = d.getFullYear();
        let month = d.getMonth()+1;
        return (`${month}/${day}/${year}`)
    }

    async function deletePayment(payment){
        let confirm = window.confirm("Are you sure? This will not affect the student's current balance.");
        if (confirm){
            deleteRecord(payment);
        }
    }

    async function deleteRecord(payment){
        try{
            let response = await axios.delete(`https://localhost:44394/api/payments/delete/${payment.paymentId}`, { headers: {Authorization: "Bearer " + user.token}});
        }
        catch(err){
            alert(err);
        }
    }

    async function chargeStudent(payment){
        let body = {
            studentId: payment.student.id,
            balance: payment.amount
        }
        try{
            let response = await axios.put('https://localhost:44394/api/relationships/update_balance', body, { headers: {Authorization: "Bearer " + user.token}});
        }
        catch(err){
            alert(err);
        }
    }

    async function deletePayment(payment){
        let confirm = window.confirm("Are you sure? This will only remove your record of this payment. It will not affect the student's current balance.");
        if (confirm){
            await deleteRecord(payment);
            getPayments();
        }
    }

    async function deleteAndCharge(payment){
        let confirm = window.confirm("Are you sure? This will remove the record of this payment AND add the payment amount back to the student's outstanding balance!");
        if (confirm){
            await chargeStudent(payment);
            await deleteRecord(payment);
            getPayments();
        }
    }

    function generatePaymentTable(){
        if (user.role === 'Teacher'){
            let paymentData = payments.map(payment => {
                return (
                <tr>
                    <td>{payment.student.firstName} {payment.student.lastName}</td>
                    <td>{getDateFromDateObject(new Date(payment.dateTime))}</td>
                    <td>{getTimeFromDateObject(new Date(payment.dateTime))}</td>
                    <td>{payment.methodName}</td>
                    <td>${payment.amount}</td>
                    <td>
                        <Button variant='warning' onClick={() => deletePayment(payment)}>Remove Record</Button>
                    </td>
                    <td>
                        <Button variant='danger' onClick={() => deleteAndCharge(payment)}>DELETE AND RE-CHARGE</Button>
                    </td>
                </tr>
                )
            })
    
            return(
                <div>
                    <Table>
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Method</th>
                                <th>Amount</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentData}
                        </tbody>
                    </Table>
                </div>
            )
        }
        else{
            let paymentData = payments.map(payment => {
                return (
                <tr key={payment.paymentId}>
                    <td>{payment.teacher.firstName} {payment.teacher.lastName}</td>
                    <td>{getDateFromDateObject(new Date(payment.dateTime))}</td>
                    <td>{getTimeFromDateObject(new Date(payment.dateTime))}</td>
                    <td>{payment.methodName}</td>
                    <td>${payment.amount}</td>
                </tr>
                )
            })
            return(
                <div className='row'>
                    <div className='col' />
                    <div className='col col-sm-8'>
                        <h4>Payment Records</h4>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Teacher</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Method</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentData}
                            </tbody>
                        </Table>
                    </div>
                    <div className='col' />
                </div>
            )
        }

    }

    function generateBalanceTable(){
        let balanceData = relationships.map( r => {
            return(
                <tr>
                    <td>{r.teacher.firstName} {r.teacher.lastName}</td>
                    <td>${r.balance}</td>
                </tr>
            )
        })
        return(
            <div className='row'>
                <div className='col' />
                <div className='col-12 col-sm-6'>
                    <h4>Balance Info</h4>
                    <Table>
                        <thead>
                            <tr>
                                <th>Teacher</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {balanceData}
                        </tbody>
                    </Table>
                </div>
                <div className='col' />
            </div>
        )   
    }

    return(
        <React.Fragment>
            <div className='text-center row'>
                {/* <div className='col' /> */}
                <div className='col'>
                    <h1>Payment records - {user.username}</h1>
                    {user.role==='Teacher' && <Button as={Link} to='payment' variant='success' >Add Payment</Button>}
                    {user.role ==='Student' && relationships && generateBalanceTable()}
                    {payments ? 
                        <React.Fragment>
                        {payments.length > 0 ?
                            generatePaymentTable()
                        :
                            <p>No payments to display.</p>
                        }
                        </React.Fragment>
                    :
                    <React.Fragment>
                        <p>Loading...</p>
                    </React.Fragment>
                    }
                </div>
                {/* <div className='col' /> */}
            </div>
        </React.Fragment>
    )
}