import { model, ObjectId } from 'mongoose'

const Trip = model('Trip', {
    userId: { type: Symbol, required: true },// NEEDED OR THE SYSTEM GENERATES IT?
    location: { type: String, required: true },
    arrivalDate: { type: Date, required: true },
    departureDate: { type: Date, required: true },
    totalExpense: { type: Number, required: false }// COULD IT BE LET EMPTY OR IT SHOULD HAVE A VALUE
})

module.exports = { Trip }
