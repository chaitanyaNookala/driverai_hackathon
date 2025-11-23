const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ============================================
// SIGNUP - Store user in Firebase Firestore
// ============================================
router.post('/signup', async (req, res) => {
    try {
        const db = req.db;

        const {
            email,
            password,
            age,
            address,
            height,
            weight,
            allergies,
            healthIssues,
            dietaryPreferences
        } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Check if user exists
        const userSnapshot = await db.collection('users').where('email', '==', email).get();
        if (!userSnapshot.empty) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user document
        const userRef = db.collection('users').doc();
        const userId = userRef.id;

        const userData = {
            id: userId,
            email,
            password: hashedPassword,
            age: age || null,
            address: address || {},
            height: height || null,
            weight: weight || null,
            allergies: allergies || [],
            healthIssues: healthIssues || [],
            dietaryPreferences: dietaryPreferences || [],
            createdAt: new Date().toISOString()
        };

        await userRef.set(userData);

        // Create JWT token
        const token = jwt.sign(
            { id: userId, email: email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Return user data (without password)
        const { password: _, ...userWithoutPassword } = userData;

        res.json({
            success: true,
            token,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// LOGIN - Fetch user from Firebase Firestore
// ============================================
router.post('/login', async (req, res) => {
    try {
        const db = req.db;
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user in Firestore
        const userSnapshot = await db.collection('users').where('email', '==', email).get();

        if (userSnapshot.empty) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const userDoc = userSnapshot.docs[0];
        const user = userDoc.data();

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Return user data (without password)
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            success: true,
            token,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// GET PROFILE - Protected route
// ============================================
router.get('/profile', async (req, res) => {
    try {
        const db = req.db;
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user from Firestore
        const userDoc = await db.collection('users').doc(decoded.id).get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = userDoc.data();
        const { password: _, ...userWithoutPassword } = user;

        res.json(userWithoutPassword);

    } catch (error) {
        console.error('Profile error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
});

module.exports = router;