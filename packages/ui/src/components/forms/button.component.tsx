import { HtmlHTMLAttributes } from "react";
import { cn } from '@repo/utils'

type ButtonProps = {
    isLoading?: boolean,
    type?: 'button' | 'submit' | 'reset',
    className?: string,
    variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'neutral'
} & HtmlHTMLAttributes<HTMLButtonElement>;

export default function Button(props: ButtonProps){

    const { isLoading, variant, type, className, ...defaultProps } = props
    
    return (
        <>
            <button
                className={cn(
                    'border-2 h-[40px] font-medium sm:h-[45px] grid shadow place-items-center text-center font align-middle bg-blue-500 hover:bg-blue-600 text-blue-50 px-6 rounded-md duration-150',
                    variant == 'outline' ? 'bg-transparent border-[1.5px] border-blue-900 text-blue-900 hover:text-blue-50 hover:bg-blue-900' : '',
                    variant == 'secondary' ? 'bg-transparent border-0 text-blue-900 shadow-none hover:shadow hover:bg-slate-100' : '',
                    variant == 'danger' ? 'bg-red-600 text-white hover:bg-red-400' : '',
                    variant == 'neutral' ? 'bg-slate-100 text-slate-600 border-0 hover:bg-slate-200' : '',
                    className,
              )}
                type={ type || 'button'}
                disabled={typeof isLoading == 'undefined' ? false : isLoading }  
                {...defaultProps}
            >
            { !isLoading && defaultProps.children }
            {
                isLoading && 
                <div
                    className={
                    cn(
                        'w-5 h-5 border-2 border-l-0 border-r-0 border-b-0 mx-6 rounded-full animate-spin',
                        variant == 'outline' ? 'border-blue-900' : '',
                        variant == 'secondary' ? 'border-blue-900' : '',
                        variant == 'danger' ? 'border-white' : '',
                        variant == 'neutral' ? 'border-slate-400' : '',
                        )}>

                </div>
            }
            </button>
        </>
    )
}