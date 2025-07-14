import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/auth/useAuth";

const UserAvatar = () => {
  const { data: user, isError, isLoading } = useAuth();

  const userAbreviation =
    !isError && !isLoading
      ? `${user?.first_name[0]}${user?.last_name[0]}`
      : "U";
  return (
    <Avatar className="select-none">
      {/* <AvatarImage src={AvatarImageUrl} alt="user avatar" /> */}
      <AvatarFallback className="bg-[#023F30] text-white uppercase">
        {!isError && !isLoading && userAbreviation}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
