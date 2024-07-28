import { Button, DialogContainer } from "@repo/ui";
import { createLazyFileRoute } from "@tanstack/react-router";
import {
  useRegistrants,
  useRegistrantsFilter,
} from "../hooks/registrants.hook";
import { _getToken, cn, makeAuthenticatedRequest, useDialog, useLoading } from "@repo/utils";
import { toast } from "sonner";
import { useState } from "react";
import { FunnelIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { IRegistrationDoc } from "@repo/models";
import { useClasses, useCompositeFilterFlag } from "../hooks";
import { useLMSContext } from "../app";

export const Route = createLazyFileRoute("/registrations")({
  component: RegistrationsPage,
});

function RegistrationsPage() {

  
  const { user } = useLMSContext() 

  const { dialogIsOpen: newStudentIsSelected, toggleDialog: toggleNewStudentIsSelected} = useDialog();
  const { filter, filterOptions, changeFilter, filterChangedFlag } =
    useRegistrantsFilter();
  const { dialogIsOpen: refreshFlag, toggleDialog: toggleRefresh } = useDialog()

  const { compositeFilterFlag, manuallyToggleCompositeFilterFlag } = useCompositeFilterFlag([ refreshFlag, filterChangedFlag ])
  const {
    isLoading: registrantsIsLoading,
    registrants,
    count: registrantsCount,
  } = useRegistrants(compositeFilterFlag, {...filter});
  const { dialogIsOpen: filterIsShown, toggleDialog: toggleFiltersAreShown } = useDialog();
  const { dialogIsOpen: classesApprovalIsOpen, toggleDialog: toggleClassesApprovalDialog } = useDialog();
  
  const { isLoading: approvalIsLoading, toggleLoading: toggleApprovalIsLoading } = useLoading()

  const { classes: classesUpForApproval, } = useClasses(newStudentIsSelected, { user });
  let [approvedClasses, setApprovedClasses ] = useState<Array<string>>([]);

  const [isOpen, setIsOpen] = useState(false);
  const [registrantId, setRegistrantId] = useState<any>();
  const [confirmationReject, setConfirmationReject] = useState(false);
  const [registrant, setRegistrant] = useState<Partial<IRegistrationDoc>>({
    firstName: "",
    otherNames: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    modeOfClass: "",
    classes: [],
  });

  function approveRegistrant(registrantId: any) {
    toggleApprovalIsLoading()
    makeAuthenticatedRequest(
      "get",
      `/api/v1/registrations/approve?_id=${registrantId}&approved-classes=${JSON.stringify(approvedClasses)}`,
    )
      .then((res) => {
        if (res.status == 200 && res.data.success) {
          toggleClassesApprovalDialog();
          manuallyToggleCompositeFilterFlag()
          toast.success(
            <p>
              Student approved successfully.
              <br />A confirmation will be sent via email.
            </p>
          );
        } else {
          toast.error(`${res.data.error.msg}`);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(`${err}`);
      })
      .finally(() => {
        toggleApprovalIsLoading();
      })
  }

  function rejectRegistrant(registrantId: any) {
    makeAuthenticatedRequest(
      "get",
      `/api/v1/registrations/reject?_id=${registrantId}`,
    )
      .then((res) => {
        manuallyToggleCompositeFilterFlag()
        if (res.status == 200 && res.data.success) {
          toast.success("Student rejected successfully");
        } else {
          toast.error(`${res.data.error.msg}`);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(`${err}`);
      });
  }


  function ApprovalDiagBox() {
    const {
      firstName,
      lastName,
      otherNames,
      email,
      phone,
      gender,
      classes,
      modeOfClass,
    } = registrant;

    return (
      <DialogContainer
        isOpen={isOpen}
        onClose={()=>setIsOpen(false)}
        toggleOpen={() => setIsOpen(!isOpen)}
        title={`Approve Registration`}
        description={`Confirm the registration of ${firstName + " " + lastName}`}
      >
        <div className="flex flex-col gap-4 sm:justify-between">
          <div className='w-full flex-1 border-[1.5px] border-blue-900/60 rounded-sm shadow-sm'>
            <div className='bg-white w-full overflow-auto h-full flex flex-col rounded'>
              <div className="flex justify-between border-b-[1.5px] border-blue-900/60" >
                <span className="text-md w-32 flex flex-shrink-0 items-center border-r-[1.5px] border-blue-900/60 p-2 font-light " >FULL NAME</span>
                <span className="text-lg inline p-2" >
                  {firstName}
                  {otherNames == "" ? " " : " " + otherNames + " "}
                  {lastName}
                </span>
              </div>
              <div className="flex justify-between border-b-[1.5px] border-blue-900/60" >
                <span className="text-md w-32 flex flex-shrink-0 items-center border-r-[1.5px] p-2 border-blue-900/60 font-light " >GENDER</span>
                <span className="text-lg inline p-2">{gender}</span>
              </div>
              <div className="flex justify-between border-b-[1.5px] border-blue-900/60" >
                <span className="text-md w-32 flex flex-shrink-0 items-center border-r-[1.5px] p-2 border-blue-900/60 font-light " >EMAIL ADDRESS</span>
                <span className="text-lg inline  p-2">{email}</span>
              </div>
              <div className="flex justify-between border-b-[1.5px] border-blue-900/60" >
                <span className="text-md w-32 flex flex-shrink-0 items-center border-r-[1.5px] border-blue-900/60 p-2 font-light " >PHONE NUMBER</span>
                <span  className="text-lg inline p-2">{phone}</span>
              </div>
              <div className="flex justify-between border-b-[1.5px] border-blue-900/60" >
                <span className="text-md w-32 flex flex-shrink-0 items-center border-r-[1.5px] border-blue-900/60 p-2 font-light " >MODE OF CLASS</span>
                <span className="text-lg inline p-2" >{modeOfClass}</span>
              </div>
              <div className="flex justify-between" >
                <span className="text-md w-32 flex flex-shrink-0 items-center  border-r-[1.5px] border-blue-900/60 p-2 font-light " >CLASSES</span>
                <span className="flex gap-2 p-2 flex-wrap justify-end">
                  {classes?.length && classes.map((course, idx) => {
                    return (
                      <span key={idx} className="text-lg inline" >
                        {course}
                      </span>
                    );
                  })}
                  { !classes?.length && <span className="text-lg text-blue-600 inline">No Class Indicated</span> }
                </span>

              </div>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <Button className="px-3 !w-full !h-[35px]" type="submit" isLoading={false} variant="outline" onClick={() => {setIsOpen(false); setConfirmationReject(true)  }}>
              Reject Registrant
            </Button>
            <Button className="px-3 !w-full !h-[35px]" type="submit" isLoading={false} variant="primary" onClick={() => {setIsOpen(false); toggleClassesApprovalDialog() }}>
              Approve Registrant
            </Button>
          </div>

        </div>
      </DialogContainer>
    );
  }

  function ApproveClassesDialog(){

    return (
      <DialogContainer 
        isOpen={classesApprovalIsOpen} 
        toggleOpen={toggleClassesApprovalDialog} 
        title={`Approve classes for ${registrant.firstName} ${registrant.lastName}`} 
        description="Kindly select the classes the registrant is allowed to access"
      >
        <div className="flex flex-col gap-4 sm:justify-between min-h-[200px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-48 overflow-y-auto mt-4">
            {
              classesUpForApproval.map((c, idx) => <div key={idx}
                className={ cn(
                  'flex gap-2 items-center bg-blue-50 rounded p-2 border-blue-100 hover:border-blue-700/40 cursor-pointer duration-150 border-[1.5px]', 
                  approvedClasses.includes(c._id as string) ? "border-blue-700/40 bg-blue-700 text-white" : "border-bg-blue-100/40",
                )}
                onClick={
                  () =>{ setApprovedClasses( prev => [
                    ...(prev.includes(c._id as string) ? approvedClasses.filter( d => d != c._id as string) : [...approvedClasses, c._id as string ] )
                  ]); }
                }
              >
                <div className='flex flex-col'>
                  <p>{c.name}</p>
                  <small>{c.code}</small>
                </div>
              </div>)
            }
          </div>
          <div className="flex flex-row gap-4">
              <Button className="px-3 !w-full !h-[35px]" type="submit" isLoading={false} variant="outline" onClick={() => {setIsOpen(true); toggleClassesApprovalDialog() }}>
                Back to details
              </Button>
              <Button className="px-3 !w-full !h-[35px]" type="submit" isLoading={approvalIsLoading} isDisabled={approvedClasses.length < 1} variant="primary" onClick={() => {approveRegistrant(registrantId)}}>
                Approve Registrant
              </Button>
            </div>
        </div>

      </DialogContainer>
    )
  }

  function RejectBox() {
    return (
      <DialogContainer
        isOpen={confirmationReject}
        onClose={()=>setConfirmationReject(false)}
        toggleOpen={() => setConfirmationReject(!confirmationReject)}
        title={`Reject Registration`}
        description={`Are you sure you want to reject ${registrant.firstName + " " + registrant.lastName} ?`}
      >
        <div className="mt-8 ">
          <Button
            className="w-fit !h-[35px]"
            type="submit"
            variant="danger"
            isLoading={false}
            onClick={() => {
              setConfirmationReject(false);
              rejectRegistrant(registrantId);
            }}
          >
            Reject Registrant
          </Button>
        </div>
      </DialogContainer>
    );  
  }

  return (
    <div className="flex flex-col w-full h-[calc(100vh-6rem)] sm:h-full">
      <div className="mt-2 flex h-fit justify-between items-center">
        <h3 className="text-blue-800">Registrations</h3>
      </div>
      <div className="w-full mt-3 flex gap-4">
        <Button
            onClick={toggleFiltersAreShown}
            variant='outline'
            className='!h-[35px] px-2 flex items-center gap-2'
        >
            <FunnelIcon className='w-4' />
            { filterIsShown ? "Close" : "Show"} Filters    
        </Button>

          { filterIsShown &&
              <select
                className="text-base text-blue-600 border-[1.5px] focus:outline-blue-300 focus:ring-0  rounded-md border-slate-300 shadow-sm h-[35px] px-2"
                onChange={(e) => {
                  // @ts-ignore
                  changeFilter(e.target.value);
                }}
              >
              {
                filterOptions.map((f, idx) => {
                  return (
                    <option key={idx} value={f}>
                      {f}
                    </option>
                  );
                })
              }
            </select> 

          }
          <div className='flex flex-col gap-2 justify-end'>
              <Button className='!h-[35px] px-2' variant='outline' onClick={()=> changeFilter("Pending")}> <ArrowPathIcon className='w-4' /> </Button>
          </div>
      </div>
      <div className="mt-2 w-full flex flex-col flex-1 gap-2 text-blue-600">
        <div className="w-full min-h-[350px] bg-blue-50 p-1 flex-1 rounded-sm shadow mt-2">
          <div className="bg-white w-full h-full overflow-auto rounded">
            <div className = 'w-full text-blue-700 py-2 px-1 sm:px-3 bg-blue-50 border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm'>
                <div className='flex items-center gap-4'>
                    <span  className='w-[80px] hidden sm:inline'>CODE</span>
                    <span className='flex-1 font-normal truncate'>NAME</span>
                </div>
                <div className='flex gap-4 items-center font-light'>
                    <span className='w-[100px] flex justify-end'>STATUS</span>
                    <span className='w-[120px] hidden sm:flex justify-end'>DATE CREATED</span>
                    <span className='w-[150px] hidden sm:flex justify-end'></span>
                </div>
            </div>
            {registrantsIsLoading && (
              <div className="w-full m-auto mt-4">
                <div className="w-5 aspect-square m-auto rounded-full border-[1px] border-t-blue-500 animate-spin"></div>
              </div>
            )}
            {!registrantsIsLoading &&
              registrants.map((registrant, idx) => {
                return (
                  <div
                    key={idx}
                    className="cursor-pointer w-full text-blue-700 py-2 px-1 sm:px-3 bg-white border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm hover:bg-blue-200/10"
                    onClick={() => {
                      setRegistrantId(registrant._id);
                      setRegistrant(registrant);
                      toggleNewStudentIsSelected();
                      setIsOpen(true)
                    }}
                  >
                     <small className='font-light hidden sm:inline w-[80px]'>{registrant.code}</small>
                    <h5 className="flex-1 font-normal truncate">
                      {registrant.firstName + " " + registrant.lastName}
                    </h5>
                    <div className="flex gap-4 items-center font-light">
                      <span className='w-[100px] flex items-center gap-2 justify-end'>
                        {registrant.status}
                        <span className={cn(
                                  "w-2 h-2 rounded-full border-[1px] ",
                                  registrant.status == 'Pending' ? "border-yellow-600" : "",
                                  registrant.status == 'Approved' ? "border-green-600" : "",
                                  registrant.status == 'Rejected' ? "border-red-600" : "",
                                  registrant.status == 'Accepted' ? "bg-green-600 border-green-600" : "",
                                  registrant.status == 'Denied' ? "bg-red-600 border-red-600" : "",

                                )}></span>
                      </span>
                      <span className='w-[120px] hidden sm:flex justify-end'>
                        {new Date(registrant.updatedAt).toLocaleTimeString()}
                      </span>
                      <span className='w-[150px] hidden sm:flex justify-end'>
                        {new Date(registrant.updatedAt).toDateString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            {registrantId && <ApprovalDiagBox />}
            {confirmationReject && <RejectBox />}
            <ApproveClassesDialog />
          </div>
        </div>
      </div>
      <div className="flex justify-end text-blue-700 mt-2 pb-2">
        <p>
          Showing <span className="font-semibold">{registrants.length}</span> of{" "}
          <span className="font-semibold">{registrantsCount}</span>
        </p>
      </div>
    </div>
  );
}
