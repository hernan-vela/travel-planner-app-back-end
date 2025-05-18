import db from './db.js'
import Trip from './models/trip.js'
import Category from './models/category.js'
import Expense from './models/expense.js'

const trips = [
  {
    id: 1,
    location: 'New Caledonia',
    arrivalDate: '01/04/2025',
    departureDate: '07/04/2025',
    totalExpense: 2000
  },
  {
    id: 2,
    location: 'Fiji',
    arrivalDate: '08/04/2025',
    departureDate: '15/04/2025',
    totalExpense: 1000
  }
]

Trip = model('Trip', {
    // COULD IT BE LET EMPTY OR IT SHOULD HAVE A VALUE
})