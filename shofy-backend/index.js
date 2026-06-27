require("dotenv").config();
const express = require("express");
const app = express();
const path = require('path');
const cors = require("cors");
const connectDB = require("./config/db");
const { secret } = require("./config/secret");
const PORT = secret.port || 7000;
const morgan = require('morgan')
// error handler
const globalErrorHandler = require("./middleware/global-error-handler");
// routes
const userRoutes = require("./routes/user.routes");
const categoryRoutes = require("./routes/category.routes");
const brandRoutes = require("./routes/brand.routes");
const userOrderRoutes = require("./routes/user.order.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const couponRoutes = require("./routes/coupon.routes");
const reviewRoutes = require("./routes/review.routes");
const adminRoutes = require("./routes/admin.routes");
const cartRoutes = require("./routes/cart.routes");
const productListRoutes = require("./routes/product-list.routes");
const bannerRoutes = require("./routes/banner.routes");
const blogRoutes = require("./routes/blog.routes");
const newsletterRoutes = require("./routes/newsletter.routes");
const notificationRoutes = require("./routes/notification.routes");
const contactRoutes = require("./routes/contact.routes");
const authRoutes = require("./routes/auth.routes");
// const uploadRouter = require('./routes/uploadFile.route');
const cloudinaryRoutes = require("./routes/cloudinary.routes");

const defaultAllowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://supplefied.com",
  "https://www.supplefied.com",
];
const allowedOrigins = (secret.allowed_origins || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const trustedOrigins = new Set(
  allowedOrigins.length ? allowedOrigins : defaultAllowedOrigins
);

// middleware
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || trustedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      const error = new Error("Origin is not allowed by CORS");
      error.statusCode = 403;
      callback(error);
    },
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-guest-cart-id"],
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan(secret.env === "production" ? "combined" : "dev"));
app.use(express.static(path.join(__dirname, 'public')));

// connect database
connectDB();

app.use("/api/user", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/product", productRoutes);
// app.use('/api/upload',uploadRouter);
app.use("/api/order", orderRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/user-order", userOrderRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/cloudinary", cloudinaryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/product-list", productListRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);

// root route
app.get("/", (req, res) => res.send("Apps worked successfully"));
app.get("/health", (req, res) =>
  res.status(200).json({ status: "ok", service: "supplefied-api" })
);

//* handle not found
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
});

// global error handler
app.use(globalErrorHandler);

app.listen(PORT);

module.exports = app;
