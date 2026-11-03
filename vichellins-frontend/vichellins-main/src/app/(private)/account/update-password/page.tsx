import PageHeader from "@/components/account/PageHeader";
import UserPasswordForm from "@/components/account/UserPasswordForm";
import { FC } from "react";

// interface UpdatePasswordProps {}

const UpdatePassword: FC = () => {
  return (
    <div className="mt-12">
      <PageHeader
        title="Update Password"
        subTitle="You can update users Password here"
      />
      <UserPasswordForm />
    </div>
  );
};

export default UpdatePassword;
