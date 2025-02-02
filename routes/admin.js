const express = require("express");
const router = express.Router();
const conn = require("../db");
const multer = require("multer");
const path = require("path");

// fetch all users
router.get("/user", (request, response) => {
  const statement = `SELECT * FROM user`;
  conn.execute(statement, (err, rows) => {
    if (err) response.send(err.message);
    else if (rows.length === 0) response.send("no users found");
    else response.json({ status: "success", data: rows });
  });
});

// fetch user by id
router.get("/user/:id", (request, response) => {
  const { id } = request.params;
  const statement = `SELECT * FROM user WHERE id =?`;

  conn.execute(statement, [id], (err, rows) => {
    if (err) response.send(err.message);
    else if (rows.length === 0) response.send("no user found");
    else response.json({ status: "success", data: rows[0] });
  });
});

// fetch all Products
router.get("/products", (request, response) => {
  const statement = `SELECT * FROM Product`;
  conn.execute(statement, (err, rows) => {
    if (err) response.send(err.message);
    else if (rows.length === 0) response.send("no Products found");
    else response.json({ status: "success", data: rows });
  });
});

//Delete by id
router.delete("/products/:id", (request, response) => {
  let { id } = request.params;
  
  // Ensure id is an integer
  id = parseInt(id, 10);
  
  if (isNaN(id)) {
    return response.status(400).json({
      status: "error",
      message: "Invalid product ID"
    });
  }

  const statement = `DELETE FROM product WHERE product_id = ?`;
  
  conn.execute(statement, [id], (err, result) => {
    if (err) {
      console.error("Execution error: ", err); // Log the entire error object
      return response.status(500).send(err.message);
    }
    console.log("Execution result: ", result); // Log the result for debugging
    
    if (result.affectedRows === 0) {
      return response.status(404).json({
        status: "error",
        message: "Product not found"
      });
    }
    response.json({
      status: "success",
      message: "Product deleted",
    });
  });
});







// PUT endpoint to update a product by ID
// router.put("/products/:id", upload.single("image"), (request, response) => {
//   const { id } = request.params;
//   const { name, description, price, stock, created_at } = request.body;
//   const image = request.file ? request.file.filename : null;

//   let statement = `UPDATE product SET name = ?, description = ?, price = ?, stock = ?, created_at = ?`;
//   const params = [name, description, price, stock, created_at];
  
//   // If an image is provided, update the image as well
//   if (image) {
//     statement += `, images = ? WHERE id = ?`;
//     params.push(image, id);
//   } else {
//     statement += ` WHERE id = ?`;
//     params.push(id);
//   }

//   conn.execute(statement, params, (err, result) => {
//     if (err) {
//       console.error("Execution error: ", err); 
//       return response.status(500).send(err.message);
//     }
//     console.log("Execution result: ", result); 
//     if (result.affectedRows === 0) {
//       return response.status(404).json({
//         status: "error",
//         message: "Product not found"
//       });
//     }
//     response.json({
//       status: "success",
//       message: "Product updated",
//     });
//   });
// });

// module.exports = router;



// get Products by id
router.get("/products/:id", (request, response) => {
  const { id } = request.params;
  const statement = `SELECT * FROM Product WHERE id =?`;

  conn.execute(statement, [id], (err, rows) => {
    if (err) response.send(err.message);
    else if (rows.length === 0) response.send("no Products found");
    else response.json({ status: "success", data: rows[0] });
  });
});





const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// add mobile
router.post("/products", upload.single("image"), (request, response) => {
  const { name, description, price, stock, created_at } = request.body;
  const image = request.file ? request.file.filename : null;

  const statement = `INSERT INTO product 
    (name, description, price, stock, created_at, images) 
    VALUES (?,?,?,?,?,?)`;

  conn.execute(
    statement,
    [name, description, price, stock, created_at, image],
    (err, result) => {
      if (err) {
        console.error("Execution error: ", err); // Log the entire error object
        return response.status(500).send(err.message);
      }
      console.log("Execution result: ", result); // Log the result for debugging
      response.json({
        status: "success",
        message: "Product added",
      });
    }
  );
});



module.exports = router;