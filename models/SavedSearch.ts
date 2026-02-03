import mongoose, { Schema, Document } from 'mongoose'

export interface ISavedSearch extends Document {
  user: mongoose.Types.ObjectId
  name: string
  params: Record<string, string>
  createdAt: Date
}

const SavedSearchSchema = new Schema<ISavedSearch>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    params: { type: Schema.Types.Mixed, required: true, default: {} },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

SavedSearchSchema.index({ user: 1, createdAt: -1 })

export default mongoose.models.SavedSearch ||
  mongoose.model<ISavedSearch>('SavedSearch', SavedSearchSchema)

