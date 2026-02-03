import mongoose, { Schema, Document } from 'mongoose'

export interface IReport extends Document {
  listing: mongoose.Types.ObjectId
  reporter: mongoose.Types.ObjectId
  reason: string
  status: 'pending' | 'reviewed' | 'resolved'
  createdAt: Date
}

const ReportSchema = new Schema<IReport>(
  {
    listing: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    reporter: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
)

ReportSchema.index({ listing: 1 })
ReportSchema.index({ reporter: 1 })

export default mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema)
