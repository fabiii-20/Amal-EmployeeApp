const mongoose = require('mongoose');

//  Employee schema
const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  position: { type: String, required: true },
  salary: { type: Number, required: true }
});

// Employee model
const Employee = mongoose.model('Employee', employeeSchema);

// Export the model
module.exports = Employee;
