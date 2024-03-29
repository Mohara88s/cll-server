const { Schema, model } = require("mongoose");
const Joi = require("joi");
const bcrypt = require("bcryptjs");

const emailRegex =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const userSchema = Schema(
	{
		name: {
			type: String,
			required: [true, "Name is required"],
			minlength: 3,
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minlength: 8,
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			match: emailRegex,
		},
		subscription: {
			type: String,
			enum: ["starter", "pro", "business"],
			default: "starter",
		},
		token: {
			type: String,
			default: null,
		},
		avatarURL: {
			type: String,
			required: true,
		},
		verification: {
			type: Boolean,
			default: false,
		},
		verificationToken: {
			type: String,
			required: [true, "Verify token is required"],
		},
		passwordResetToken: {
			type: String,
			default: null,
		},
		ownDictionaries: [
			{ type: Schema.Types.ObjectId, 
			ref: "OwnDictionary", 
      },
		],
	},
	{ versionKey: false, timestamps: true }
);

userSchema.methods.setPassword = function (password) {
	this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

userSchema.methods.comparePassword = function (password) {
	return bcrypt.compareSync(password, this.password);
};

const User = model("User", userSchema);

const joiSchema = Joi.object({
	name: Joi.string().required().min(3),
	password: Joi.string().required().min(8),
	email: Joi.string()
		.required()
		.email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
	subscription: Joi.string(),
	token: Joi.string(),
});

const signinJoiSchema = Joi.object({
	password: Joi.string().required().min(8),
	email: Joi.string()
		.required()
		.email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
	subscription: Joi.string(),
	token: Joi.string(),
});
module.exports = {
	User,
	joiSchema,
	signinJoiSchema,
};
