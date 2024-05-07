
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
app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: true }));

app.get('/', async (req, res) => {
    const products = await Product.find();
    res.render('index.ejs', { products });
});

app.get('/cart', (req, res) => {
    // Render the cart.ejs template and pass the cart data from the session
    res.render('cart.ejs', { cart: req.session.cart });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



app.post('/cart', async (req, res) => {
    const productId = req.body.productId;

    try {
        // Retrieve product information from the database
        console.log("Product ID:", productId); // Check if productId is correctly passed

        // Ensure productId is a valid ObjectId format before querying the database
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).send('Invalid product ID');
        }

        const product = await Product.findById(productId);

        if (!product) {
            console.log('Product not found');
            return res.status(404).send('Product not found');
        }

        console.log('Product found:', product); // Log the found product for debugging

        // Create cart item object
        const cartItem = {
            productId: product._id,
            name: product.name,
            price: product.price,
            // Add more properties as needed (e.g., quantity)
        };

        // Get the user's cart from the session or create an empty cart if it doesn't exist
        let cart = req.session.cart || [];
        
        // Add the cart item to the user's cart
        cart.push(cartItem);

        // Update the cart in the session
        req.session.cart = cart;

        // Redirect back to the main page or wherever appropriate
        res.redirect('/');
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).send('Error adding product to cart: ' + error.message); // Send the error message for debugging
    }
});
