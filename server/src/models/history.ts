import mongoose, { Document, Schema } from 'mongoose';

export interface IHistoryItem {
  title?: string;
  link?: string;
  snippet?: string;
  displayLink?: string;
}

export interface IHistory extends Document {
  results: IHistoryItem;
  timestamp: Date;
}

const historySchema: Schema = new Schema({
  results: {
    title: String,
    link: String,
    snippet: String,
    displayLink: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IHistory>('History', historySchema);
