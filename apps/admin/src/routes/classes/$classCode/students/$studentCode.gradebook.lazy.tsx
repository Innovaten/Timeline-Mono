import {
    createLazyFileRoute,
    useRouterState,
    Outlet,
  } from "@tanstack/react-router";
  import { _getToken } from "@repo/utils";
  import { useGrades } from "../../../../hooks"

export const Route = createLazyFileRoute('/classes/$classCode/students/$studentCode/gradebook')({
  component: Gradebook
})


  function Gradebook() {
    const routerState = useRouterState();
    const { classCode, studentCode } = Route.useParams();
    if (routerState.location.pathname !== `/classes/${classCode}/students/${studentCode}/gradebook`) {
      return <Outlet />;
    }
  
   const { isLoading, assignmentGrades, quizGrades } = useGrades(true,studentCode,false,classCode)
  
    return (
      <>
        <div className="flex flex-col w-full h-[calc(100vh-6rem)] sm:h-full flex-1">
          {isLoading && (
            <div className="w-full h-full m-auto mt-4">
              <div className="w-5 aspect-square m-auto rounded-full border-[1px] border-t-blue-500 animate-spin"></div>
            </div>
          )}
  
          {!isLoading && (
            <>
              <div className="flex flex-col gap-2 flex-1">
                <div>
                  <h3 className="text-blue-800 mb-3">Student Gradebook:{" "}
                   {
                    (assignmentGrades.length > 0 && assignmentGrades[0].submittedBy.firstName + " " + assignmentGrades[0].submittedBy.lastName) ??
                    (quizGrades.length > 0 && quizGrades[0].submittedBy.firstName + " " + quizGrades[0].submittedBy.lastName) ?? 
                    ""
                   }
                    {" " + studentCode}</h3>
                  {assignmentGrades && assignmentGrades.length > 0 && (
                      <>
                      <text className=" text-blue-800 mb-1 text-lg">Assignments</text>
                    <div className="w-full flex-1 mt-4 bg-blue-50 p-1 rounded-sm shadow mb-6">
                      <div className="bg-white w-full overflow-auto h-full flex flex-col rounded">
                        <div className="w-full text-blue-700 py-2 px-1 sm:px-3 bg-blue-50 border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm">
                          <div className="flex items-center gap-4">
                            <span className="flex-1 font-normal truncate">
                              TITLE
                            </span>
                          </div>
                          <div className="flex gap-4 items-center font-light">
                            <span className="w-[150px] hidden sm:flex justify-end">
                              Score
                            </span>
                          </div>
                        </div>
                        {assignmentGrades.map((grade, idx) => {
                          return (
                            <div className="cursor-pointer w-full text-blue-700 py-2 px-1 sm:px-3 bg-white border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm hover:bg-blue-200/10">
                              <div className="flex items-center gap-4">
                                <span className="flex-1 font-normal truncate">
                                  {grade.assignment.title}
                                </span>
                              </div>
                              <div className="flex gap-4 items-center font-light">
                                <span className="w-[150px] hidden sm:flex justify-end">
                                  {grade.score} /{" "}
                                  {grade.assignment.maxScore}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    </>
                  )}
                  {assignmentGrades.length == 0 &&(
                  <>
                  <text className=" text-blue-800 mb-1 text-lg">Assignments</text>
                <div className="w-full flex-1 mt-4 bg-blue-50 p-1 rounded-sm shadow mb-6">
                <div className="bg-white w-full overflow-auto h-full flex flex-col rounded">
                  <div className="w-full text-blue-700 py-2 px-1 sm:px-3 bg-blue-50 border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm">
                    <div className="flex items-center gap-4">
                      <span className="flex-1 font-normal truncate">
                        TITLE
                      </span>
                    </div>
                    <div className="flex gap-4 items-center font-light">
                      <span className="w-[150px] hidden sm:flex justify-end">
                        Score
                      </span>
                    </div>
                  </div>
                      <div className="cursor-pointer w-full text-blue-700 py-2 px-1 sm:px-3 bg-white border-b-[0.5px] border-b-blue-700/40 flex items-center gap-2 rounded-sm hover:bg-blue-200/10">
                     <p className="flex-1 font-normal truncate text-center">No Assignment Grades</p>
                      </div>
                </div>
              </div>
              </>
                  )}
                  {quizGrades && quizGrades.length > 0 && (
                      <>
                      <text className=" text-blue-800 mb-1 text-lg">Quizzes</text>
                    <div className="w-full flex-1 mt-4 bg-blue-50 p-1 rounded-sm shadow">
                      <div className="bg-white w-full overflow-auto h-full flex flex-col rounded">
                        <div className="w-full text-blue-700 py-2 px-1 sm:px-3 bg-blue-50 border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm">
                          <div className="flex items-center gap-4">
                            <span className="flex-1 font-normal truncate">
                              TITLE
                            </span>
                          </div>
                          <div className="flex gap-4 items-center font-light">
                            <span className="w-[150px] hidden sm:flex justify-end">
                              Score
                            </span>
                          </div>
                        </div>
                        {quizGrades.map((grade, idx) => {
                          return (
                            <div className="cursor-pointer w-full text-blue-700 py-2 px-1 sm:px-3 bg-white border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm hover:bg-blue-200/10">
                              <div className="flex items-center gap-4">
                                <span className="flex-1 font-normal truncate">
                                  {grade.assignment.title}
                                </span>
                              </div>
                              <div className="flex gap-4 items-center font-light">
                                <span className="w-[150px] hidden sm:flex justify-end">
                                  {grade.score} /{" "}
                                  {grade.assignment.maxScore}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    </>
                  )}
              
                </div>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-2 sm:justify-between sm:items-end "></div>
              </div>
            </>
          )}
  
          {quizGrades.length == 0 && (
            <>
            <text className=" text-blue-800 mb-1 text-lg">Quizzes</text>
                <div className="w-full flex-1 mt-4 bg-blue-50 p-1 rounded-sm shadow mb-6">
                <div className="bg-white w-full overflow-auto h-full flex flex-col rounded">
                  <div className="w-full text-blue-700 py-2 px-1 sm:px-3 bg-blue-50 border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm">
                    <div className="flex items-center gap-4">
                      <span className="flex-1 font-normal truncate">
                        TITLE
                      </span>
                    </div>
                    <div className="flex gap-4 items-center font-light">
                      <span className="w-[150px] hidden sm:flex justify-end">
                        Score
                      </span>
                    </div>
                  </div>
                      <div className="cursor-pointer w-full text-blue-700 py-2 px-1 sm:px-3 bg-white border-b-[0.5px] border-b-blue-700/40 flex items-center gap-2 rounded-sm hover:bg-blue-200/10">
                     <p className="flex-1 font-normal truncate text-center">No Quiz Grades</p>
                      </div>
                </div>
              </div>
              </>
          )}
  
          {!isLoading && !assignmentGrades && !quizGrades && (
            <div className="mt-2 flex gap-2">
              <h3 className="text-blue-800">404 - Could not find Grades</h3>
            </div>
          )}
        </div>
      </>
    );
  }
  