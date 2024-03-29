import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import Product from '../components/Product';
import ProductCarousal from '../components/ProductCarousal';

const HomeScreen = ({ match }) => {
	const keyword = match.params.keyword;
	const pageNumber = match.params.pageNumber || 1;
	const dispatch = useDispatch();
	const productList = useSelector((state) => state.productList);
	const { loading, error, products, page, pages } = productList;
	useEffect(() => {
		dispatch(listProducts(keyword, pageNumber));
	}, [dispatch, pageNumber]);

	return (
		<>
			{!keyword && <ProductCarousal />}
			<h1>Latest Products</h1>
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant="danger">{error}</Message>
			) : (
				<>
					<Row>
						{products.map((product) => (
							<Col sm={12} lg={4} xl={3} key={product._id}>
								<Product product={product} />
							</Col>
						))}
					</Row>
					<Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} />
				</>
			)}
		</>
	);
};

export default HomeScreen;
