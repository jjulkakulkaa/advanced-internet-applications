const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Product = require('./models/Product');



const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/online-store', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({ 
    store: new session.MemoryStore(),
    secret: 'secret-key', 
    resave: false, 
    saveUninitialized: true 
}));

app.get('/', async (req, res) => {
    const products = await Product.find();
    res.render('index.ejs', { products });
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



// CART ITEMS ADDITION
app.post('/cart', async (req, res) => {
    const productId = req.body.productId;
    const requestedQuantity = req.body.quantity || 1; // Default to 1 if quantity is not provided

    try {
        // Retrieve product information from the database
        const product = await Product.findById(productId);

        if (!product) {
            console.log('Product not found');
            return res.status(404).send('Product not found');
        }

        // Check if requested quantity is available in the shop
        if (requestedQuantity > product.amount) {
            console.log('Requested quantity exceeds available stock');
            return res.status(400).send('Requested quantity exceeds available stock');
        }

        // Create cart item object
        const cartItem = {
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity: requestedQuantity
        };

        // Get the user's cart from the session or create an empty cart if it doesn't exist
        let userCart = req.session.cart || {};

        // Get the cart for the current user based on their session ID
        const sessionId = req.sessionID;
        let currentUserCart = userCart[sessionId];

        console.log('Session ID:', sessionId);

        // If the current user doesn't have a cart yet, create one
        if (!currentUserCart) {
            currentUserCart = [];
            userCart[sessionId] = currentUserCart;
        }

        // Add the cart item to the user's cart
        currentUserCart.push(cartItem);

        // Update the cart in the session
        req.session.cart = userCart;

        console.log('Product added to cart:', cartItem);
        res.redirect('/');
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).send('Error adding product to cart: ' + error.message);
    }
});

app.get('/cart', (req, res) => {
    // Ensure req.session.cart is initialized as an empty array if it doesn't exist
    const sessionId = req.sessionID;
    const userCart = req.session.cart || {};
    const currentUserCart = userCart[sessionId] || [];
    // Log the cart object for debugging
    console.log('Cart:', currentUserCart);
    res.render('cart.ejs', { cart: currentUserCart });
});


app.post('/cart/remove', (req, res) => {
    const productId = req.body.productId;
    console.log('Product ID to remove:', productId);
    try {
        // Get the user's cart from the session
        const sessionId = req.sessionID;
        let userCart = req.session.cart || {};
        let currentUserCart = userCart[sessionId] || [];

        console.log('Cart before removal:', currentUserCart);

        // Filter out the selected product from the user's cart
        currentUserCart = currentUserCart.filter(item => item.productId !== productId);

        // Update the user's cart in the session
        userCart[sessionId] = currentUserCart;
        req.session.cart = userCart;

        console.log('Cart after removal:', currentUserCart);
        res.redirect('/cart');
    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).send('Error removing product from cart: ' + error.message);
    }
});



// CHECKOUT
app.post('/checkout', async (req, res) => {
    try {
        // Get the user's cart from the session
        const cart = req.session.cart || [];

        console.log('Cart:', cart);
        
        // Check if any item's requested quantity exceeds available stock
        const insufficientItems = [];
        for (const item of cart) {

            const product = await Product.findById(item.productId);

            console.log('In store:', product.amount, 'Requested:', item.quantity);

            if (!product || item.quantity > product.amount) {
                insufficientItems.push(item);
            }
        }

        // If any items are insufficient, inform the user and don't proceed with checkout
        if (insufficientItems.length > 0) {
            console.log('Insufficient items in cart:', insufficientItems);
            return res.status(400).send('One or more items in your cart are no longer available or have insufficient stock.');
            
        }

        // If all items are valid, update the shop's available stock and remove items from the user's cart
        for (const item of cart) {
            const product = await Product.findById(item.productId);
            if (product) {
                product.amount -= item.quantity;
                await product.save();
            }
        }

        // Remove items from the user's cart
        req.session.cart = [];

        res.redirect('/'); // Redirect to the main page after successful checkout
    } catch (error) {
        console.error('Error checking out:', error);
        res.status(500).send('Error checking out: ' + error.message);
    }
});
