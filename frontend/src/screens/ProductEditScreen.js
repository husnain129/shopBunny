import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { listProductDetails, updateProduct } from '../actions/productActions';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';
const ProductEditScreen = ({ history, match }) => {
	const productId = match.params.id;
	const [name, setName] = useState('');
	const [price, setPrice] = useState('');
	const [image, setImage] = useState('');
	const [brand, setBrand] = useState('');
	const [category, setCategory] = useState('');
	const [countInStock, setCountInStock] = useState(0);
	const [description, setDescription] = useState('');
	const [uploading, setUploading] = useState(false);
	const dispatch = useDispatch();

	const productDetails = useSelector((state) => state.productDetails);
	const { error, product, loading } = productDetails;

	const productUpdate = useSelector((state) => state.productUpdate);
	const { error: errorUpdate, success: successUpdate, loading: loadingUpdate } = productUpdate;

	useEffect(() => {
		if (successUpdate) {
			dispatch({ type: PRODUCT_UPDATE_RESET });
			history.push('/admin/productlist');
		} else {
			if (!product.name || product._id !== productId) {
				dispatch(listProductDetails(productId));
			} else {
				setName(product.name);
				setPrice(product.price);
				setImage(product.image);
				setBrand(product.brand);
				setCategory(product.category);
				setCountInStock(product.countInStock);
				setDescription(product.description);
			}
		}
	}, [dispatch, history, successUpdate, product._id]);

	const uploadFileHadler = async (e) => {
		const file = e.target.files[0];
		const formData = new FormData();
		formData.append('image', file);
		setUploading(true);
		try {
			const config = {
				headers: {
					'Content-type': 'multipart/form-data'
				}
			};
			const { data } = await axios.post('/api/upload', formData, config);
			setImage(data);
			setUploading(false);
		} catch (error) {
			console.error(error);
			setUploading(false);
		}
	};

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(
			updateProduct({
				_id: productId,
				name,
				price,
				image,
				brand,
				category,
				countInStock,
				description
			})
		);
	};
	return (
		<>
			<Link to="/admin/productlist" className="btn btn-light my-3">
				Go Back
			</Link>
			<FormContainer>
				<h1>Edit Product</h1>
				{loadingUpdate && <Loader />}
				{errorUpdate && <Message varient="danger">{errorUpdate}</Message>}
				{loading ? (
					<Loader />
				) : error ? (
					<Message variant="danger">{error}</Message>
				) : (
					<Form onSubmit={submitHandler}>
						<Form.Group controlId="text">
							<Form.Label>Name</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter Name"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</Form.Group>

						{/* --------Price---------- */}

						<Form.Group controlId="price">
							<Form.Label>Price</Form.Label>
							<Form.Control
								type="number"
								placeholder="Enter Price"
								value={price}
								onChange={(e) => setPrice(e.target.value)}
							/>
						</Form.Group>

						{/* ------image------ */}

						<Form.Group controlId="image">
							<Form.Label>Image</Form.Label>
							<Form.Control type="text" value={image} onChange={(e) => setImage(e.target.checked)} />
							<Form.File id="image-file" label="Choose file" custom onChange={uploadFileHadler}>
								{uploading && <Loader />}
							</Form.File>
						</Form.Group>

						{/* ------brand------ */}

						<Form.Group controlId="brand">
							<Form.Label>Brand</Form.Label>
							<Form.Control type="text" value={brand} onChange={(e) => setBrand(e.target.value)} />
						</Form.Group>

						{/* ------CountInStock------ */}

						<Form.Group controlId="countInStock">
							<Form.Label>Count In Stock</Form.Label>
							<Form.Control
								type="number"
								placeholder="Enter Count In Stock"
								value={countInStock}
								onChange={(e) => setCountInStock(e.target.value)}
							/>
						</Form.Group>

						{/* ------Category------ */}

						<Form.Group controlId="category">
							<Form.Label>Category</Form.Label>
							<Form.Control
								type="text"
								value={category}
								onChange={(e) => setCategory(e.target.category)}
							/>
						</Form.Group>

						{/* ------Description------ */}

						<Form.Group controlId="description">
							<Form.Label>Description</Form.Label>
							<Form.Control
								type="text"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</Form.Group>
						<Button type="submit" variant="primary">
							Update
						</Button>
					</Form>
				)}
			</FormContainer>
		</>
	);
};

export default ProductEditScreen;
