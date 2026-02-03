import mongoose, { Schema, Document } from 'mongoose'

export interface IMessage extends Document {
  conversationId: string
  sender: mongoose.Types.ObjectId
  receiver: mongoose.Types.ObjectId
  product?: mongoose.Types.ObjectId
  content: string
  read: boolean
  createdAt: Date
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: String,
      required: true,
      index: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    content: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

MessageSchema.index({ conversationId: 1, createdAt: -1 })
MessageSchema.index({ sender: 1, receiver: 1 })

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema)


