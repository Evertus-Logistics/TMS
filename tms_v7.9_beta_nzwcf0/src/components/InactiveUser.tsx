import { CustomSignOutButton } from "./CustomSignOutButton";

export function InactiveUser() {
  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <h2 className="text-2xl font-bold mb-4 text-white [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFC300,_0_0_15px_#FFA500]">
        Account Pending Activation
      </h2>
      <p className="mb-8 text-white">
        Your account is currently inactive. Please contact your direct report to activate your account.
      </p>
      
      <div className="space-y-4 bg-gray-900 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFC300,_0_0_15px_#FFA500]">
          Contact Information
        </h3>
        <div className="space-y-2">
          <p className="text-white">Website: <a href="https://www.Evertus-Logistics.com" className="text-[#FFD700] hover:text-[#FFC300]">www.Evertus-Logistics.com</a></p>
          <p className="text-white">LinkedIn: <a href="https://www.linkedin.com/company/95731042/admin/dashboard/" className="text-[#FFD700] hover:text-[#FFC300]">Evertus Logistics</a></p>
          <p className="text-white">Facebook: <a href="https://www.facebook.com/profile.php?id=61574452733785" className="text-[#FFD700] hover:text-[#FFC300]">Evertus Logistics</a></p>
          <p className="text-white">Twitter: <a href="https://x.com/SupportEve37080" className="text-[#FFD700] hover:text-[#FFC300]">@SupportEve37080</a></p>
          <p className="text-white">Email: <a href="mailto:Support@Evertus-Logistics.com" className="text-[#FFD700] hover:text-[#FFC300]">Support@Evertus-Logistics.com</a></p>
          <p className="text-white">Phone: <a href="tel:+18778743958" className="text-[#FFD700] hover:text-[#FFC300]">+1 (877) 874-3958</a></p>
        </div>
      </div>
      
      <div className="mt-8">
        <CustomSignOutButton isCollapsed={false} />
      </div>
    </div>
  );
}
