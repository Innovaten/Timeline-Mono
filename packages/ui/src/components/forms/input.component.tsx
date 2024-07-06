import { HtmlHTMLAttributes } from "react";
import { EnvelopeIcon, LockClosedIcon, PhoneIcon } from "@heroicons/react/24/solid";
import { ErrorMessage, Field } from "formik";

const inputTypeIcons = {
  email: EnvelopeIcon,
  password:  LockClosedIcon,
  phone: PhoneIcon
};

type InputProps = {
  label?: string;
  className?: string;
  iconType?: "email" | "password" | "phone";
  hasValidation?: boolean;
  name?: string;
  placeholder?: string, 
  type?: string,
} & HtmlHTMLAttributes<HTMLInputElement>;

export default function Input(props: InputProps) {
  const { label, className, iconType, placeholder, hasValidation, name, type, ...defaultProps } =
    props;

  const LeftIcon: (typeof EnvelopeIcon ) | null = iconType
    ? inputTypeIcons[iconType]
    : null;

  return (
    <span className="relative w-full flex flex-col gap-1">
      {label && <label className="text-sm text-blue-700">{label}</label>}
      <Field
        className={`${className ? className : ''} text-base text-blue-600 border-[1.5px] focus:outline-blue-300 focus:ring-0  rounded-md border-slate-300 shadow-sm h-[40px] px-2 ${iconType && "pl-9"}`}
        name={name}
        placeholder={placeholder}
        type={type || 'text'}
        {...defaultProps}
      />
      {LeftIcon && <LeftIcon className="bottom-[12px] text-blue-700 absolute w-4 left-3" />}
      {hasValidation && name && (
        <ErrorMessage
          className="text-red-500/60 text-sm mt-1/2 absolute -bottom-5"
          component="div"
          name={name}
        />
      )}
    </span>
  );
}
