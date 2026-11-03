import { useEffect } from "react";

interface useTargetBreakpointInterface {
  setIsMobile: React.Dispatch<React.SetStateAction<boolean>>;
  breakPoint: number;
}

export const useTargetBreakpoint = ({
  setIsMobile,
  breakPoint,
}: useTargetBreakpointInterface) => {
  useEffect(() => {
    const isMobileDevice = window.innerWidth <= breakPoint;

    setIsMobile(isMobileDevice);

    const handleResize = () => {
      setIsMobile(window.innerWidth <= breakPoint);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [breakPoint, setIsMobile]);
};
