import { FC } from "react";

interface StarIconProps {
  width: string;
  height: string;
  fill: string;
}
const StarIcon: FC<StarIconProps> = ({ width, height, fill }) => {
  return (
    <div>
      <svg
        width={width}
        height={height}
        viewBox="0 0 13 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.5 0L8.27994 4.05749L12.5 4.58359L9.38 7.61736L10.2082 12L6.5 9.81749L2.7918 12L3.62 7.61736L0.5 4.58359L4.72006 4.05749L6.5 0Z"
          fill={fill}
        />
      </svg>
    </div>
  );
};

export default StarIcon;
