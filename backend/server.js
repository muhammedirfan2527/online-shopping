const jsonServer = require("json-server");
const multer = require("multer");
const express = require("express");
const { error } = require("console");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Multer storage config (for product images)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    let date = new Date();
    let imageFilename = date.getTime() + "_" + file.originalname;
    req.body.image = imageFilename;
    cb(null, imageFilename);
  },
});
const upload = multer({ storage: storage });

/* ---------- PRODUCT ENDPOINTS ---------- */
server.post("/products", upload.any(), (req, res, next) => {
  let date = new Date();
  req.body.createdAt = date.toISOString();

  if (req.body.price) {
    req.body.price = Number(req.body.price);
  }

  let errors = {};
  if (!req.body.name || req.body.name.length < 2) {
    errors.name = "The name length should be at least 2 characters";
  }
  if (!req.body.brand || req.body.brand.length < 2) {
    errors.brand = "The brand length should be at least 2 characters";
  }
  if (!req.body.category || req.body.category.length < 2) {
    errors.category = "Category required";
  }
  if (req.body.price < 0) {
    errors.price = "Price must be positive";
  }
  // if (!req.body.description || req.body.description.length < 2) {
  //   errors.description = "Description required";
  // }

  if (Object.keys(errors).length > 0) {
    return res.status(400).jsonp(errors);
  }
  next();
});

server.patch("/products/:id", upload.any(), (req, res, next) => {
  if (req.body.price) {
    req.body.price = Number(req.body.price);
  }
  req.body.updatedAt = new Date().toISOString();
  next();
});
// offer

// add offer
// add offer
server.post("/offer", (req, res) => {
  const { name, offer } = req.body;

  if (!name || !offer) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const newOffer = { id: Date.now(), name, offer };

  // ✅ use router.db (lowdb instance from json-server)
  router.db.get("offer").push(newOffer).write();

  res.status(201).json(newOffer);
});

//update offer
// update offer
// server.patch("/offer/:id", (req, res) => {
//   const offerId = Number(req.params.id);
//   const { name, offer } = req.body;

//   if (!name || !offer) {
//     return res.status(400).json({ error: "Missing fields" });
//   }

//   const db = router.db; // lowdb instance
//   const existingOffer = db.get("offer").find({ id: offerId }).value();

//   if (!existingOffer) {
//     return res.status(404).json({ error: "Offer not found" });
//   }

//   const updatedOffer = { ...existingOffer, name, offer };

//   db.get("offer").find({ id: offerId }).assign(updatedOffer).write();

//   res.status(200).json(updatedOffer);
// });




/* ---------- CATEGORY ENDPOINT ---------- */
server.post("/category", (req, res, next) => {
  let { name } = req.body;
  let errors = {};

  if (!name || name.trim().length < 2) {
    errors.name = "Category name must be at least 2 characters";
    return res.status(400).jsonp(errors);
  }

  req.body.createdAt = new Date().toISOString();
  next();
});

//cart 
// ---------------- CART ENDPOINTS ----------------

// ---------------- CART ENDPOINTS ----------------

// Create a new cart or add items
server.post("/cart", (req, res) => {
  const { userEmail, items, total } = req.body;
  if (!userEmail || !items || items.length === 0) {
    return res.status(400).jsonp({ error: "Invalid cart data" });
  }

  const carts = router.db.get("cart").value() || [];
  const existingCart = carts.find(c => c.userEmail === userEmail);

  if (existingCart) {
    return res.status(400).jsonp({ error: "Cart already exists, use PUT to update" });
  }

  const newCart = {
    id: Date.now(),
    userEmail,
    items,
    total,
    createdAt: new Date().toISOString()
  };

  router.db.get("cart").push(newCart).write();
  res.status(201).jsonp(newCart);
});

// Update cart (add/remove items)
server.put("/cart/:id", (req, res) => {
  const cartId = Number(req.params.id);
  const updatedCart = req.body;

  router.db.get("cart")
    .find({ id: cartId })
    .assign(updatedCart)
    .write();

  res.status(200).jsonp(updatedCart);
});

