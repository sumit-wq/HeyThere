import { useState } from "react";
import { isValidPhoneNumber } from "../utils/isValidPhoneNumber";
export const initialData = {
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  };
const useSignupForm = () => {
    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState<{
      name?: string;
      email?: string;
      phoneNumber?: string;
      password?: string;
      confirmPassword?: string;
    }>({});
  
    const validateForm = () => {
      const newErrors: typeof errors = {};
  
      if (!formData.name.trim()) {
        newErrors.name = 'Name should not be empty';
      }
  
      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = 'Number should not be empty';
      } else if (!isValidPhoneNumber(formData.phoneNumber.trim())) {
        newErrors.phoneNumber = 'Invalid Indian phone number';
      }
  
      if (!formData.password.trim()) {
        newErrors.password = 'Password should not be empty';
      }
  
      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = 'Confirm Password should not be empty';
      } else if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
  
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    return {
      formData,
      setFormData,
      errors,
      validateForm,
    };
  };

  export  {useSignupForm}