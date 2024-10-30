const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const User = require('./models/User');
const path = require('path'); 
const feedbackRoutes = require('./routes/feedbackRoutes');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes'); 
const productRoutes = require('./routes/productRoutes');

dotenv.config();
const app = express();

app.use('/images', express.static(path.join(__dirname, 'images')));



app.use(cors()); // Allow React frontend to connect
app.use(express.json()); // Parse JSON data
app.use('/api/auth', authRoutes);  // Use the auth routes
app.use('/api/feedback', feedbackRoutes);
app.use('/api', profileRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/products', productRoutes);



const MONGODB_URI = process.env.MONGODB_URI;


// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));


// Route to fetch user details by userId
app.get('/api/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        // Find user by userId in MongoDB
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with the user details
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error });
    }
});

// Signup route
app.post('/api/auth/signup', async (req, res) => {
    const { firstName, lastName, email, password, course } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({ firstName, lastName, email, password, course });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// Default route to test the server
app.get('/', (req, res) => {
    res.send('Backend is running!');
});



// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
