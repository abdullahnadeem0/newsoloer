import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const agentSchema = new mongoose.Schema({
    // ============================================
    // PERSONAL INFORMATION
    // ============================================
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },

    // ============================================
    // PERSONAL DETAILS
    // ============================================
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    nationality: {
        type: String,
        default: ''
    },

    // ============================================
    // IDENTIFICATION (Optional — Upload OR URL)
    // ============================================
    idType: {
        type: String,
        enum: ['aadhar', 'pan', 'driving_license', 'passport'],
        default: ''
    },
    idNumber: {
        type: String,
        trim: true,
        default: ''
    },

    // ✅ ID File (uploaded) — OPTIONAL
    idFile: {
        type: String,
        default: ''
    },
    idFilePublicId: {
        type: String,
        default: ''
    },

    // ✅ ID File URL — OPTIONAL
    idFileUrl: {
        type: String,
        default: ''
    },

    // ✅ NEW: Source tracking (upload | url | none)
    idFileSource: {
        type: String,
        enum: ['upload', 'url', 'none', ''],
        default: 'none'
    },

    // ============================================
    // PROFESSIONAL INFORMATION
    // ============================================
    jobTitle: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: String,
        trim: true,
        default: ''
    },
    experience: {
        type: String,
        enum: ['Fresher', '1-2 Years', '3-5 Years', '5-10 Years', '10+ Years'],
        required: true
    },
    education: {
        type: String,
        enum: ['High School', 'Diploma', "Bachelor's Degree", "Master's Degree", 'PhD', 'Professional Certification'],
        required: true
    },
    specialization: {
        type: String,
        trim: true,
        default: ''
    },

    // ============================================
    // LOCATION
    // ============================================
    address: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    pincode: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        default: 'India'
    },

    // ============================================
    // LANGUAGES & SKILLS
    // ============================================
    languages: {
        type: [String],
        default: []
    },
    skills: {
        type: [String],
        default: []
    },

    // ============================================
    // BIO
    // ============================================
    bio: {
        type: String,
        trim: true,
        default: ''
    },

    // ============================================
    // ✅ PROFILE IMAGE (Optional — Upload OR URL)
    // ============================================
    profileImage: {
        type: String,
        default: ''
    },
    profileImagePublicId: {
        type: String,
        default: ''
    },
    profileImageUrl: {
        type: String,
        default: ''
    },
    profileImageSource: {
        type: String,
        enum: ['upload', 'url', 'none', ''],
        default: 'none'
    },

    // ============================================
    // ✅ ADDITIONAL DOCUMENTS (Optional)
    // ============================================
    documents: {
        // Resume / CV
        resume: {
            file: { type: String, default: '' },
            publicId: { type: String, default: '' },
            url: { type: String, default: '' },
            source: {
                type: String,
                enum: ['upload', 'url', 'none', ''],
                default: 'none'
            }
        },

        // Business License / Registration
        businessLicense: {
            file: { type: String, default: '' },
            publicId: { type: String, default: '' },
            url: { type: String, default: '' },
            source: {
                type: String,
                enum: ['upload', 'url', 'none', ''],
                default: 'none'
            }
        },

        // PAN Card (separate from ID)
        panCard: {
            file: { type: String, default: '' },
            publicId: { type: String, default: '' },
            url: { type: String, default: '' },
            source: {
                type: String,
                enum: ['upload', 'url', 'none', ''],
                default: 'none'
            }
        },

        // Address Proof
        addressProof: {
            file: { type: String, default: '' },
            publicId: { type: String, default: '' },
            url: { type: String, default: '' },
            source: {
                type: String,
                enum: ['upload', 'url', 'none', ''],
                default: 'none'
            }
        },

        // Any other document
        otherDocument: {
            file: { type: String, default: '' },
            publicId: { type: String, default: '' },
            url: { type: String, default: '' },
            source: {
                type: String,
                enum: ['upload', 'url', 'none', ''],
                default: 'none'
            }
        }
    },

    // ============================================
    // VERIFICATION STATUS
    // ============================================
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },

    // ============================================
    // APPROVAL SYSTEM
    // ============================================
    approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        default: null
    },
    approvedAt: {
        type: Date,
        default: null
    },
    rejectionReason: {
        type: String,
        default: ''
    },
    rejectedAt: {
        type: Date,
        default: null
    },
    rejectedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        default: null
    },

    // ============================================
    // OTP
    // ============================================
    otp: {
        type: String,
        default: null
    },
    otpExpiry: {
        type: Date,
        default: null
    },

    // ============================================
    // LOGIN TRACKING
    // ============================================
    lastLogin: {
        type: Date,
        default: null
    },
    loginCount: {
        type: Number,
        default: 0
    },

    // ============================================
    // RATINGS
    // ============================================
    rating: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },

    // ============================================
    // RESET PASSWORD
    // ============================================
    resetToken: {
        type: String,
        default: null
    },
    resetTokenExpiry: {
        type: Date,
        default: null
    }

}, {
    timestamps: true
});

// ============================================
// HASH PASSWORD BEFORE SAVING
// ============================================
agentSchema.pre('save', async function() {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
});

// ============================================
// COMPARE PASSWORD METHOD
// ============================================
agentSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// ============================================
// ✅ VIRTUAL: Get ID file display URL
// ============================================
agentSchema.virtual('idFileDisplayUrl').get(function() {
    if (this.idFileUrl) return this.idFileUrl;
    if (this.idFile) {
        // Convert Windows path to URL path
        const cleanPath = this.idFile.replace(/\\/g, '/');
        return cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
    }
    return '';
});

// ============================================
// ✅ VIRTUAL: Get Profile image display URL
// ============================================
agentSchema.virtual('profileImageDisplayUrl').get(function() {
    if (this.profileImageUrl) return this.profileImageUrl;
    if (this.profileImage) {
        const cleanPath = this.profileImage.replace(/\\/g, '/');
        return cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
    }
    return '';
});

// ============================================
// ✅ METHOD: Get any document's display URL
// ============================================
agentSchema.methods.getDocumentUrl = function(docType) {
    const doc = this.documents?.[docType];
    if (!doc) return '';

    // URL has priority
    if (doc.url) return doc.url;

    // Fallback to file path
    if (doc.file) {
        const cleanPath = doc.file.replace(/\\/g, '/');
        return cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
    }

    return '';
};

// ============================================
// ✅ METHOD: Check if agent has any ID document
// ============================================
agentSchema.methods.hasIdDocument = function() {
    return !!(this.idFile || this.idFileUrl);
};

// Ensure virtuals are included when converting to JSON
agentSchema.set('toJSON', { virtuals: true });
agentSchema.set('toObject', { virtuals: true });

const Agent = mongoose.model('Agent', agentSchema);
export default Agent;