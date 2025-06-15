import Household from '../models/Household.js';

export const createHousehold = async (req, res) => {
  try {
    const { name, members } = req.body;
    const household = await Household.create({
      name,
      members,
      createdBy: req.user.id
    });
    res.status(201).json(household);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getHouseholds = async (req, res) => {
  try {
    const households = await Household.find({ members: req.user.id });
    res.json(households);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};