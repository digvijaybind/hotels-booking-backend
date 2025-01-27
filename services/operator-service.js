const {Operator, AircraftOPerator} = require("../models/Owners");
class OperatorService {
  getOperators = async () => {
    return await AircraftOPerator.find();
  };

  getAllOperatorsLocation = async () => {
    try {
      const uniqueLocations = await AircraftOPerator.distinct("location");
      return uniqueLocations;
    } catch (error) {
      throw error;
    }
  };

  getOpeartorsSearchFilter = async (filter) => {
    const key = Object.keys(filter)[0]; // Get the first (and presumably only) key
    const value = filter[key];
    const reg = {
      [key]: new RegExp(value, "i"),
    };

    try {
      const operators = await Operator.find(reg);
      return operators;
    } catch (error) {
      throw new Error("Error searching for operators: " + error.message);
    }
  };

  getOperator = async (_id) => {
    return await AircraftOPerator.findOne(_id);
  };
  updateOperator = async (id, data) => {
    const operator = await AircraftOPerator.findByIdAndUpdate(id, data, {
      new: true,
    });
    return operator;
  };

  deleteOperator = async (id) => {
    return await AircraftOPerator.findByIdAndDelete(id);
  };
  createOperator = async (operator) => {
    return await AircraftOPerator.create(operator);
  };
}
module.exports = new OperatorService();
