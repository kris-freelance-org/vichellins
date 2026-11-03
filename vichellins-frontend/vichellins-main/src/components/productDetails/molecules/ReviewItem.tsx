import UserAvatar from "@/components/shared/atom/UserAvatar";
import { IReview } from "@/types/products";
import { StarIcon } from "lucide-react";
import { FC } from "react";

interface ReviewItemProps {
  review: IReview;
}

const ReviewItem: FC<ReviewItemProps> = ({ review }) => {
  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <UserAvatar
            imgUrl=""
            name={review.user.name}
            height="h-[5rem]"
            width="w-[5rem]"
          />
          <div className="space-y-2">
            <h6 className="font-semibold capitalize"> {review.user.name}</h6>
            <span className="text-gray-500 font-normal">
              {review.user.email}
            </span>
          </div>
        </div>

        <div className="text-base flex gap-2 font-thin">
          {review.rating}
          <div className="flex gap-2 items-center">
            {new Array(Number(review.rating)).fill(1).map((_, index) => (
              <StarIcon
                fill={"#ffe234"}
                key={index}
                width={"1.6rem"}
                height={"1.5rem"}
              />
            ))}
            {new Array(5 - Number(review.rating)).fill(1).map((_, index) => (
              <StarIcon
                fill={"#CACACA"}
                key={index}
                width={"1.6rem"}
                height={"1.5rem"}
              />
            ))}
          </div>
        </div>

        <p className="text-gray-500 text-base ">{review.comment}</p>
      </div>
    </>
  );
};

export default ReviewItem;