// Get cart for a user
server.get("/cart", (req, res) => {
  const { userEmail } = req.query;
  if (!userEmail) return res.status(400).jsonp({ error: "userEmail required" });

  const carts = router.db.get("cart").value() || [];
  const userCart = carts.filter(c => c.userEmail === userEmail);

  res.jsonp(userCart);
});

// Add this before server.use(router);

// Wishlist endpoint
server.post("/wishlist", (req, res) => {
  const { userEmail, items } = req.body;
  if (!userEmail || !items || !items.length) {
    return res.status(400).jsonp({ error: "userEmail and items are required" });
  }

  const db = router.db; // lowdb instance
  const wishlists = db.get("wishlist").value() || [];

  // Only take the first product from items for toggle
  const product = items[0];
  if (!product?.productId) {
    return res.status(400).jsonp({ error: "Invalid product data" });
  }

  let userWishlist = wishlists.find((w) => w.userEmail === userEmail);

  if (userWishlist) {
    // Toggle product in wishlist
    const exists = userWishlist.items.some((i) => i.productId === product.productId);

    if (exists) {
      userWishlist.items = userWishlist.items.filter((i) => i.productId !== product.productId);
    } else {
      userWishlist.items.push(product);
    }

    db.get("wishlist").find({ userEmail }).assign(userWishlist).write();
  } else {
    // Create new wishlist
    const newWishlist = {
      id: Date.now(),
      userEmail,
      items: [product],
      createdAt: new Date().toISOString(),
    };
    db.get("wishlist").push(newWishlist).write();
  }

  res.status(200).jsonp({ message: "Wishlist updated successfully" });
});

//order
server.post("/order",(req,res) =>{
    const { email, address, items, amount} = req.body
    console.log(email, address, items, amount)
    if( !email || !items || items.length === 0 ) {
      return res.status(400).jsonp({error:"Invalid cart data"})
    }

    const orders = router.db.get("order").value() || [];
    // const existingOrder = orders.find(c=> c.email === email)

    // if(existingOrder) {
    //   return res.status(400).jsonp({error:"order already exits"})
    // }

    const newOrder = {
      id: Date.now(),
      email,
      address,
      items,
      amount,
      Status:"Pending",
      createdAt: new Date().toISOString()
    };

    router.db.get("order").push(newOrder).write();
    res.status(201).jsonp(newOrder);
})

// PATCH /order/:id to update order status
// server.patch("/order/:id", (req, res) => {
//   const orderId = Number(req.params.id);
//   const { Status } = req.body;

//   if (!Status) {
//     return res.status(400).jsonp({ error: "Status is required" });
//   }

//   const db = router.db; // lowdb instance
//   const order = db.get("order").find({ id: orderId }).value();

//   if (!order) {
//     return res.status(404).jsonp({ error: "Order not found" });
//   }

//   // Update status
//   db.get("order").find({ id: orderId }).assign({ Status }).write();

//   const updatedOrder = db.get("order").find({ id: orderId }).value();
//   res.status(200).jsonp(updatedOrder);
// });

/* ---------- AUTH ENDPOINTS ---------- */
// SIGNUP
server.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).jsonp({ error: "All fields are required" });
  }

  const users = router.db.get("users").value() || [];
  const existingUser = users.find((u) => u.email === email);

  if (existingUser) {
    return res.status(400).jsonp({ error: "Email already exists" });
  }

  const newUser = {
    id: Date.now(),
    username,
    email,
    password,
    createdAt: new Date().toISOString(),
  };

  router.db.get("users").push(newUser).write();

  return res.status(201).jsonp({ message: "User registered successfully", user: newUser });
});

// LOGIN
server.post("/login", (req, res) => {
  const { email, password } = req.body;
  const users = router.db.get("users").value() || [];

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).jsonp({ error: "Invalid email or password" });
  }

  res.jsonp({ message: "Login successful", user });
});

/* ---------- DEFAULT ROUTER ---------- */
server.use(router);
server.listen(5000, () => {
  console.log("JSON Server is running on port 5000");
});
