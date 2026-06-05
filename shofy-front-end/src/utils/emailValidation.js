// Strict email validation regex pattern
// Requires: proper prefix, valid domain structure, proper TLD
export const strictEmailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Validate email strictly
export const isValidEmail = (email) => {
  if (!email) return false;
  
  const trimmedEmail = email.trim().toLowerCase();
  
  // Check basic regex pattern
  if (!strictEmailRegex.test(trimmedEmail)) {
    return false;
  }
  
  // Check for consecutive dots
  if (trimmedEmail.includes('..')) {
    return false;
  }
  
  // Check for invalid patterns
  if (trimmedEmail.startsWith('.') || trimmedEmail.endsWith('.')) {
    return false;
  }
  
  // Check domain part has valid structure
  const [prefix, domain] = trimmedEmail.split('@');
  
  // Prefix validation
  if (prefix.length < 1 || prefix.length > 64) {
    return false;
  }
  
  if (prefix.startsWith('.') || prefix.endsWith('.')) {
    return false;
  }
  
  // Domain validation
  if (!domain || domain.length < 3) {
    return false;
  }
  
  // Check domain has at least one dot for proper TLD
  if (!domain.includes('.')) {
    return false;
  }
  
  // Get TLD (last part after last dot)
  const parts = domain.split('.');
  const tld = parts[parts.length - 1];
  
  // TLD must be at least 2 characters and only letters
  if (tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) {
    return false;
  }
  
  // Check for obviously fake patterns
  const fakeDomains = [
    'test.com',
    'example.com',
    'sample.com',
    'demo.com',
    'localhost',
    'invalid.com',
  ];
  
  if (fakeDomains.includes(domain)) {
    return false;
  }
  
  return true;
};

// Yup validation schema for email
export const emailValidation = () => {
  return /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
};
