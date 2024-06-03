import { RefObject } from "react";

export function fadeParent(
  parentRef: RefObject<HTMLDivElement | HTMLSpanElement>,
  animationTime = 500
) {
  parentRef!.current!.style.animation = `fadeInOut forwards ease-in-out ${animationTime / 1000}s`;
  setTimeout(() => {
    parentRef!.current!.style.animation = "";
  }, animationTime);
}

export function fadeParentAndReplacePage(
  parentRef: RefObject<HTMLDivElement | HTMLSpanElement>,
  currentRef: RefObject<HTMLDivElement | HTMLSpanElement>,
  nextRef: RefObject<HTMLDivElement | HTMLSpanElement>,
  displayValue: "flex" | "block" | "grid" | "inline"
) {
  fadeParent(parentRef);
  setTimeout(() => {
    currentRef!.current!.style.display = "none";
    nextRef!.current!.style.display = displayValue;
  }, 250);
}
