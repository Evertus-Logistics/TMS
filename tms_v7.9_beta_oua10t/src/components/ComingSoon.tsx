import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function ComingSoon() {
  const profile = useQuery(api.users.getProfile);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFC300,_0_0_15px_#FFA500] text-center flex-grow">
          Coming Soon
        </h1>
        <div className="text-right flex flex-col items-center gap-2">
          <img 
            src="https://effervescent-camel-645.convex.cloud/api/storage/05b48caa-f6b9-4de0-b356-b91e1164defe"
            alt="Logo"
            className="w-16 h-16 object-contain"
          />
          <div className="text-white text-1xl font-bold">
            Welcome, {profile?.name}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mt-20">
        <div className="w-32 h-32 mb-8">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#FFD700]"></div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4 [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFC300,_0_0_15px_#FFA500]">
          This Feature is Coming Soon
        </h2>
        <p className="text-gray-400 text-center max-w-md">
          We're working hard to bring you this exciting new feature. Stay tuned for updates!
        </p>
      </div>
    </div>
  );
}
