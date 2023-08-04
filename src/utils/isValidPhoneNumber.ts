export const isValidPhoneNumber = (phoneNumber: string): boolean => {
    // Simple Indian phone number validation for 10 digits starting with 7, 8, or 9
    return /^[789]\d{9}$/.test(phoneNumber);
  };