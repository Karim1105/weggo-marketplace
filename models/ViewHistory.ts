import mongoose, { Schema, Document } from 'mongoose'

export interface IViewHistory extends Document {
  user: mongoose.Types.ObjectId
  product: mongoose.Types.ObjectId
  viewedAt: Date
}

const ViewHistorySchema = new Schema<IViewHistory>(
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
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
)

ViewHistorySchema.index({ user: 1, viewedAt: -1 })
ViewHistorySchema.index({ product: 1 })
ViewHistorySchema.index({ user: 1, product: 1 }, { unique: true })

export default mongoose.models.ViewHistory || mongoose.model<IViewHistory>('ViewHistory', ViewHistorySchema)


