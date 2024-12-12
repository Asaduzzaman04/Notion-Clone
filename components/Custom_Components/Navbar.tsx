"use client";
import {
  useUser,
  SignedOut,
  UserButton,
  SignInButton,
  SignedIn,
} from "@clerk/nextjs";

const Navbar = () => {
  //clerk hooks for user details
  const user = useUser();

  return (
    <nav className="flex  justify-between items-center p-3 md:p-5 lg:px-[3%] bg-slate-800 ">
      {/* users-name */}
      <div className="text-white font-bold text-2xl capitalize">
        {user ? <span>{user.user?.firstName}`s notes</span> : null}
      </div>
      {/* login-info */}
      <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
};

export default Navbar;
