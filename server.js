const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// In-memory storage for messages (in production, use a database)
let messages = [
    {
        id: 1,
        name: "John Smith",
        email: "john@example.com",
        message: "I'm interested in purchasing some Rhode Island Red chickens. Do you have any available for sale?",
        date: new Date("2025-09-28T14:30:00"),
        read: false
    },
    {
        id: 2,
        name: "Maria Garcia",
        email: "maria@example.com",
        message: "Thank you for the information about heritage breeds. I visited your farm last week and was impressed!",
        date: new Date("2025-09-27T10:15:00"),
        read: true
    },
    {
        id: 3,
        name: "Robert Johnson",
        email: "robert@example.com",
        message: "Do you offer farm visits? I'd love to bring my kids to see the chickens and learn about sustainable farming.",
        date: new Date("2025-09-26T16:45:00"),
        read: false
    }
];

// In-memory storage for gallery images (in production, use a database)
let galleryImages = [
    {
        id: 1,
        title: "Heritage Chicken 1",
        description: "Beautiful Rhode Island Red chicken in natural habitat",
        filename: "image1.jpg",
        uploadDate: new Date()
    },
    {
        id: 2,
        title: "Heritage Chicken 2",
        description: "Close-up of a healthy Rhode Island Red",
        filename: "image2.jpg",
        uploadDate: new Date()
    },
    {
        id: 3,
        title: "Heritage Chicken 3",
        description: "Chickens roaming freely in our farm",
        filename: "image3.jpg",
        uploadDate: new Date()
    }
];

// Routes

// Serve the admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// API Routes

// Get all messages
app.get('/api/messages', (req, res) => {
    res.json({
        success: true,
        data: messages
    });
});

// Get unread messages count
app.get('/api/messages/unread-count', (req, res) => {
    const unreadCount = messages.filter(msg => !msg.read).length;
    res.json({
        success: true,
        count: unreadCount
    });
});

// Mark message as read
app.put('/api/messages/:id/read', (req, res) => {
    const messageId = parseInt(req.params.id);
    const message = messages.find(msg => msg.id === messageId);
    
    if (!message) {
        return res.status(404).json({
            success: false,
            message: 'Message not found'
        });
    }
    
    message.read = true;
    res.json({
        success: true,
        message: 'Message marked as read'
    });
});

// Mark message as unread
app.put('/api/messages/:id/unread', (req, res) => {
    const messageId = parseInt(req.params.id);
    const message = messages.find(msg => msg.id === messageId);
    
    if (!message) {
        return res.status(404).json({
            success: false,
            message: 'Message not found'
        });
    }
    
    message.read = false;
    res.json({
        success: true,
        message: 'Message marked as unread'
    });
});

// Delete a message
app.delete('/api/messages/:id', (req, res) => {
    const messageId = parseInt(req.params.id);
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    
    if (messageIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Message not found'
        });
    }
    
    messages.splice(messageIndex, 1);
    res.json({
        success: true,
        message: 'Message deleted successfully'
    });
});

// Delete all messages
app.delete('/api/messages', (req, res) => {
    messages = [];
    res.json({
        success: true,
        message: 'All messages deleted successfully'
    });
});

// Submit a new message (customer contact form)
app.post('/api/messages', (req, res) => {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: 'Name, email, and message are required'
        });
    }
    
    const newMessage = {
        id: messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1,
        name,
        email,
        message,
        date: new Date(),
        read: false
    };
    
    messages.push(newMessage);
    
    res.status(201).json({
        success: true,
        message: 'Message submitted successfully',
        data: newMessage
    });
});

// Get all gallery images
app.get('/api/gallery', (req, res) => {
    const imagesWithPaths = galleryImages.map(img => ({
        ...img,
        path: `/uploads/${img.filename}`
    }));
    
    res.json({
        success: true,
        data: imagesWithPaths
    });
});

// Upload a new image to gallery
app.post('/api/gallery', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'No image file provided'
        });
    }
    
    const { title, description } = req.body;
    
    if (!title || !description) {
        // Clean up uploaded file if validation fails
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
            success: false,
            message: 'Title and description are required'
        });
    }
    
    const newImage = {
        id: galleryImages.length > 0 ? Math.max(...galleryImages.map(img => img.id)) + 1 : 1,
        title,
        description,
        filename: req.file.filename,
        uploadDate: new Date()
    };
    
    galleryImages.push(newImage);
    
    res.status(201).json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
            ...newImage,
            path: `/uploads/${req.file.filename}`
        }
    });
});

// Delete an image from gallery
app.delete('/api/gallery/:id', (req, res) => {
    const imageId = parseInt(req.params.id);
    const imageIndex = galleryImages.findIndex(img => img.id === imageId);
    
    if (imageIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Image not found'
        });
    }
    
    const image = galleryImages[imageIndex];
    
    // Delete the file from disk
    const imagePath = path.join(__dirname, 'uploads', image.filename);
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
    
    galleryImages.splice(imageIndex, 1);
    
    res.json({
        success: true,
        message: 'Image deleted successfully'
    });
});

// Serve the main website
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Admin panel: http://localhost:${PORT}/admin`);
});

module.exports = app;