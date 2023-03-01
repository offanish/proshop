import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import {
  createProductThunk,
  deleteProductThunk,
  listProductsThunk,
  productReset,
} from '../features/product/productListSlice'

const ProductListPage = () => {
  const { pageNumber = 1 } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { loading, error, products, createdProduct, page, pages } = useSelector(
    (state) => state.productList
  )
  const { userInfo } = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(productReset())
    if (!userInfo.isAdmin) {
      navigate('/login')
    }
    if (createdProduct) {
      navigate(`/admin/product/${createdProduct._id}/edit`)
    } else {
      dispatch(listProductsThunk({ pageNumber }))
    }
  }, [
    navigate,
    userInfo,
    dispatch,
    products.length,
    createdProduct,
    pageNumber,
  ])

  const createProductHandler = () => {
    dispatch(createProductThunk())
  }

  const deleteHandler = (id) => {
    dispatch(deleteProductThunk(id))
  }

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className='text-right'>
          <Button
            variant='dark'
            className='my-3'
            onClick={createProductHandler}
          >
            <i className='fas fas-plus'></i> Create Product
          </Button>
        </Col>
      </Row>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant='light' className='btn-sm'>
                        <i className='fas fa-edit'></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(product._id)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} isAdmin={true} />
        </>
      )}
    </>
  )
}

export default ProductListPage
