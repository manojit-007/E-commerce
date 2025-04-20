import fs from "fs/promises";

const unlinkFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    // console.log(`File at ${filePath} deleted successfully.`);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.warn(`File at ${filePath} does not exist.`);
    } else {
      console.error(`Error while deleting file at ${filePath}:`, error.message);
    }
  }
};

export default unlinkFile;
