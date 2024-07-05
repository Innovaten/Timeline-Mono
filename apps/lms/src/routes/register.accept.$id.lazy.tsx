import { makeUnauthenticatedRequest } from '@repo/utils';
import { createLazyFileRoute, Outlet } from '@tanstack/react-router'
import { useRegistrant } from '../hooks/registration.info.hooks';
import { Button, DialogContainer } from '@repo/ui';
import { useState } from 'react';

export const Route = createLazyFileRoute('/register/accept/$id')({
  component: RegistrationsAcceptIdLazy,
})

function RegistrationsAcceptIdLazy(){

  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
    const {id} = Route.useParams();
    const { registrant } = useRegistrant(id);
   

    function acceptAdmission(){
      makeUnauthenticatedRequest(
        "get",
        `/api/v1/users/${id}`
      ).then( res => {
        if(res.status == 200 && res.data.success){
          console.log(res.data)
        } else {
          console.log(res.data.error.msg);
        }
      })

      makeUnauthenticatedRequest(
        "get",
        `/api/v1/registrations/admission/approve?_id=${id}`
      ).then( res => {
        if(res.status == 200 && res.data.success){
          console.log(res.data)
        } else {
          console.log(res.data.error.msg);
        }
      })
    }

    function rejectAdmission(){
      makeUnauthenticatedRequest(
        "post",
        `/api/v1/registrations/admission/approve?_id=${id}`
      ).then( res => {
        if(res.status == 200 && res.data.success){
          console.log(res.data)
        } else {
          console.log(res.data.error.msg);
        }
      })
    }


    function admissionDialog(){
  
      return (
        <DialogContainer
          isOpen={isOpen}
          onClose={()=>setIsOpen(false)}
          toggleOpen={() => setIsOpen(!isOpen)}
          title={`Admission Acceptance`}
          description={`Congratulations ${firstName }, you are in!`}
        >
          <div className="flex flex-col gap-4 sm:justify-between">
            <div className='w-full flex-1'>
              <div className=' w-full overflow-auto h-full flex flex-col rounded'>
              Check your email for your console credentials!
              </div>
            </div>
            <Button className="px-3 w-fit !h-[35px]" type="submit" isLoading={false} variant="neutral" onClick={() => {setIsOpen(false)}}>
                Close
              </Button>
          </div>
        </DialogContainer>
      );
      }
      
    return (
        <>
          <div className="flex flex-col gap-4 sm:justify-between">
            <div className='my-1 md:my-3'>
            <h1 className='text-blue-950 mb-2'>Accept admission</h1>
            <p>Please verify your details</p>
          </div>
          <div className='w-full flex-1 bg-blue-50 p-1 rounded-sm shadow-sm'>
            <div className='bg-white w-full overflow-auto h-full flex flex-col rounded'>
              <div className="flex justify-between border-b-[1.5px]" >
                <span className="text-md w-32 my-auto border-r-[1.5px] inline p-2 font-light " >FULL NAME</span>
                <span className="text-lg text-blue-600 inline p-2" >
                  {registrant.firstName}
                  {registrant.otherNames == "" ? " " : " " + registrant.otherNames + " "}
                  {registrant.lastName}
                </span>
              </div>
              <div className="flex justify-between border-b-[1.5px]" >
                <span className="text-md w-32 my-auto border-r-[1.5px] inline p-2 font-light " >GENDER</span>
                <span className="text-lg text-blue-600 inline p-2">{registrant.gender}</span>
              </div>
              <div className="flex justify-between border-b-[1.5px]" >
                <span className="text-md w-32 my-auto border-r-[1.5px] inline p-2 font-light " >EMAIL ADDRESS</span>
                <span className="text-lg text-blue-600 inline  p-2">{registrant.email}</span>
              </div>
              <div className="flex justify-between border-b-[1.5px]" >
                <span className="text-md w-32 my-auto border-r-[1.5px] inline p-2 font-light " >PHONE NUMBER</span>
                <span  className="text-lg text-blue-600 inline p-2">{registrant.phone}</span>
              </div>
              <div className="flex justify-between border-b-[1.5px]" >
                <span className="text-md w-32 my-auto border-r-[1.5px] inline p-2 font-light " >MODE OF CLASS</span>
                <span className="text-lg text-blue-600 inline p-2" >{registrant.modeOfClass}</span>
              </div>
              <div className="flex justify-between" >
                <span className="text-md w-32 my-auto border-r-[1.5px] inline p-2 font-light " >APPROVED CLASSES</span>
                <span className="flex gap-2 p-2">
                  {registrant.approvedClasses?.length && registrant.approvedClasses.map((course, idx) => {
                    return (
                      <span key={idx} className="text-lg w-fit text-blue-600 block" >
                        {course.toString()}
                      </span>
                    );
                  })}
                  { !registrant.approvedClasses?.length && <span className="text-lg text-blue-600 inline">No Class Indicated</span> }
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <Button className="px-3 !w-full !h-[35px]" type="submit" isLoading={false} variant="outline" onClick={() => {setIsOpen(false);rejectAdmission() }}>
              Reject Admission
            </Button>
            <Button className="px-3 !w-full !h-[35px]" type="submit" isLoading={false} variant="primary" onClick={() => {setIsOpen(true); setFirstName(registrant.firstName); acceptAdmission()}}>
              Accept Admission
            </Button>      
          </div>
          {isOpen && admissionDialog()}
        </div>
        </>
    )

}


