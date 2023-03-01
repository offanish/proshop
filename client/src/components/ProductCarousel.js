import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from './Loader'
import Message from './Message'
import { listTopProductsThunk } from '../features/product/productListSlice'

const ProductCarousel = () => {
  const dispatch = useDispatch()
  const { topProducts, loading, error } = useSelector(
    (state) => state.productList
  )
  useEffect(() => {
    dispatch(listTopProductsThunk())
  }, [dispatch])

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <h1>Top Products</h1>
      <Carousel pause='hover' className='bg-dark'>
        {topProducts.map((product) => (
          <Carousel.Item key={product._id}>
            <Link to={`/product/${product._id}`}>
              <Image src={product.image} alt={product.name} fluid />
              <Carousel.Caption className='carousel-caption'>
                <h2>{product.name}</h2>
              </Carousel.Caption>
            </Link>
          </Carousel.Item>
        ))}
      </Carousel>
    </>
  )
}

export default ProductCarousel
