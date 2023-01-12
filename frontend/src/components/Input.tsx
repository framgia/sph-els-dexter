import React, {FormEventHandler} from "react"

interface IInputProps {
  type: "text" | "email" | "password";
  id?: string;
  placeholder?: string;
  value: any;
  onInput: FormEventHandler<HTMLInputElement>;
  required: boolean;
  hasLabel?: boolean;
  label?: string;
}

function Input({
  type, id, placeholder,
  value, onInput, required,
  hasLabel, label
}: IInputProps) {
  return (
    <div>
      {hasLabel ? <label htmlFor={label?.toLowerCase()}>{label}</label> : undefined}
      <input
        type={type}
        className="w-full p-2 border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4"
        id={id}
        placeholder={placeholder}
        value={value}
        onInput={onInput}
        required={required}
      />
    </div>
  ) 
}

export default Input
