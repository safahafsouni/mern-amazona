import express from 'express';
import colors from 'colors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seed.route.js';
import productRouter from './routes/product.route.js';
import userRouter from './routes/user.route.js';
import orderRouter from './routes/order.route.js';
import path from 'path';

dotenv.config();

mongoose  
  .connect(process.env.MONGODB_URI) 
  .then(() => {
    console.log('Connected To Mongodb Database'.bgMagenta.white);
  })
  .catch((err) => {
    console.log(`Mongodb Database Error: ${err.message}`.bgRed.white); 
  });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/keys/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});

app.use("/api/seed", seedRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/build")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/frontend/build/index.html"))
);


app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});


const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server at http://localhost:${port} 🔥`.bgBlue.white);
});
