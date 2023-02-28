import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'

const SearchBox = () => {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const submitHandler = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      navigate(`/search/${keyword}`)
      return
    }
    navigate('/')
  }
  return (
    <Form onSubmit={submitHandler} className='d-flex'>
      <Form.Control
        type='text'
        name='q'
        onChange={(e) => setKeyword(e.target.value)}
        className='me-sm-2 ms-sm-5'
      ></Form.Control>
      <Button type='submit' variant='outline-success' className='p-2'>
        Search
      </Button>
    </Form>
  )
}

export default SearchBox
