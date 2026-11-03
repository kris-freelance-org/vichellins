import { FC, useEffect, useState } from "react";
import { Input } from "../ui/Input";
import { Mail } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../lib/redux/store";
import { toast } from "../../hooks/useToast";
import { updateUserProfileDetails } from "../../lib/redux/slices/auth/authThunk";
import { AxiosError } from "axios";
import { Button } from "../ui/Button";
import { useSession } from "next-auth/react";

interface UserProfileFormProps {
  readonly?: boolean;
  setIsEditingMode: (value: boolean) => void;
}
const UserProfileForm: FC<UserProfileFormProps> = ({
  readonly,
  setIsEditingMode,
}) => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    state: "",
    city: "",
  });

  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((store: RootState) => store.auth);
  const { data: session, update } = useSession();

  useEffect(() => {
    if (session?.user) {
      setUserInfo({
        name: session?.user?.name || "",
        email: session?.user?.email || "",
        phone: session?.user?.phone || "",
        street: session?.user?.street || "",
        state: session?.user?.state || "",
        city: session?.user?.city || "",
      });
    }
  }, [session?.user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    setUserInfo({ ...userInfo, [name]: value });
  };

  // const handleSelectChange = (value: string, name: string) => {
  //   setUserInfo({ ...userInfo, [name]: value });
  // };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!session?.user?.email || !session?.user?.name) {
        return toast({
          title: "Invlid Input",
          description: "You haved not entered all fields",
          variant: "destructive",
        });
      }

      const res = await dispatch(updateUserProfileDetails(userInfo));

      // await update(res.payload);
      if (res.type.includes("rejected"))
        return toast({
          title: "An Error Occurred",
          description: res.payload as string,
          variant: "destructive",
        });

      if (typeof res.payload != "string") {
        const updatedUser = res.payload?.user;
        await update({
          name: updatedUser.user.name,
          email: updatedUser.user.email,
          phone: updatedUser.user.phone,
          role: updatedUser.user.role,
          id: updatedUser.user.id,
        });
      }

      toast({
        title: "Profile Update Success",
        description: "You have Updated your profile successfully",
        variant: "success",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400 || error.response?.status === 401) {
          return toast({
            title: "Error Signing Up",
            description: error.response?.data,
            variant: "destructive",
          });
        }
      }
    }
  };
  return (
    <form
      onSubmit={handleUpdate}
      className="space-y-6 py-12 text-base border-t border-b font-medium"
    >
      {session?.user && (
        <>
          <div className="grid items-center gap-3 md:grid-cols-[1fr_2fr]">
            <label htmlFor="">Name</label>
            <div className="flex gap-4 items-center md:w-[70%]">
              <Input
                value={userInfo.name}
                onChange={handleChange}
                readOnly={readonly}
                name="name"
                placeholder="Name"
                className=" focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          <hr />
          <div className="grid items-center gap-3 md:grid-cols-[1fr_2fr]">
            <label htmlFor="">Email Address</label>

            <div className="border rounded-lg flex items-center gap-3 px-6 py-4  h-18 md:w-[70%]">
              <Mail className="text-gray-500" />
              <Input
                value={userInfo.email}
                onChange={handleChange}
                name="email"
                readOnly={readonly}
                placeholder="Email"
                className=" focus-visible:ring-0 focus-visible:ring-offset-0 border-0 py-0 m-0"
              />
            </div>
          </div>
          <hr />
          <div className="grid items-center gap-3 md:grid-cols-[1fr_2fr]">
            <label htmlFor="">Phone</label>

            <Input
              value={userInfo.phone}
              onChange={handleChange}
              name="phone"
              readOnly={readonly}
              placeholder="Phone Number"
              className=" focus-visible:ring-0 focus-visible:ring-offset-0 md:w-[70%]"
            />
          </div>
          <hr />

          <div className="grid items-center gap-3 md:grid-cols-[1fr_2fr]">
            <label htmlFor="">Street</label>

            <Input
              value={userInfo.street}
              onChange={handleChange}
              name="street"
              readOnly={readonly}
              placeholder="Your Street"
              className=" focus-visible:ring-0 focus-visible:ring-offset-0 md:w-[70%]"
            />
          </div>
          <div className="grid items-center gap-3 md:grid-cols-[1fr_2fr]">
            <label htmlFor="">City</label>

            <Input
              value={userInfo.city}
              onChange={handleChange}
              name="city"
              readOnly={readonly}
              placeholder="Your City"
              className=" focus-visible:ring-0 focus-visible:ring-offset-0 md:w-[70%]"
            />
          </div>
          <div className="grid items-center gap-3 md:grid-cols-[1fr_2fr]">
            <label htmlFor="">State</label>

            <Input
              value={userInfo.state}
              onChange={handleChange}
              name="state"
              readOnly={readonly}
              placeholder="Your State"
              className=" focus-visible:ring-0 focus-visible:ring-offset-0 md:w-[70%]"
            />
          </div>

          {!readonly && (
            <div className="flex justify-end ">
              <div className="flex gap-4 ">
                <Button
                  onClick={() => setIsEditingMode(false)}
                  variant={"outline"}
                >
                  Cancel
                </Button>
                <Button isLoading={isLoading}>Update</Button>
              </div>
            </div>
          )}
        </>
      )}
    </form>
  );
};

export default UserProfileForm;
