import mongoose, { Schema, Document } from 'mongoose'

export interface IReview extends Document {
  reviewer: mongoose.Types.ObjectId
  seller: mongoose.Types.ObjectId
  product: mongoose.Types.ObjectId
  rating: number
  comment: string
  createdAt: Date
}

const ReviewSchema = new Schema<IReview>(
  {
    reviewer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

ReviewSchema.index({ seller: 1, createdAt: -1 })
ReviewSchema.index({ product: 1 })

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema)


