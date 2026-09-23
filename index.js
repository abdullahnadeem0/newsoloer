import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import dns from "dns";
import { fileURLToPath } from "url";

// ============================================
// ✅ FIX: Custom DNS for MongoDB SRV
// ============================================
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1', '1.0.0.1']);

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import adminRoutes from "./routes/adminRoutes.js";
import adminApplicationRoutes from "./routes/adminApplicationRoutes.js";
import agentRoutes from './routes/agentRoutes.js';
import applicationRoutes from "./routes/applicationRoutes.js";
import universityRoutes from './routes/universityRoutes.js';
import programRoutes from "./routes/programRoutes.js";
import agentPaymentRoutes from "./routes/agentPaymentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import agentDashboardRoutes from "./routes/agentDashboardRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();

// ============================================
// ✅ FIX: CORS CONFIGURATION
// ============================================
const allowedOrigins = [
    'https://scholarship-three-kappa.vercel.app',
    'https://newsoloer.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5000',
];

// Also allow any *.vercel.app preview deployment
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, curl)
        if (!origin) return callback(null, true);

        // Allow if in whitelist
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // Allow all vercel.app preview URLs
        if (origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }

        // Otherwise block
        console.log('❌ CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers',
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400, // 24 hours
};

// ✅ Apply CORS middleware
app.use(cors(corsOptions));

// ✅ Handle preflight OPTIONS requests explicitly
app.options('*', cors(corsOptions));

// ============================================
// BODY PARSERS
// ============================================
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================
// MONGODB CONNECTION
// ============================================
const connectDB = async () => {
    try {
        console.log('🔄 Connecting to MongoDB...');

        const uri = process.env.MONGO_URI;

        if (!uri) {
            console.error('❌ MONGO_URI not found in .env file!');
            process.exit(1);
        }

        console.log('URI:', uri.replace(/:[^:@]+@/, ':****@'));

        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 30000,
            maxPoolSize: 10,
            family: 4,
            dbName: 'dgss',
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📁 Database: ${conn.connection.name}`);
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

connectDB();

// ============================================
// ROUTES
// ============================================
app.get("/", (req, res) => {
    res.json({ 
        message: "API is running successfully",
        timestamp: new Date().toISOString(),
        status: 'healthy'
    });
});

// ✅ Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ 
        status: 'OK',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

app.use('/api/admin/dashboard', dashboardRoutes);
app.use("/api/admin", adminApplicationRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/admin/payments', paymentRoutes);

app.use('/api/agent/dashboard', agentDashboardRoutes);
app.use('/api/agent', applicationRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/agent/payments', agentPaymentRoutes);

app.use('/api/universities', universityRoutes);
app.use('/api/programs', programRoutes);

// ============================================
// ✅ ERROR HANDLER
// ============================================
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`✅ CORS enabled for: ${allowedOrigins.join(', ')}`);
    console.log(`✅ Also allowing: *.vercel.app`);
});