import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/solid';
import { ReactNode } from 'react';

type DialogProps = {
  isOpen: boolean;
  toggleOpen: () => void;
  onClose?: (value: boolean) => void;
  title: string,
  description?: string,
  children: ReactNode,
}

export default function DialogContainer({ isOpen, toggleOpen, onClose, title, description, children }: DialogProps){
    return (
        <>
          <Dialog open={isOpen} onClose={onClose ?? function(){} } className="relative z-50">
            <div className="fixed inset-0 flex w-screen  backdrop-blur-[2px] items-center justify-center p-4">
              <DialogPanel className="sm:min-w-[600px] min-h-[250px] text-blue-800 max-w-lg relative space-y-3 border bg-white p-12 rounded-lg shadow">
                <span onClick={toggleOpen} className='grid place-items-center w-6 aspect-square rounded-full bg-blue-50 text-blue-700
                 hover:bg-blue-100 cursor-pointer duration-150 top-2 right-2 absolute'>
                  <XMarkIcon className='w-4' /></span>
                <DialogTitle className="font-semibold text-2xl">{title}</DialogTitle>
                <Description>{description}</Description>
                <div>
                  {children}
                </div>
              </DialogPanel>
            </div>
          </Dialog>
        </>
    )
    
}