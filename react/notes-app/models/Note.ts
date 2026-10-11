import mongoose, { Schema, Model, models } from "mongoose";

export interface INote {
  _id: mongoose.Types.ObjectId;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 100,
    },
    content: {
      type: String,
      required: true,
      maxLength: 2000,
    },
  },
  {
    timestamps: true,
  },
);

const Note: Model<INote> =
  models.Note || mongoose.model<INote>("Note", NoteSchema);

export default Note;
