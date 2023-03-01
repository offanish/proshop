import { useState } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import FormContainer from '../components/FormContainer'

import { savePaymentMethodThunk } from '../features/cart/cartSlice'
import CheckoutSteps from '../components/CheckoutSteps'

const PaymentPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { shippingAddress } = useSelector((state) => state.cart)
  if (!shippingAddress) {
    navigate('/shipping')
  }

  const [paymentMethod, setPaymentMethod] = useState('PayPal')

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(savePaymentMethodThunk(paymentMethod))
    navigate('/placeOrder')
  }
  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as='legend'>Select Method</Form.Label>
          <Col>
            <Form.Check
              type='radio'
              label='PayPal or Credit Card'
              id='PayPal'
              value='PayPal'
              name='paymentMethod'
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>
        <Button className='my-3' type='submit' variant='dark'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  )
}

export default PaymentPage
