import { useEffect } from 'react'
import { Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import Message from '../components/Message'
import Loader from '../components/Loader'

import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from '../features/order/orderSlice'

const OrderPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { orderDetails, orderLoading, error, paymentSuccess, deliverSuccess } =
    useSelector((state) => state.order)
  const { userInfo } = useSelector((state) => state.user)
  let itemsPrice
  if (orderDetails?._id) {
    itemsPrice = orderDetails.orderItems.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    )
  }

  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
    }
    dispatch(getOrderDetails(id))
  }, [dispatch, id, paymentSuccess, deliverSuccess, navigate, userInfo])

  const successPaymentHandler = () => {
    const paymentResult = {
      id: '123456',
      status: 'COMPLETED',
      update_time: Date.now(),
      email_address: 'paypalEmail@gmail.com',
    }
    dispatch(payOrder({ orderId: orderDetails._id, paymentResult }))
  }

  const deliverHandler = () => {
    dispatch(deliverOrder(orderDetails._id))
  }

  return orderLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <h1>Order {orderDetails._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name:</strong> {orderDetails.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${orderDetails.user.email}`}>
                  {orderDetails.user.email}
                </a>
              </p>
              {orderDetails.isDelivered ? (
                <Message variant='success'>
                  Delivered On {orderDetails.deliveredAt}
                </Message>
              ) : (
                <Message variant='danger'>Not Delivered</Message>
              )}
              <p>
                <strong>Address: </strong>
                {orderDetails.shippingAddress.address},{' '}
                {orderDetails.shippingAddress.city}{' '}
                {orderDetails.shippingAddress.postalCode},{' '}
                {orderDetails.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method: </h2>
              <p>
                <strong>Method: </strong>
                {orderDetails.paymentMethod}
              </p>
              {orderDetails.isPaid ? (
                <Message variant='success'>
                  Paid On {orderDetails.paidAt}
                </Message>
              ) : (
                <Message variant='danger'>Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {orderDetails.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {orderDetails.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link
                            className='text-decoration-none text-dark'
                            to={`/product/${item.product}`}
                          >
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price}= ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${orderDetails.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${orderDetails.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${orderDetails.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className='d-grid gap-2'>
                {!orderDetails.isPaid && (
                  <Button onClick={successPaymentHandler} variant='dark'>
                    PayPal
                  </Button>
                )}{' '}
              </ListGroup.Item>
              {userInfo &&
                userInfo.isAdmin &&
                orderDetails.isPaid &&
                !orderDetails.isDelivered && (
                  <ListGroup.Item className='d-grid gap-2'>
                    <Button
                      type='button'
                      variant='dark'
                      className='btn btn-block'
                      onClick={deliverHandler}
                    >
                      Mark as delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrderPage
