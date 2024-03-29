import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// @desc	Auth user & get token
// @route	POST /api/users/login
// @access	public

const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (user && (await user.matchPassword(password))) {
		res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id)
		});
	} else {
		res.status(401);
		throw new Error('Invalid email or password');
	}
});

// @desc	Get user profile
// @route	GET /api/users/profile
// @access	Private

const getUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);
	// const user = req.user;
	if (user) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

// @desc	Update profile
// @route	PUT /api/users/profile
// @access	Private

const updateUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findByIdAndUpdate(req.user._id);
	// const user = req.user;
	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;
		if (req.body.password) {
			user.password = req.body.password;
		}
		const updatedUser = await user.save();
		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
			token: generateToken(updatedUser._id)
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

// @desc	Register New User
// @route	POST /api/users
// @access	Public

const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;
	const existUser = await User.findOne({ email });
	if (existUser) {
		res.status(400);
		throw new Error('User already exists');
	}
	const user = await User.create({
		name,
		email,
		password
	});
	if (user) {
		res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id)
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

// @desc	Get Admin
// @route	GET /api/users
// @access	Private/Admin

const getUsers = asyncHandler(async (req, res) => {
	const user = await User.find({});
	res.json(user);
});

// @desc	Delte user
// @route	DELETE /api/users/:id
// @access	Private/Admin

const deleteUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);
	if (user) {
		await user.remove();
		res.json({ message: 'user remove' });
	} else {
		res.status(404);
		throw new Error('User Not Found');
	}
});

// @desc	Get user
// @route	GET /api/users/:id
// @access	Private/Admin

const getUserById = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id).select('-password');
	if (user) {
		res.json(user);
	} else {
		res.status(404);
		throw new Error('User Not Found');
	}
});

// @desc	Update User
// @route	PUT /api/users/:id
// @access	Private/Admin

const updateUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);
	// const user = req.user;
	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;
		user.isAdmin = req.body.isAdmin;
		const updatedUser = await user.save();
		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});
export { authUser, getUserProfile, registerUser, updateUserProfile, getUsers, deleteUser, updateUser, getUserById };
