/* Creates a trip model for the database with the following fields:
location, arrivalDate, departureDate, totalExpense */
import { model, ObjectId } from 'mongoose'

const Trip = model('Trip', {
  location: { type: String, required: true },
  arrivalDate: { type: Date, required: true },
  departureDate: { type: Date, required: true },
  totalExpense: { type: Number, required: false }// COULD IT BE LET EMPTY OR IT SHOULD HAVE A VALUE
})

module.exports = { Trip }
