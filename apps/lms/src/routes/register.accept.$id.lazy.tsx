import { makeUnauthenticatedRequest, useDialog, useLoading } from '@repo/utils';
import { createLazyFileRoute, Navigate, useNavigate } from '@tanstack/react-router'
import { useRegistrant } from '../hooks/registration.info.hooks';
import { Button, DialogContainer } from '@repo/ui';
import { toast } from 'sonner';

export const Route = createLazyFileRoute('/register/accept/$id')({
  component: AcceptRegistration,
})

function AcceptRegistration(){

    const { dialogIsOpen: admissionDialogIsOpen, toggleDialog: toggleAdmissionDialog } = useDialog()
  
    const { dialogIsOpen: acceptanceDialogIsOpen, toggleDialog: toggleAcceptanceDialog } = useDialog()
    const { isLoading: acceptanceIsLoading, toggleLoading: toggleAcceptanceIsLoading } = useLoading()
    
    
    const { dialogIsOpen: rejectionDialogIsOpen, toggleDialog: toggleRejectionDialog } = useDialog()
    const { isLoading: rejectionIsLoading, toggleLoading: toggleRejectionIsLoading } = useLoading()

    const { id } = Route.useParams();
    const { registrant } = useRegistrant(id);
   
    const navigation = useNavigate()

    function acceptAdmission(){
      toggleAcceptanceIsLoading()

      makeUnauthenticatedRequest(
        "get",
        `/api/v1/registrations/accept?_id=${id}`
      ).then( res => {
        if(res.status == 200 && res.data.success){
          console.log(res.data)
          toggleAcceptanceDialog()
          toggleAdmissionDialog()
          toast.success("Admission accepted successfully")
        } else {
          console.log(res.data.error.msg);
          toast.error(res.data.error.msg);
        }
      })
      .catch( err => {
        if(err.message){
          toast.error(`${err.message}`)
        } else {
          toast.error(`${err}`)
        }
      })
      .finally( () => {
        toggleAcceptanceIsLoading();
      })
  
    }

    function rejectAdmission(){
      toggleRejectionIsLoading()

      makeUnauthenticatedRequest(
        "get",
        `/api/v1/registrations/deny?_id=${id}`
      ).then( res => {
        if(res.status == 200 && res.data.success){
          console.log(res.data)
          toggleRejectionDialog()
          toast.success("Admission rejected successfully")
          setTimeout( ()=>{ navigation({ to: '/' }) }, 1500)
        } else {
          console.log(res.data.error.msg);
          toast.error(res.data.error.msg);
        }
      })
      .catch( err => {
        if(err.message){
          toast.error(`${err.message}`)
        } else {
          toast.error(`${err}`)
        }
      })
      .finally( ()=> {
        toggleRejectionIsLoading();
      })
    }


    function admissionDialog(){
  
      return (
        <DialogContainer
          isOpen={admissionDialogIsOpen}
          onClose={toggleAdmissionDialog}
          toggleOpen={toggleAdmissionDialog}
          title={`Admission Acceptance`}
          description={`Congratulations ${registrant.firstName }, you are in!`}
        >
          <div className="flex flex-col gap-4 sm:justify-between">
            <div className='w-full flex-1'>
              <div className=' w-full overflow-auto h-full flex flex-col rounded'>
              Check your email for your console credentials!
              </div>
            </div>
            <Button className="px-3 w-fit !h-[35px]" type="submit" variant="neutral" onClick={toggleAdmissionDialog}>
                Close
              </Button>
          </div>
        </DialogContainer>
      );
      }

    function ConfirmAcceptanceDialog(){
      return (
        <DialogContainer
        isOpen={acceptanceDialogIsOpen}
        onClose={toggleAcceptanceDialog}
        toggleOpen={toggleAcceptanceDialog}
        title={`Confirm Admission Acceptance`}
        description={`Are you sure you want to accept admission?`}
      >
        <div className="mt-8 ">
          <Button
            className="w-fit !h-[35px]"
            type="submit"
            isLoading={acceptanceIsLoading}
            onClick={acceptAdmission}
          >
            Accept Admission
          </Button>
        </div>
      </DialogContainer>
      )
    }

    function ConfirmRejectionDialog(){

      return (
        <DialogContainer
          isOpen={rejectionDialogIsOpen}
          onClose={toggleRejectionDialog}
          toggleOpen={toggleRejectionDialog}
          title={`Confirm Rejection`}
          description={`Are you sure you want to reject your admission?`}
        >
          <div className="mt-8 ">
            <Button
              className="w-fit !h-[35px]"
              type="submit"
              variant="danger"
              isLoading={rejectionIsLoading}
              onClick={rejectAdmission}
            >
              Reject Admission
            </Button>
          </div>
        </DialogContainer>
      )

    }
    
    return (
        <>
          <div className="flex flex-col gap-4 sm:justify-between">
            <div className='my-1 md:my-3'>
              <h2 className='text-blue-950 mb-2'>Accept admission</h2>
              <p>Please verify your details</p>
            </div>
            <div className='w-full flex-1 bg-blue-50 border-[1.5px] border-blue-900/60 rounded-sm shadow-sm'>
              <div className='bg-white w-full overflow-auto h-full flex flex-col rounded'>
                <div className="flex justify-between border-b-[1.5px] border-blue-900/60" >
                  <span className="text-md w-32 flex flex-shrink-0 items-center border-r-[1.5px] border-blue-900/60 p-2 font-light " >FULL NAME</span>
                  <span className="text-lg inline p-2" >
                    {registrant.firstName}
                    {registrant.otherNames == "" ? " " : " " + registrant.otherNames + " "}
                    {registrant.lastName}
                  </span>
                </div>
                <div className="flex justify-between border-b-[1.5px] border-blue-900/60" >
                  <span className="text-md w-32 flex flex-shrink-0 items-center border-r-[1.5px] p-2 border-blue-900/60 font-light " >GENDER</span>
                  <span className="text-lg inline p-2">{registrant.gender}</span>
                </div>
                <div className="flex justify-between border-b-[1.5px] border-blue-900/60" >
                  <span className="text-md w-32 flex flex-shrink-0 items-center border-r-[1.5px] p-2 border-blue-900/60 font-light " >EMAIL ADDRESS</span>
                  <span className="text-lg inline  p-2">{registrant.email}</span>
                </div>
                <div className="flex justify-between border-b-[1.5px] border-blue-900/60" >
                  <span className="text-md w-32 flex flex-shrink-0 items-center border-r-[1.5px] border-blue-900/60 p-2 font-light " >PHONE NUMBER</span>
                  <span  className="text-lg inline p-2">{registrant.phone}</span>
                </div>
                <div className="flex justify-between border-b-[1.5px] border-blue-900/60" >
                  <span className="text-md w-32 flex flex-shrink-0 items-center border-r-[1.5px] border-blue-900/60 p-2 font-light " >MODE OF CLASS</span>
                  <span className="text-lg inline p-2" >{registrant.modeOfClass}</span>
                </div>
                <div className="flex justify-between" >
                  <span className="text-md w-32 flex flex-shrink-0 items-center  border-r-[1.5px] border-blue-900/60 p-2 font-light " >CLASSES</span>
                  <span className="flex gap-2 p-2 flex-wrap justify-end">
                    {
                      registrant.approvedClasses?.length != 0 && registrant.approvedClasses?.map((course, idx) => {
                        return (
                          <span key={idx} className="text-lg inline" >
                            {course.name}
                          </span>
                        );
                      }
                    )}
                    { !registrant.approvedClasses?.length && <span className="text-lg  inline">No Class Indicated</span> }
                  </span>

                </div>
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <Button className="px-3 !w-full !h-[35px]" type="submit" variant="outline" onClick={() => {toggleRejectionDialog() }}>
                Reject Admission
              </Button>
              <Button className="px-3 !w-full !h-[35px]" type="submit" variant="primary" onClick={() => {toggleAcceptanceDialog();}}>
                Accept Admission
              </Button>
            </div>
            {admissionDialogIsOpen && admissionDialog()}
            {acceptanceDialogIsOpen && ConfirmAcceptanceDialog()}
            {rejectionDialogIsOpen && ConfirmRejectionDialog()}
          </div>
        </>
    )

}


