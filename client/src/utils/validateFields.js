// src/utils/checkPassword.js

/**
 * Validates a password based on the following criteria:
 * = = = =  Break Down  = = = =
 * - 8 to 40 characters long
 * --> (?=.{8,40}$) → total length between 8–40 characters
 * - At least 1 uppercase letter
 * --> (?=.*[A-Z]) → at least one uppercase
 * - At least 1 lowercase letter
 * --> (?=.*[a-z]) → at least one lowercase
 * - At least 1 number
 * --> (?=.*\d) → at least one number
 * - At least 1 special character
 * --> (?=.*[^A-Za-z0-9]) → at least one special character
 * - No spaces allowed
 * --> (?!.*\s) → no spaces allowed
 */


const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])(?=.{8,40}$)(?!.*\s).*$/;

export default function checkPassword(password) {
  return passwordRegex.test(password);
}
