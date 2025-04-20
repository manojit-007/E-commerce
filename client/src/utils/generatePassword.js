// Function to generate a secure password
export function generateSecurePassword() {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const specialChars = "!@#$%^&*()_+[]{}|;:,.<>?";
  const allChars = uppercase + lowercase + digits + specialChars;

  const getRandomChar = (set) => set[Math.floor(Math.random() * set.length)];

  // Ensure one of each required type
  let password = [
    getRandomChar(uppercase),
    getRandomChar(lowercase),
    getRandomChar(digits),
    getRandomChar(specialChars),
  ];
  // Fill remaining characters randomly
  const minLength = 8;
  const maxLength = 40;
  const remainingLength =
    Math.floor(Math.random() * (maxLength - minLength + 1)) +
    minLength -
    password.length;
  for (let i = 0; i < remainingLength; i++) {
    // // console.log(password);
    password.push(getRandomChar(allChars));
  }
  // console.table(password.join(""), password.length);
  // Shuffle the password
  // password = password.sort(() => Math.random() - 0.5);
  // console.table(password.join(""), password.length);

  return password.join("");
}
