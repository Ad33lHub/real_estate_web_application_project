const express = require('express');
const router = express.Router();
const Agent = require('../models/Agent');

// GET all agents
router.get('/', async (req, res) => {
  try {
    const agents = await Agent.find().sort({ createdAt: -1 });
    res.status(200).json(agents);
  } catch (err) {
    console.error('Get Agents Error:', err);
    res.status(500).json({ message: 'Server error while fetching agents' });
  }
});

// GET single agent by ID
router.get('/:id', async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    res.status(200).json(agent);
  } catch (err) {
    console.error('Get Agent Error:', err);
    res.status(500).json({ message: 'Server error while fetching agent' });
  }
});

// POST - Create new agent
router.post('/', async (req, res) => {
  try {
    const { agentName, email, phone, agencyName, experience, image } = req.body;

    // Check if email already exists
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({ message: 'Agent with this email already exists' });
    }

    const agent = new Agent({
      agentName,
      email,
      phone,
      agencyName,
      experience,
      image
    });

    await agent.save();
    res.status(201).json({ message: 'Agent created successfully', agent });
  } catch (err) {
    console.error('Create Agent Error:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error while creating agent' });
  }
});

// PUT - Update agent by ID
router.put('/:id', async (req, res) => {
  try {
    const agent = await Agent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.status(200).json({ message: 'Agent updated successfully', agent });
  } catch (err) {
    console.error('Update Agent Error:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error while updating agent' });
  }
});

// DELETE - Delete agent by ID
router.delete('/:id', async (req, res) => {
  try {
    const agent = await Agent.findByIdAndDelete(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    res.status(200).json({ message: 'Agent deleted successfully' });
  } catch (err) {
    console.error('Delete Agent Error:', err);
    res.status(500).json({ message: 'Server error while deleting agent' });
  }
});

module.exports = router;
