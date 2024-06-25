import { Button, DialogContainer } from "@repo/ui";
import { createLazyFileRoute } from "@tanstack/react-router";
import {
  useRegistrants,
  useRegistrantsFilter,
} from "../hooks/registrants.hook";
import { _getToken, makeAuthenticatedRequest } from "@repo/utils";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createLazyFileRoute("/registrations")({
  component: RegistrationsPage,
});

function RegistrationsPage() {
  const { filter, filterOptions, changeFilter, filterChangedFlag } =
    useRegistrantsFilter();
  const {
    isLoading: registrantsIsLoading,
    registrants,
    count: registrantsCount,
  } = useRegistrants(filterChangedFlag, filter);

  const [isOpen, setIsOpen] = useState(false);
  const [registrantId, setRegistrantId] = useState<any>();
  const [confirmationReject, setConfirmationReject] = useState(false);
  const [registrant, setRegistrant] = useState<RegistrationObject>({
    firstName: "",
    otherNames: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    modeOfClass: "",
    courses: [],
  });

 
  function toggleOpenApproval(registrantId: any) {
    setRegistrantId(registrantId);
    setIsOpen(!isOpen);
  }
  function toggleOpenRejection(){
    setConfirmationReject(!confirmationReject)
  }

  function handleCloseApproval() {
    setIsOpen(false);
  }

  function handleCloseRejection(){
    setConfirmationReject(false)
  }

  function postAcceptedRegistrant() {
    handleCloseApproval();
    acceptRegistrant(registrantId);
  }

  function handleReject() {
    setIsOpen(false);
    setConfirmationReject(true)  
  }

  function postRejectedRegistrant() {
    handleCloseRejection();
    rejectRegistrant(registrantId);
  }

  function acceptRegistrant(registrantId: any) {
    console.log(registrantId);
    makeAuthenticatedRequest(
      "get",
      `/api/v1/registrations/approve?_id=${registrantId}`,
      {
        authToken: _getToken(),
      }
    )
      .then((res) => {
        console.log(res);
        if (res.status == 200 && res.data.success) {
          toast.success(
            <p>
              Student registered successfully.
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
      });
  }

  function rejectRegistrant(registrantId: any) {
    console.log(registrantId);
    makeAuthenticatedRequest(
      "get",
      `/api/v1/registrations/reject?_id=${registrantId}`,
      {
        authToken: _getToken(),
      }
    )
      .then((res) => {
        console.log(res);
        if (res.status == 200 && res.data.success) {
          toast.success(
            <p>
              Student has been rejected.
            </p>
          );
        } else {
          toast.error(`${res.data.error.msg}`);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(`${err}`);
      });
  }

  interface RegistrationObject {
    firstName: string;
    otherNames: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    modeOfClass: string;
    courses: string[];
  }

  function ApprovalDiagBox() {
    const {
      firstName,
      lastName,
      otherNames,
      email,
      phone,
      gender,
      courses,
      modeOfClass,
    } = registrant;

    return (
      <DialogContainer
        isOpen={isOpen}
        onClose={handleCloseApproval}
        toggleOpen={() => toggleOpenApproval(registrantId)}
        title={`Apporve ${firstName + " " + lastName}'s registration`}
        description={`Confirm the registration of ${firstName + " " + lastName}`}
      >
        <div className="flex-col gap-4 sm:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <p className="text-lg inline font-medium">Full Name:</p>
              <p className="text-lg text-blue-600 inline">
                {firstName}
                {otherNames == "" ? " " : " " + otherNames + " "}
                {lastName}
              </p>
            </div>
            <div className="flex gap-2">
              <p className="text-lg inline font-medium">Gender:</p>
              <p className="text-lg text-blue-600 inline">{gender}</p>
            </div>
            <div className="flex gap-2">
              <p className="text-lg inline font-medium">Email Address:</p>
              <p className="text-lg text-blue-600 inline">{email}</p>
            </div>
            <div className="flex gap-2">
              <p className="text-lg inline font-medium">Phone Number:</p>
              <p className="text-lg text-blue-600 inline">{phone}</p>
            </div>
            <div className="flex gap-2">
              <p className="text-lg inline font-medium">Mode of Class:</p>
              <p className="text-lg text-blue-600 inline">{modeOfClass}</p>
            </div>
            <div className="flex gap-2">
              <p className="text-lg inline font-medium">Courses:</p>
              {courses.map((course, idx) => {
                return (
                  <p key={idx} className="text-lg text-blue-600 inline">
                    {course}
                  </p>
                );
              })}
            </div>
            <div className="flex flex-row space-x-8">
            <Button className="px-3 w-56 !h-[35px]" type="submit" isLoading={false} onClick={() => {postAcceptedRegistrant()}}>
              Add Registrant
            </Button>
            <Button className="px-3 w-56 !h-[35px]" type="submit" isLoading={false} variant="danger" onClick={() => {handleReject()}}>
              Reject Registrant
            </Button>
            </div>
          </div>
        </div>
      </DialogContainer>
    );
  }

  function RejectBox() {
    return (
      <DialogContainer
        isOpen={confirmationReject}
        onClose={handleCloseRejection}
        toggleOpen={() => toggleOpenRejection()}
        title={`Reject ${registrant.firstName + " " + registrant.lastName}'s registration`}
        description={`Confirm the rejection of ${registrant.firstName + " " + registrant.lastName}`}
      >
        <div className="flex-col gap-4 sm:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <p className="text-lg inline font-medium">Full Name:</p>
              <p className="text-lg text-blue-600 inline">
                {registrant.firstName + " " + registrant.lastName}
              </p>
            </div>
              <Button
                className="px-3 !h-[35px]"
                type="submit"
                variant="danger"
                isLoading={false}
                onClick={() => {
                  postRejectedRegistrant();
                }}
              >
                Reject Registrant
              </Button>
          </div>
        </div>
      </DialogContainer>
    );  
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="mt-2 flex h-fit justify-between items-center">
        <h2 className="text-blue-800">Registrations</h2>
      </div>
      <div className="w-full mt-3">
        <select
          className="text-base text-blue-600 border-[1.5px] focus:outline-blue-300 focus:ring-0  rounded-md border-slate-300 shadow-sm h-[35px] px-2"
          onChange={(e) => {
            // @ts-ignore
            changeFilter(e.target.value);
          }}
        >
          {filterOptions.map((f, idx) => {
            return (
              <option key={idx} value={f}>
                {f}
              </option>
            );
          })}
        </select>
      </div>
      <div className="mt-8 w-full flex flex-col gap-2 text-blue-600">
        <h4>Latest Registrations</h4>
        <div className="w-full min-h-[350px] bg-blue-50 p-1 rounded-sm shadow-sm mt-2">
          <div className="bg-white w-full h-full flex flex-col gap-2 rounded p-1">
            {registrantsIsLoading && (
              <div className="w-full h-full m-auto">
                <div className="w-5 aspect-square m-auto rounded-full border-[1px] border-t-blue-500 animate-spin"></div>
              </div>
            )}
            {!registrantsIsLoading &&
              registrants.map((registrant, idx) => {
                return (
                  <div
                    key={idx}
                    className="w-full py-2 px-3 bg-blue-50 flex justify-between items-center gap-2 rounded-sm hover:bg-blue-600/10"
                    onClick={() => {
                      toggleOpenApproval(registrant._id);
                      setRegistrant(registrant);
                    }}
                  >
                    <h5 className="flex-1 font-normal truncate">
                      {registrant.firstName + " " + registrant.lastName}
                    </h5>
                    <div className="flex gap-4 items-center font-light">
                      <span>
                        {new Date(registrant.updatedAt).toLocaleTimeString()}
                      </span>
                      <span>
                        {new Date(registrant.updatedAt).toDateString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            {registrantId && <ApprovalDiagBox />}
            {confirmationReject && <RejectBox />}
          </div>
        </div>
      </div>
      <div className="flex justify-end text-blue-700 mt-2">
        <p>
          Showing <span className="font-semibold">{registrants.length}</span> of{" "}
          <span className="font-semibold">{registrantsCount}</span>
        </p>
      </div>
    </div>
  );
}
