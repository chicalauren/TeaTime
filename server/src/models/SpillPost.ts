import { Schema, model } from 'mongoose';

const commentSchema = new Schema(
    {
      content: {
        type: String,
        required: true,
      },
      createdByUsername: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }
  );  

const spillPostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const SpillPost = model('SpillPost', spillPostSchema);

export default SpillPost;
