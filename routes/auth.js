import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const router =express.Router();
 
// Register
import pkg from "lodash";
const { lodash: _ } = pkg;

router.post("/register", async (req, res) => {
	try {
		// Generate new password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);
		// create new user
		const newUser = new User({
			username: req.body.username,
			email: req.body.email,
			password: hashedPassword,
		});
		// save user and return response
		const user = await newUser.save();
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Login

router.post("/login", async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		!user && res.status(404).send("User not found");

		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		!validPassword && res.status(400).send("Wrong password please try again");

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
});

export default router;
