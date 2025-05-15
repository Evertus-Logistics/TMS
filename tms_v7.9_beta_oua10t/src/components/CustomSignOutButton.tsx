import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";

export function CustomSignOutButton({ isCollapsed }: { isCollapsed: boolean }) {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  if (!isAuthenticated) {
    return null;
  }

  if (isCollapsed) {
    return (
      <button
        onClick={() => void signOut()}
        className="
          text-[2.6rem]
          text-white
          hover:scale-110
          active:scale-95
          transition-all
          [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFC300,_0_0_15px_#FFA500]
        "
      >
        ✌🏼
      </button>
    );
  }

  return (
    <div className="
      relative 
      inline-block
      bg-gray-800 
      rounded-md 
      transform hover:-translate-y-0.5 
      transition-all
      shadow-[0_4px_0_rgb(218,165,32)]
      hover:shadow-[0_2px_0_rgb(218,165,32)]
      active:shadow-none
      active:translate-y-0.5
      overflow-hidden
      border-2 border-[#FFD700]
      before:absolute
      before:content-['']
      before:left-0
      before:top-0
      before:right-0
      before:bottom-0
      before:rounded-md
      before:bg-gradient-to-b
      before:from-transparent
      before:to-black/20
      before:opacity-50
    ">
      <button
        onClick={() => void signOut()}
        className="
          relative
          px-4 py-2
          text-white
          font-semibold
          [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFC300,_0_0_15px_#FFA500]
          bg-transparent
          hover:bg-transparent
          active:bg-transparent
          w-full
          h-full
        "
      >
        Sign out
      </button>
    </div>
  );
}