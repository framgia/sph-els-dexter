import {UseFormRegister, RegisterOptions, FieldValues} from "react-hook-form"

interface IInputProps<TFormFields extends FieldValues> {
  type: "text" | "email" | "password";
  name: string;
  placeholder?: string;
  hasLabel?: boolean;
  label?: string;
  register: UseFormRegister<TFormFields>;
  rules?: RegisterOptions
}

const Input = ({
  type, name, placeholder,
  hasLabel, label, register, rules
}: IInputProps<any>) => {
  
  return (
    <div>
      {hasLabel ? <label htmlFor={label?.toLowerCase()}>{label}</label> : undefined}
      <input
        type={type}
        className="w-full p-2 border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4"
        placeholder={placeholder}
        {...register && register(name, rules)}
      />
    </div>
  ) 
}

export default Input
