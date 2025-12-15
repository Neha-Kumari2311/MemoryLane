/**
 * Input validation utilities
 */

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    return { valid: false, error: "Invalid email format" };
  }
  return { valid: true };
}

export function validatePassword(password) {
  if (!password || password.length < 6) {
    return { 
      valid: false, 
      error: "Password must be at least 6 characters long" 
    };
  }
  if (password.length > 128) {
    return { 
      valid: false, 
      error: "Password is too long (max 128 characters)" 
    };
  }
  return { valid: true };
}

export function validateName(name) {
  if (!name || name.trim().length < 2) {
    return { 
      valid: false, 
      error: "Name must be at least 2 characters long" 
    };
  }
  if (name.length > 100) {
    return { 
      valid: false, 
      error: "Name is too long (max 100 characters)" 
    };
  }
  return { valid: true };
}

export function sanitizeInput(input) {
  if (typeof input !== "string") return input;
  return input.trim().toLowerCase();
}
