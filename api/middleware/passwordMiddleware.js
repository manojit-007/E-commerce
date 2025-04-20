import bcrypt from "bcryptjs";

// Asynchronous version`
async function encryptPassword(password) {
  // const salt = await bcrypt.genSalt(10);
  // return await bcrypt.hash(password, salt);
  const salt = await bcrypt.genSalt(10);
  // console.log("Generated Salt:", salt);
  const hash = await bcrypt.hash(password, salt);
  // console.log("Generated Hash:", hash);
  return hash;
}

async function decryptPassword(password,encryptedPassword) {
  // console.log("Password to Compare:", password);
  // console.log("Encrypted Password:", encryptedPassword);
  // const result = await bcrypt.compare(password, encryptedPassword);
  // console.log("Password Match Result:", result);
    return await bcrypt.compare(password, encryptedPassword);
}



export { encryptPassword, decryptPassword };
//Ww8<Uvb7UFT@yU4P@bU[2o: