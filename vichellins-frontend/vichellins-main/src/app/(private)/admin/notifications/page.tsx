import NotificationItem from "@/components/notification/NotificationItem";
import React from "react";

const allNotifications = [
  {
    id: "1",
    type: "order",
    title: "New Order",
    message: "2 items Order ID 1394784 ",
    meta: "1",
  },
  {
    id: "2",
    type: "transaction",
    title: "New Transaction",
    message: "12,000 Transaction ID 38528f8 ",
    meta: "2" ,
  },
];
const Notifications = () => {
  return (
    <div className="mt-8 bg-white p-6 rounded-xl border space-y-12">
      <div className="flex flex-col mb-8">
        <h5 className="text-[#3F434A] text-2xl font-manjari font-bold">
          Notification
        </h5>
        <span className="font-normal text-base">
          Manage your store notification from here
        </span>
      </div>

      <div className="space-y-8">
        {allNotifications.map((notification) => (
          <React.Fragment key={notification.id}>
            <NotificationItem {...notification} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
