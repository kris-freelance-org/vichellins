
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { FC } from "react";

interface UserAvatarProps {
  imgUrl: string;
  name: string;
  width?: string;
  height?: string;
}
const UserAvatar: FC<UserAvatarProps> = ({ imgUrl, name, width, height }) => {
  return (
    <Avatar
      className={ cn(width ? width : "w-[4rem]", height ? height : " h-[4rem]", "border border-primary")}
    >
      <AvatarImage src={imgUrl} alt={name} />
      <AvatarFallback className="uppercase">{name?.slice(0, 2)}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;