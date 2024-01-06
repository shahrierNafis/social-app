import React, { ReactNode, RefObject, useRef } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

function CardSlider({
  children,
  title,
}: {
  children: ReactNode;
  title?: ReactNode;
}) {
  const slider: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const slideLeft = () => {
    if (slider?.current) slider.current.scrollLeft = -500;
  };

  const slideRight = () => {
    if (slider?.current) slider.current.scrollLeft = +500;
  };
  return (
    <div
      id="main-slider-container"
      className="w-[100%] bg-zinc-900 p-2 mt-10 relative flex items-center"
    >
      <MdChevronLeft
        size={40}
        className="absolute left-0 z-10  md:hover:opacity-100 h-[100%] active:bg-zinc-700  md:hover:bg-zinc-700"
        onClick={slideLeft}
      />
      <div className="w-full">
        {title && title}
        <div
          ref={slider}
          id="slider"
          className="w-full h-full whitespace-nowrap !overflow-x-scroll no-scrollbar scroll-smooth	"
        >
          {children}
        </div>
      </div>
      <MdChevronRight
        size={40}
        className=" absolute right-0  md:hover:opacity-100 h-[100%] active:bg-zinc-700  md:hover:bg-zinc-700"
        onClick={slideRight}
      />
    </div>
  );
}

export default CardSlider;
