const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse request bodies
app.use(bodyParser.json());

// Serve static files from the 'dist/FrontEnd' directory
app.use(express.static(path.join(__dirname, 'dist/FrontEnd')));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/employees', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB');
});

// Employee schema and model
const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  position: { type: String, required: true },
  salary: { type: Number, required: true }
});

const Employee = mongoose.model('Employee', employeeSchema);

// API to get all employees
app.get('/api/employeelist', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).send(err);
  }
});

// API to get a single employee by ID
app.get('/api/employeelist/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).send('Employee not found');
    }
    res.json(employee);
  } catch (err) {
    res.status(500).send(err);
  }
});

// API to create a new employee
app.post('/api/employeelist', async (req, res) => {
  const { name, location, position, salary } = req.body;
  const newEmployee = new Employee({ name, location, position, salary });
  try {
    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (err) {
    res.status(500).send(err);
  }
});

// API to update an employee by ID
app.put('/api/employeelist/:id', async (req, res) => {
  const { name, location, position, salary } = req.body;
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, location, position, salary },
      { new: true }
    );
    if (!updatedEmployee) {
      return res.status(404).send('Employee not found');
    }
    res.json(updatedEmployee);
  } catch (err) {
    res.status(500).send(err);
  }
});

// API to delete an employee by ID
app.delete('/api/employeelist/:id', async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).send('Employee not found');
    }
    res.send('Employee deleted');
  } catch (err) {
    res.status(500).send(err);
  }
});

// Serve the front-end application
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist/FrontEnd', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});


