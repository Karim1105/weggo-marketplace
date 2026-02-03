import mongoose, { Schema, Document } from 'mongoose'

export interface IWishlist extends Document {
  user: mongoose.Types.ObjectId
  product: mongoose.Types.ObjectId
  createdAt: Date
}

const WishlistSchema = new Schema<IWishlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

WishlistSchema.index({ user: 1, product: 1 }, { unique: true })
WishlistSchema.index({ user: 1, createdAt: -1 })

export default mongoose.models.Wishlist || mongoose.model<IWishlist>('Wishlist', WishlistSchema)


