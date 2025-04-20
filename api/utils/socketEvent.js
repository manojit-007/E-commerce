import { CustomError } from "../middleware/errorHandler.js"; // Import your CustomError class

const socketEvent = (io, eventName, data) => {
  try {
    if (!io || !eventName) {
      throw new CustomError("Invalid parameters: io and eventName are required.", 400);
    }

    io.emit(eventName, data);
    // // console.log(`Broadcasted event: ${eventName}`, data);
  } catch (error) {
    // console.error(`Failed to broadcast event: ${eventName}`, error.message);
    // Re-throw as a CustomError if it's not already one
    if (!(error instanceof CustomError)) {
      throw new CustomError(`Broadcast error: ${error.message}`, 500);
    }

    throw error; // Re-throw the original error if it's already a CustomError
  }
};

export default socketEvent;
