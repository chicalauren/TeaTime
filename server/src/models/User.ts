import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;

  //TESTING FRIENDS
  favoriteTeas: mongoose.Types.ObjectId[]; // to see the users fav teas
  friends: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
  friendRequestsSent: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
  friendRequestsReceived: { type: [Schema.Types.ObjectId], ref: "User", default: [] },

  bio?: string;
  favoriteTeaSource?: string;
  profileImage?: string;
  isCorrectPassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
// Add this after the array definition:
    friendRequestsSent: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    friendRequestsReceived: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Must use a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    favoriteTeas: [
      {
        // adding a fav category so it SHOULD pull reccomendations from the DB based on these
        type: Schema.Types.ObjectId,
        ref: "TeaCategory",
      },
    ],
    bio: {
      type: String,
      default: "",
    },
    favoriteTeaSource: {
      type: String,
      default: "",
    },
    profileImage: {
      type: String,
      default: "",
    },
  },

  {
    timestamps: true,
  }
);

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Custom method to validate password
userSchema.methods.isCorrectPassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
