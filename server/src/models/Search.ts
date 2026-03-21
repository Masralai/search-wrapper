import mongoose, { Document, Schema } from 'mongoose';

export interface ISearchResult {
  title: string;
  link: string;
  snippet: string;
  displayLink: string;
}

export interface ISearch extends Document {
  query: string;
  results: ISearchResult[];
  timestamp: Date;
  resultCount: number;
  searchTime: number;
}

const searchSchema: Schema = new Schema({
  query: {
    type: String,
    required: true,
    trim: true,
  },
  results: [
    {
      title: String,
      link: String,
      snippet: String,
      displayLink: String,
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  },
  resultCount: {
    type: Number,
    default: 0,
  },
  searchTime: {
    type: Number, // in milliseconds
    default: 0,
  },
});

export default mongoose.model<ISearch>('Search', searchSchema);
