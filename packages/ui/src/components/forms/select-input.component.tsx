import { HtmlHTMLAttributes } from "react";
import { ErrorMessage, Field } from "formik";
import { cn } from "@repo/utils";

type InputOptionsType = {
    label: string,
    value: string | number
}

type InputProps = {
  label?: string;
  className?: string;
  hasValidation?: boolean;
  name?: string;
  options: InputOptionsType[]
  variant?: "default" | "outline"
} & HtmlHTMLAttributes<HTMLSelectElement>;

export default function SelectInput(props: InputProps) {
  const { label, className, hasValidation, variant, name, options, ...defaultProps } =
    props;

  return (
    <span className="relative flex flex-col gap-2 w-full">
      {label && <label className="text-base text-blue-700">{label}</label>}
      <Field
        component='select'
        className={cn(
          className ? className : '', 
          "text-base text-blue-600 border-[1.5px] focus:outline-blue-300 focus:ring-0  rounded-md border-slate-300 shadow-sm h-[45px] px-2",
          variant == "outline" ? "border-blue-900 text-blue-900" : "",
        )}
        name={name}
        {...defaultProps}
      >
        { options && options.length > 0 && options.map(({ label, value }, idx) => {
            return (
                <option key={idx} value={value}>{label}</option>
            )
        })}
        
    </Field>
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
