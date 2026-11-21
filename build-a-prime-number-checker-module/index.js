function isPrime(num) {
  // Numbers less than 2 are not prime (this covers 0, 1, and negatives)
  if (num < 2) {
    return false;
  }

  // Decimals like 2.5 are not prime
  if (!Number.isInteger(num)) {
    return false;
  }

  // Check for a divisor from 2 up to the square root of num
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      return false; // found a divisor, so it's not prime
    }
  }

  // No divisors found, so it's prime
  return true;
}

module.exports = { isPrime };