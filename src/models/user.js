/* Creates a user model for the database with the following fields:
email, password, accountType */

import { model, Schema } from 'mongoose'

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  }
})

module.exports = { User }