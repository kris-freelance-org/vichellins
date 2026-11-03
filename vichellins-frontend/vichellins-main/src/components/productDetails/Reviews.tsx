import { RootState } from "@/lib/redux/store";
import React, { FC } from "react";
import { useSelector } from "react-redux";
import ReviewItem from "./molecules/ReviewItem";

const Reviews: FC = () => {
  
  const { selectedProduct } = useSelector((store: RootState) => store.products);
 
  return (
    <div className="space-y-6">
      <h5 className="text-[1.8rem] ">Reviews</h5>

      {selectedProduct && (
        <div className="text-base space-y-4">
          <span>{selectedProduct?.reviews?.length} </span>
          {selectedProduct?.reviews?.map((review) => (
            <React.Fragment key={review.id}>
              <ReviewItem review={review } />
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
