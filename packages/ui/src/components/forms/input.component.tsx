import { HtmlHTMLAttributes } from "react";
import { EnvelopeIcon } from "@heroicons/react/24/solid";
import { ErrorMessage, Field } from "formik";

const inputTypeIcons = {
  email: EnvelopeIcon,
};

type InputProps = {
  label?: string;
  className?: string;
  iconType?: "email";
  hasValidation?: boolean;
  name?: string;
  placeholder?: string, 
} & HtmlHTMLAttributes<HTMLInputElement>;

export default function Input(props: InputProps) {
  const { label, className, iconType, placeholder, hasValidation, name, ...defaultProps } =
    props;

  const leftIcon = iconType
    ? inputTypeIcons[iconType]({
        className: "top-3 absolute left-2",
      })
    : null;

  return (
    <span className="relative flex flex-col gap-2">
      {label && <label className="text-base text-blue-700">{label}</label>}
      <Field
        className={`${className ? className : ''} text-base text-blue-600 border-[1.5px] focus:outline-blue-500 focus:ring-0  rounded-md border-blue-300 h-[45px] px-2 ${iconType && "pl-5"}`}
        name={name}
        placeholder={placeholder}
        {...defaultProps}
      />
      {leftIcon}
      {hasValidation && name && (
        <ErrorMessage
          className="text-red-500/60 text-sm mt-1/2"
          component="div"
          name={name}
        />
      )}
    </span>
  );
}
