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

// do klucza sesji
app.use(session({ 
    store: new session.MemoryStore(),
    secret: 'secret-key', 
    resave: false, 
    saveUninitialized: true 
}));


// po uruchomieniu pobiera z bazy
// Fetch products from the database
app.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('index.ejs', { products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error fetching products: ' + error.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// CART

app.post('/cart', async (req, res) => {
    const productId = req.body.productId;
    const requestedQuantity = parseInt(req.body.quantity) || 1;

    try {
        // znajdz produkt w db
        const product = await Product.findById(productId);

        if (!product) {
            console.log('Product not found');
            return res.status(404).send('Product not found');
        }

        // sprawdanie czy jest tyle ile chce user
        if (requestedQuantity > product.amount) {
            console.log('Requested quantity exceeds available stock');
            return res.status(400).send('Requested quantity exceeds available stock');
        }

        // pobieranie cart przypisanego do id sesji
        let userCart = req.session.cart || {};
        const sessionId = req.sessionID;
        let currentUserCart = userCart[sessionId];

        console.log('Session ID:', sessionId);

        if (!currentUserCart) {
            currentUserCart = [];
            userCart[sessionId] = currentUserCart;
        }

        // dodawanie w koszyku
        const totalQuantityInCart = currentUserCart.reduce((total, item) => {
            if (item.productId === productId) {
                return total + item.quantity;
            }
            return total;
        }, 0);

        // sprawdzanie czy to w koszyku nie przekracza dostepnego
        if (totalQuantityInCart + requestedQuantity > product.amount) {
            console.log('Adding requested quantity exceeds available stock');
            return res.status(400).send('Adding requested quantity exceeds available stock');
        }

        // tworzenie obiektu w koszyku
        const cartItem = {
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity: requestedQuantity
        };

        
        const existingCartItemIndex = currentUserCart.findIndex(item => item.productId === productId);

        if (existingCartItemIndex !== -1) {
            currentUserCart[existingCartItemIndex].quantity += requestedQuantity;
        } else {
            currentUserCart.push(cartItem);
        }


        req.session.cart = userCart;

        console.log('Product added to cart:', cartItem);
        res.redirect('/');
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).send('Error adding product to cart: ' + error.message);
    }
});


app.post('/cart/remove', (req, res) => {
    const productId = req.body.productId;
    console.log('Product ID to remove:', productId);
    try {
        // pobranie koszyka
        const sessionId = req.sessionID;
        let userCart = req.session.cart || {};
        let currentUserCart = userCart[sessionId] || [];

        console.log('Cart before removal:', currentUserCart);

        // odfiltrowanie
        currentUserCart = currentUserCart.filter(item => item.productId !== productId);

        //update koszyka
        userCart[sessionId] = currentUserCart;
        req.session.cart = userCart;

        console.log('Cart after removal:', currentUserCart);
        res.redirect('/cart');
    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).send('Error removing product from cart: ' + error.message);
    }
});


app.get('/cart', async (req, res) => {
    try {
        const sessionId = req.sessionID;
        const userCart = req.session.cart || {};
        const currentUserCart = userCart[sessionId] || [];

        // Populate the photo field for each item in the cart
        for (const item of currentUserCart) {
            const product = await Product.findById(item.productId);
            if (product) {
                item.photo = product.photo;
            }
        }

        console.log('Cart:', currentUserCart);
        res.render('cart.ejs', { cart: currentUserCart });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).send('Error fetching cart: ' + error.message);
    }
});



// CHECKOUT
app.post('/cart/checkout', async (req, res) => {
    try {
        const sessionId = req.sessionID;
        const cart = req.session.cart || {};
        console.log('Cart:', cart);

        const cartItems = cart[sessionId] || [];

        // Czy licznosc jakis itemow sie nie zmienila
        const insufficientItems = [];
        for (const item of cartItems) {
            const product = await Product.findById(item.productId);

            console.log('in store :', product.amount, 'user request:', item.quantity);

            if (!product || item.quantity > product.amount) {
                insufficientItems.push(item);
            }
        }

        // anuluj checkout
        if (insufficientItems.length > 0) {
            console.log('Insufficient items in cart:', insufficientItems);
            return res.status(400).send('One or more items in your cart are no longer available or have insufficient stock.');
        }

        // jest ok zmieniamy baze
        for (const item of cartItems) {
            const product = await Product.findById(item.productId);
            if (product) {
                product.amount -= item.quantity;
                await product.save();
            }
        }

        delete cart[sessionId]; 
        // usun koszyk
        req.session.cart = cart; 

        res.redirect('/'); 
    } catch (error) {
        console.error('Error checking out:', error);
        res.status(500).send('Error checking out: ' + error.message);
    }
});
