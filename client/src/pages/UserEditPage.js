import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'

import {
  getUserDetailsThunk,
  updateUserThunk,
} from '../features/user/userSlice'

const UserEditPage = () => {
  const { id: userId } = useParams()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  const dispatch = useDispatch()
  const { loading, error, userDetails } = useSelector((state) => state.user)

  useEffect(() => {
    if (!userDetails || !userDetails.name || userDetails._id !== userId) {
      dispatch(getUserDetailsThunk(userId))
    } else {
      setName(userDetails.name)
      setEmail(userDetails.email)
      setIsAdmin(userDetails.isAdmin)
    }
  }, [dispatch, userId, userDetails])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(updateUserThunk({ _id: userId, name, email, isAdmin }))
  }

  return (
    <>
      <Link to='/admin/userlist' className='btn btn-light my-3'>
        {' '}
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit User </h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group className='my-3' controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='my-3' controlId='email'>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='my-3' controlId='isadmin'>
              <Form.Check
                type='checkbox'
                label='Is Admin'
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>
            <Button className='my-3' type='submit' variant='primary'>
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default UserEditPage
