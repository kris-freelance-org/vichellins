import React from "react";

const SectionBadge = ({ title }: { title: string }) => {
  return (
    <div className="py-[.8rem] px-[2rem] text-rose-500 w-fit rounded-[1rem] font-bold text-[1rem] lg:text-[1.2rem] bg-rose-100 border border-rose-500 ">
      🔥{title}
    </div>
  );
};

export default SectionBadge;
