import mongoose, { Schema, InferSchemaType } from 'mongoose';

const VerificationSchema = new Schema(
  {
    idUploaded: { type: Boolean, default: false },
    workVerified: { type: Boolean, default: false },
  },
  { _id: false }
);

const PreferencesSchema = new Schema(
  {
    budgetRange: { type: [Number], default: [10000, 30000] },
    preferredAreas: { type: [String], default: [] },
    lifestyle: { type: String },
    dealBreakers: { type: [String], default: [] },
    maxDistance: { type: Number, default: 10 },
    ageRange: { type: [Number], default: [20, 35] },
    occupationPreferences: { type: [String], default: [] },
    vegetarianPreference: { type: Boolean, default: false },
    // New flags used in filters
    startupCollaboration: { type: Boolean, default: undefined },
    familyVisitAccommodation: { type: Boolean, default: undefined },
  },
  { _id: false }
);

const UserSchema = new Schema(
  {
    email: { type: String, required: false, unique: false, index: true },
    phone: { type: String, required: false, unique: true, sparse: true, index: true },
    passwordHash: { type: String, required: false },
    name: { type: String, required: true },
    age: { type: Number },
    gender: { type: String },
    occupation: { type: String },
    role: { type: String, enum: ['has_room', 'seeking_room'], default: 'seeking_room' },
    photoUrls: { type: [String], default: [] },
    bio: { type: String },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    preferences: { type: PreferencesSchema, default: {} },
    verification: { type: VerificationSchema, default: {} },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type User = InferSchemaType<typeof UserSchema> & { _id: mongoose.Types.ObjectId };

export const UserModel = mongoose.model('User', UserSchema);


