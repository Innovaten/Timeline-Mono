import {
  createLazyFileRoute,
  useRouterState,
  Outlet,
  Link,
} from "@tanstack/react-router";
import { _getToken } from "@repo/utils";
import { useLMSContext } from "../../../../app";
import { useGrades } from "../../../../hooks/gradebook.hooks";

export const Route = createLazyFileRoute(
  "/classes/$classCode/gradebook/"
)({
  component: Gradebook,
});

function Gradebook() {
  const routerState = useRouterState();
  const { classCode } = Route.useParams();
  const { user } = useLMSContext();

  if (routerState.location.pathname !== `/classes/${classCode}/gradebook`) {
    return <Outlet />;
  }
  const temp = [
    {
        assignment: {
          title: "Assignment 1",
          maxScore: 16,
          code: "ASMNT00000001"
        },
        score: 16,
      },
    {
        assignment: {
          title: "Assignment 2",
          maxScore: 20,
           code: "ASMNT00000002"
        },
        score: 18,
      },
    {
        assignment: {
          title: "Assignment 3",
          maxScore: 25,
           code: "ASMNT00000003"
        },
        score: 22,
      },
    {
        assignment: {
          title: "Assignment 4",
          maxScore: 30,
           code: "ASMNT00000004"
        },
        score: 28,
      },
    {
        assignment: {
          title: "Assignment 5",
          maxScore: 15,
           code: "ASMNT00000005"
        },
        score: 15,
      },
  ];

  const temp2 = [
    {
        quiz: {
          title: "Quiz 1",
          maxScore: 16,
           code: "QUIZ00000001"
        },
        score: 16,
      },
    {
        quiz: {
          title: "Quiz 2",
          maxScore: 10,
          code: "QUIZ00000002"
        },
        score: 9,
      },
    {
        quiz: {
          title: "Quiz 3",
          maxScore: 12,
          code: "QUIZ00000003"
        },
        score: 11,
    },
    {
        quiz: {
          title: "Quiz 4",
          maxScore: 8,
          code: "QUIZ00000004"
        },
        score: 8,
      },
    {
        quiz: {
          title: "Quiz 5",
          maxScore: 20,
          code: "QUIZ00000005"
        },
        score: 19,
      },
  ];

  //const { isLoading, assignmentGrades } = useGrades(true, user?._id?? "",true,classCode)
  const isLoading = false;

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
                <h3 className="text-blue-800 mb-3">Class Gradebook</h3>
                {temp && (
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
                      {temp.map((grade, idx) => {
                        return (
                            <Link 
                            to={`/classes/${classCode}/assignments/${grade.assignment.code}`}
                            key={idx}
                          >
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
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                  </>
                )}
                {temp.length == 0 && (
                  <div className="mt-2 flex gap-2">
                    <h3 className="text-blue-800">No Assignment Grades</h3>
                  </div>
                )}
                {temp2 && (
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
                      {temp2.map((grade, idx) => {
                        return (
                            <Link 
                            to={`/classes/${classCode}/assignments/${grade.quiz.code}`}
                            key={idx}
                            >
                          <div className="cursor-pointer w-full text-blue-700 py-2 px-1 sm:px-3 bg-white border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm hover:bg-blue-200/10">
                            <div className="flex items-center gap-4">
                              <span className="flex-1 font-normal truncate">
                                {grade.quiz.title}
                              </span>
                            </div>
                            <div className="flex gap-4 items-center font-light">
                              <span className="w-[150px] hidden sm:flex justify-end">
                                {grade.score} /{" "}
                                {grade.quiz.maxScore}
                              </span>
                            </div>
                          </div>
                          </Link>
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

        {temp2.length == 0 && (
          <div className="mt-2 flex gap-2">
            <h3 className="text-blue-800">No Quiz Grades</h3>
          </div>
        )}

        {!isLoading && !temp && !temp2 && (
          <div className="mt-2 flex gap-2">
            <h3 className="text-blue-800">404 - Could not find Grades</h3>
          </div>
        )}
      </div>
    </>
  );
}
