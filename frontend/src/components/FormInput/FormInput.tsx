// components/FormInput/FormInput.tsx
import React from 'react';
import styles from './FormInput.module.css'; // opcjonalnie

interface FormInputProps {
  name: string;
  type: string;
  value: string;
  placeholder: string;
  required?: boolean;
  pattern?: string;
  title?: string;
  autoComplete?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: React.FC<FormInputProps> = ({
  name,
  type,
  value,
  placeholder,
  required = false,
  pattern,
  title,
  autoComplete,
  onChange,
}) => {
  return (
    <input
      name={name}
      type={type}
      value={value}
      placeholder={placeholder}
      required={required}
      pattern={pattern}
      title={title}
      autoComplete={autoComplete}
      onChange={onChange}
    />
  );
};

export default FormInput;
