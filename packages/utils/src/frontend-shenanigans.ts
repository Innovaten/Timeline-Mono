import { RefObject, SetStateAction, Dispatch, useState } from "react";
import { toast } from "sonner";

export function fadeParent(
  parentRef: RefObject<HTMLDivElement | HTMLSpanElement>,
  animationTime = 500
) {
  parentRef!.current!.style.animation = `fadeInOut forwards ease-in-out ${animationTime / 1000}s`;
  setTimeout(() => {
    parentRef!.current!.style.animation = "";
  }, animationTime);
}


export function MultiPage(
  parentRef: RefObject<HTMLDivElement | HTMLSpanElement>,
  pages: Record<string, RefObject<HTMLDivElement | HTMLSpanElement>>  
) {
  const pageKeysArr = Object.keys(pages);

  const [ currentPageIndex, setCurrentPageIndex] = useState(0);
  const currentPage = pages[pageKeysArr[currentPageIndex]];

  function goTo(page: string){
    const targetPageIndex = pageKeysArr.findIndex((p) => p == page )
    if(targetPageIndex != -1){
      fadeParent(parentRef)
      setTimeout(() => {
        setCurrentPageIndex(targetPageIndex);
      }, 255)
    }
  }

  function goToNext(){
    
    fadeParent(parentRef);
    setTimeout(() => {
      setCurrentPageIndex(prev => prev + 1 < pageKeysArr.length ? prev + 1 : prev);
    }, 255)
  }

  function goToPrevious(){
    
    fadeParent(parentRef);
    setTimeout(() => {
      setCurrentPageIndex(prev => prev - 1 >= 0 ? prev - 1 : prev);
    }, 255)
  }

  function goToStart(){
    fadeParent(parentRef);
    setTimeout(() => {
      setCurrentPageIndex(0);
    }, 255)
  }

  function goToEnd(){
    fadeParent(parentRef);
    setTimeout(() => {
      setCurrentPageIndex(pageKeysArr.length - 1);
    }, 255)
  }


  return {
    currentPage,
    goTo,
    goToPrevious,
    goToNext,
    goToStart,
    goToEnd
  }

}

export function copyToClipboard(text: string){

  navigator.clipboard.writeText(text).then(() => {
    toast.success("Copied successfully")
  }).catch((err) => {
    toast.error('An error occurred while copying to clipboard')
  })

}