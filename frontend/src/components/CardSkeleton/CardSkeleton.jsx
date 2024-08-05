import React from "react";
import { skeletonSVG } from "../../utils/constants";

const CardSkeleton = () => {
  return (
    <div className="p-4 w-full max-w-96 sm:max-w-full">
      <div className="bg-purple-100  overflow-hidden animate-pulse p-3 rounded-2xl">
        <div className="flex justify-center items-center h-[200px] text-gray-700 bg-gray-300 bg-clip-border rounded-xl">
          {skeletonSVG}
        </div>
        <div className="p-2">
          <div className="block w-56 h-3 mb-2 font-sans text-5xl antialiased font-semibold leading-tight tracking-normal bg-gray-300 rounded-full text-inherit">
            &nbsp;
          </div>
          <div className="block w-full h-2 mb-1 font-sans text-base antialiased font-light leading-relaxed bg-gray-300 rounded-full text-inherit">
            &nbsp;
          </div>
          <div className="block w-full h-2 mb-1 font-sans text-base antialiased font-light leading-relaxed bg-gray-300 rounded-full text-inherit">
            &nbsp;
          </div>
          <div className="block w-full h-2 mb-1 font-sans text-base antialiased font-light leading-relaxed bg-gray-300 rounded-full text-inherit">
            &nbsp;
          </div>
          <div className="block w-full h-2 mb-1 font-sans text-base antialiased font-light leading-relaxed bg-gray-300 rounded-full text-inherit">
            &nbsp;
          </div>
        </div>
        <div className="p-2 pt-0 w-full">
          <button
            disabled=""
            tabIndex="-1"
            className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg text-white shadow-gray-900/10 hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none bg-gray-300 shadow-none hover:shadow-none w-full"
            type="button"
          >
            &nbsp;
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardSkeleton;
