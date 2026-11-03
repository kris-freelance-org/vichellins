"use client"

import { FC, useState } from "react";
import UserProfileForm from "@/components/account/UserProfileForm";
import { Button } from "@/components/ui/Button";

import PageHeader from "@/components/account/PageHeader";
import { Pencil } from "lucide-react";

// interface AccountProps {}
const Account: FC = () => {
  const [isEditingMode, setIsEditingMode] = useState(false);

  return (
    <div className="mt-12">
      <PageHeader title="Profile" subTitle="Update your Profile and Password" />

      {!isEditingMode && (
        <div className="flex justify-end mb-8 ">
          <div className="flex gap-4 ">
            <Button className="gap-3" onClick={() => setIsEditingMode(true)}>
              <Pencil size={20} /> Edit
            </Button>
          </div>
        </div>
      )}

      <UserProfileForm
        setIsEditingMode={setIsEditingMode}
        readonly={!isEditingMode}
      />
    </div>
  );
};

export default Account;
