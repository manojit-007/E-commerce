// import mongoose from "mongoose";
// import responseHandler from "../utils/responseHandler.js";

// // Validate MongoDB ObjectId
// const validateId = (id, res) => {
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return responseHandler(res, 400, "Invalid MongoDB ID");
//   }
//   return true;
// };

// export default validateId;
// import mongoose from "mongoose";
// import responseHandler from "../utils/responseHandler.js";

// const validateObjectId = (id) => {
//   // const { productId } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return responseHandler(res, 400, "Invalid ID format");
//   }

//   next();
// };

// export default validateObjectId;
// import { Types } from "mongoose";
// import responseHandler from "../utils/responseHandler.js";

// const validateId = (id,res) => {
//   if (!Types.ObjectId.isValid(id)) {
//     return responseHandler(res, 400, "Invalid ID format");
//   }
// };

// export default validateId;

import mongoose from "mongoose";

const validateId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid Product ID format.");
  }
};

export default validateId;
