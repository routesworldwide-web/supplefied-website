const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const shippingAddressSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    country: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxLength: 300,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    zipCode: {
      type: String,
      required: true,
      trim: true,
      maxLength: 30,
    },
    contactNo: {
      type: String,
      required: true,
      trim: true,
      maxLength: 30,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Provide a valid Email"],
    },
    orderNote: {
      type: String,
      required: false,
      trim: true,
      maxLength: 500,
    },
  },
  {
    timestamps: true,
  }
);

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      minLength: [3, "Name must be at least 3 characters."],
      maxLength: [100, "Name is too large"],
    },
    email: {
      type: String,
      validate: [validator.isEmail, "Provide a valid Email"],
      trim: true,
      lowercase: true,
      unique: true,
      required: [true, "Email address is required"],
    },
    password: {
      type: String,
      required: [false, "Password is required"],
      minLength: [6, "Must be at least 6 character"],
    },
    authProviders: {
      type: [String],
      enum: ["password", "google"],
      default: [],
    },
    googleId: {
      type: String,
      required: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    contactNumber: {
      type: String,
      trim: true,
      maxLength: 30,
      validate: [
        function(v) {
          return !v || validator.isMobilePhone(v, "any");
        },
        "Please provide a valid contact number",
      ],
    },

    shippingAddress: String,
    shippingAddresses: {
      type: [shippingAddressSchema],
      validate: [
        function(v) {
          return !v || v.length <= 3;
        },
        "You can save up to 3 shipping addresses",
      ],
      default: [],
    },

    imageURL: {
      type: String,
      validate: [
        function(v) {
          return !v || validator.isURL(v, { require_protocol: false, require_tld: false });
        },
        "Please provide a valid url"
      ],
    },
    phone: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      default: "inactive",
      enum: ["active", "inactive", "blocked"],
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reviews" }],
    confirmationToken: String,
    confirmationTokenExpires: Date,

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    //  only run if password is modified, otherwise it will change every time we save the user!
    return next();
  }
  if (!this.password) {
    return next();
  }
  const password = this.password;
  const hashedPassword = bcrypt.hashSync(password);
  this.password = hashedPassword;

  next();
});
// comparePassword
userSchema.methods.comparePassword = function (password, hash) {
  if (!password || !hash) {
    return false;
  }

  return bcrypt.compareSync(password, hash);
};
// generateConfirmationToken
userSchema.methods.generateConfirmationToken = function () {
  const token = crypto.randomBytes(32).toString("hex");

  this.confirmationToken = token;

  const date = new Date();

  date.setDate(date.getDate() + 1);
  this.confirmationTokenExpires = date;

  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
