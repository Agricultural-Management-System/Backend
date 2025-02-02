
const express = require("express");
const router = express.Router();
const conn = require("../db");

// register user
router.post("/register", (request, response) => {
  const {username, email, password, mobile, address, role, created_at } = request.body;

  const statement = `INSERT INTO user
  (username, email, password, mobile, address, role, created_at) VALUES(?,?,?,?,?,?,?)`;

  conn.execute(statement, [username, email, password, mobile, address, role, created_at], (err, result) => {
    if (err) response.send(err.message);
    else response.send("registered successfully...");
  });
});

// login user
const jwt = require('jsonwebtoken'); // Import the JWT package
const secretKey = 'mmmmmmmmmmmmmmmmmmmmmmmmmmm'; // Replace with a secure secret key

router.post("/login", (request, response) => {
  const { email, password } = request.body;

  const statement = `SELECT
      user_id, username, email, password, mobile, address, role, created_at
      FROM users
      WHERE email =? AND password =?`;

  conn.execute(statement, [email, password], (err, users) => {
    if (err) {
      response.status(500).send(err.message);
    } else {
      if (users.length === 0) {
        response.status(404).send("No user found");
      } else {
        const { user_id, username, email, password, role} = users[0];

        // Create a payload for the token
        const payload = { user_id, username, email, password,  role };
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Generate JWT with expiration time

        response.json({
          status: "success",
          data: {
            username,
            email,
            password,
            mobile,
            role,
            token, // Include the generated token in the response
          },
        });
      }
    }
  });
});


// fetch all products
router.get("/product", (request, response) => {
  const statement = `SELECT * FROM Product`;
  conn.execute(statement, (err, rows) => {
    if (err) response.send(err.message);
    else if (rows.length === 0) response.send("no Product found");
    else response.json({ status: "success", data: rows });
  });
});


// fetch product by id
router.get("/product/:product_id", (request, response) => {
  const { product_id } = request.params; // Correctly destructuring product_id from request.params
  const statement = `SELECT * FROM Product WHERE product_id = ?`;

  conn.execute(statement, [product_id], (err, rows) => {
    if (err) {
      response.status(500).json({ error: err.message });
    } else if (rows.length === 0) {
      response.status(404).json({ message: "No product found" });
    } else {
      response.status(200).json({ status: "success", data: rows[0] });
    }
  });
});

//fetch all cart 

router.get("/cart", (request, response) => {
  const statement = `SELECT * FROM Cart`;
  conn.execute(statement, (err, rows) => {
    if (err) response.send(err.message);
    else if (rows.length === 0) response.send("no Cart found");
    else response.json({ status: "success", data: rows });
  });
});





// place Product order
router.post("/place-order", (request, response) => {
  const { userId, productId } = request.body;

  // Log the request body for debugging
  console.log("Request Body:", request.body);

  // Check if userId and productId are provided
  if (!userId || !productId) {
    return response.status(400).json({ error: "Missing userId or productId" });
  }

  const statement = `
    INSERT INTO Cart (user_id, product_id)
    VALUES (?, ?)
  `;

  conn.execute(statement, [userId, productId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return response.status(500).json({ error: "Internal server error" });
    }

    response.json({
      status: "success",
      message: "Order placed successfully",
    });
  });
});

//place Product orderdetails
// place Order details
router.post("/place-orderdetails", (request, response) => {
  const { userId, total_amount, order_status, created_at } = request.body;

  // Log the request body for debugging
  console.log("Request Body:", request.body);

  // Validate request body
  if (!userId || !total_amount || !order_status || !created_at) {
    return response.status(400).json({ error: "Missing required fields" });
  }

  const statement = `
    INSERT INTO OrderTable (user_id, total_amount, order_status, created_at)
    VALUES (?, ?, ?, ?)
  `;

  conn.execute(statement, [userId, total_amount, order_status, created_at], (err, result) => {
    if (err) {
      console.error("Database error:", err); // Log the error for debugging
      return response.status(500).json({ error: "Internal server error" });
    }

    response.json({
      status: "success",
      message: "Order placed successfully",
    });
  });
});


//fetch all orderdetails

router.get("/place-orderdetails", (request, response) => {
  const statement = `SELECT * FROM OrderTable`;
  conn.execute(statement, (err, rows) => {
    if (err) response.send(err.message);
    else if (rows.length === 0) response.send("no Cart found");
    else response.json({ status: "success", data: rows });
  });
});


//Place order Items

router.post("/place-orderitems", (request, response) => {
  const { orderId, productId, quantity, price } = request.body;

  // Log the request body for debugging
  console.log("Request Body:", request.body);

  // Validate request body
  if (!orderId || !productId || !quantity || !price) {
    return response.status(400).json({ error: "Missing required fields" });
  }

  const statement = `
    INSERT INTO orderitems (order_id , product_id , quantity, price )
    VALUES (?, ?, ?, ?)
  `;

  conn.execute(statement, [orderId, productId, quantity, price], (err, result) => {
    if (err) {
      console.error("Database error:", err); // Log the error for debugging
      return response.status(500).json({ error: "Internal server error" });
    }

    response.json({
      status: "success",
      message: "OrderItems placed successfully",
    });
  });
});

//fetch all order Items
router.get("/place-orderitems", (request, response) => {
  const statement = `SELECT * FROM  orderitems`;
  conn.execute(statement, (err, rows) => {
    if (err) response.send(err.message);
    else if (rows.length === 0) response.send("no  orderitems found");
    else response.json({ status: "success", data: rows });
  });
});


// fetch all Yojna
router.get("/yojna", (request, response) => {
  const statement = `SELECT * FROM Yojna`;
  conn.execute(statement, (err, rows) => {
    if (err) response.send(err.message);
    else if (rows.length === 0) response.send("no Yojna found");
    else response.json({ status: "success", data: rows });
  });
});
// fetch Yojna by id
router.get("/yojna/:id", (request, response) => {
  const { id } = request.params; // Destructure id from request.params
  const statement = `SELECT * FROM Yojna WHERE id = ?`;

  console.log("Yojna ID:", id); // Log the id for debugging

  conn.execute(statement, [id], (err, rows) => {
    if (err) {
      console.error("Database error:", err); // Log the error for debugging
      return response.status(500).json({ error: "Internal server error" });
    }
    if (rows.length === 0) {
      return response.status(404).json({ message: "No Yojna found" });
    }
    response.status(200).json({ status: "success", data: rows[0] });
  });
});



module.exports = router;