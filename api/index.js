const dotenv = require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(
    "mongodb+srv://jagritigautam:jagriti@cluster0.q0s4a6f.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

app.listen(port, () => {
  console.log("Server is running on port 8000");
});

const User = require("./models/user");
const Order = require("./models/order");

const sendVerificationEmail = async (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USERNAME,
      pass: process.env.PASS,
    },
  });

  // to compose the email message

  const mailOptions = {
    from: "amazon.com",
    to: email,
    subject: "Email Verification",
    text: `Please click the following link to verify your email: http://10.12.40.254:8000/verify/${verificationToken}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error sending verification email", error);
  }
};

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("Received data:", req.body);

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newUser = new User({ name, email, password });
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    await newUser.save();

    sendVerificationEmail(newUser.email, newUser.verificationToken);
    res.status(200).json({ message: "Registration successful" });
  } catch (error) {
    console.log("Error registering user", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).json({ message: "Invalid verification token" });
    }

    user.verified = true;
    user.verificationToken = undefined;

    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log("Error verifying email", error);
    res.status(500).json({ message: "Email verification failed" });
  }
});

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");
  return secretKey;
};

const secretKey = generateSecretKey();

// endpoint  to login the error

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // check if password is right or wrong

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    // generate a token

    const token = jwt.sign({ userId: user._id }, secretKey);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login Failed" });
  }
});

// endpoint to store new address to the backend

app.post("/addresses", async (req, res) => {
  try {
    const { userId, address } = req.body;

    // find the user by the user id
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // add the new address to the user's addresses array
    user.addresses.push(address);

    // save the updated user in the backend
    await user.save();

    res.status(200).json({ message: "Address created Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding address" });
  }
});

// endpoint to get all the addresses of the particular user

app.get("/addresses/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const addresses = user.addresses;
    res.status(200).json({ addresses });
  } catch (err) {
    res.status(500).json({ message: "Error retrieveing the addresses" });
  }
});

// endpoint to store all the orders

app.post("/orders", async (req, res) => {
  try {
    const { userId, cartItems, totalPrice, shippingAddresses, paymentMethod } =
      req.body;

    if (!userId || !cartItems || !totalPrice || !paymentMethod) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if shippingAddresses exists

    // Validate shippingAddresses fields

    const products = cartItems.map((item) => ({
      name: item?.title,
      quantity: item.quantity,
      price: item.price,
      image: item?.image,
    }));

    const order = new Order({
      user: userId,
      products: products,
      totalPrice: totalPrice,
      shippingAddresses: shippingAddresses, // Note: This matches your schema now
      paymentMethod: paymentMethod,
    });

    await order.save();

    res.status(200).json({ message: "Order created successfully", order });
  } catch (error) {
    console.log("Error creating orders", error);
    res
      .status(500)
      .json({ message: "Error creating orders", error: error.message });
  }
});

// get the user profile

app.get("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving the user profile" });
  }
});

// to get order for that particular user to show in profile screen

app.get("/orders/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const orders = await Order.find({ user: userId }).populate("user");

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
});

// // Importing

// const express = require("express");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
// const crypto = require("crypto");
// const nodemailer = require("nodemailer");

// // create instance for app

// const app = express();
// const port = 8000;
// const cors = require("cors");
// app.use(cors());

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// const jwt = require("jsonwebtoken");

// // mongodb+srv://jagritigautam:<password>@cluster0.q0s4a6f.mongodb.net/

// mongoose
//   .connect(
//     "mongodb+srv://jagritigautam:jagriti@cluster0.q0s4a6f.mongodb.net/",
//     {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     }
//   )
//   .then(() => {
//     console.log("Connected to Mongodb");
//   })
//   .catch((err) => {
//     console.log("Error connecting to Mongo Db");
//   });

// app.listen(port, () => {
//   console.log("Server is running on port 8000");
// });

// const User = require("./models/user");
// const Order = require("./models/order");

// // function to send verification email to the user
// const sendVerificationEmail = async (email,verificationToken) => {
//   // create a nodemailer transport

//   const transporter = nodemailer.createTransport({
//     // configure emial services
//     service: "gmail",
//     auth: {
//       // emil through which we are sending it to the registered user

//       user:"jagriti7920@gmail.com",
//       pass: "qytl lxbm dsoe amtm",
//     },
//   });

//   // compose email message

//   const mailOptions = {
//     from:"amazon.com",
//     to: email,
//     subject: "Email Verification",
//     text:`Please click the following link in order to verify your email::://localhost:8000/verify/${verificationToken}`
//   };

//   // send the email

//   try {
//     await transporter.sendMail(mailOptions);
//   } catch (error) {
//     console.log("Error sending verification email", error);
//   }
// };

// // endpoints to register in the app
// app.post("/register",async (req,res) => {
//   try {
//     const { name, email, password } = req.body;

//     // check if email is already registered
//     const existingUser = await User.findOne({email});
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     // create a new USer

//     const newUser = new User({ name, email, password });

//     // generate and store the verification token
//     newUser.verificationToken = crypto.randomBytes(20).toString("hex");

//     //save teh user to the database
//     await newUser.save();

//     // send the verification wmil to the particular user
//     sendVerificationEmail(newUser.email, newUser.verificationToken);
//   } catch (error) {
//     console.log("error registering user", error);
//     res.status(500).json({ message: "Registration failed" });
//   }
// });

// // endpoint to verify the email

// app.get("/verify/:token",async(req,res)=>{
//   try{
//     const token=req.params.token;

//     // Find the user with the given verification token

//     const user=await User.findOne({verificationToken:token});
//     if(!user){
//       return res.status(404).json({message:"Invalid verification token"})
//     }

//     // if token matched mark the user ass verified
//     user.verified=true;
//     user.verificationToken=undefined;

//     await user.save();

//     res.status(200).json({message:"Email verified successfully "})

//   } catch(error){
//     res.status(500).json({message:"Email Verification Failed"});
//   }
// })
