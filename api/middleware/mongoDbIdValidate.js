import mongoose from "mongoose";

const validateId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid Product ID format.");
  }
};

export default validateId;
