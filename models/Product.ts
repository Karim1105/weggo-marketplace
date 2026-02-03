import mongoose, { Schema, Document } from 'mongoose'

export interface IProduct extends Document {
  title: string
  description: string
  price: number
  category: string
  subcategory?: string
  condition: string
  location: string
  images: string[]
  seller: mongoose.Types.ObjectId
  status: 'active' | 'sold' | 'pending' | 'deleted'
  views: number
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    subcategory: { type: String, trim: true },
    condition: {
      type: String,
      required: [true, 'Condition is required'],
      enum: ['New', 'Like New', 'Excellent', 'Good', 'Fair'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    images: {
      type: [String],
      default: [],
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'sold', 'pending', 'deleted'],
      default: 'active',
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

ProductSchema.index({ title: 'text', description: 'text' })
ProductSchema.index({ category: 1, location: 1, price: 1 })
ProductSchema.index({ seller: 1 })
ProductSchema.index({ createdAt: -1 })

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)


