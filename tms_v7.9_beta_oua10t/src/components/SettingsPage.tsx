import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";

const managers = ["Hector", "Roy", "Nasif", "Ali", "Andrew"] as const;
const roles = [
  "admin",
  "manager",
  "Broker Sales Agent",
  "Carrier Sales Agent",
  "Support",
  "Accounting",
] as const;

export function SettingsPage() {
  const profile = useQuery(api.users.getProfile);
  const updateProfile = useMutation(api.users.updateProfile);
  const [isEditing, setIsEditing] = useState(false);

  if (!profile) {
    return <div className="p-8 text-white">Loading...</div>;
  }

  const isAdmin = profile.role === "admin";
  const canEdit = profile.role !== "manager"; // New check for edit permission

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      const updates: any = {
        profileId: profile._id,
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string || undefined,
      };

      // Only include restricted fields if user is admin
      if (isAdmin) {
        updates.loadId = formData.get("loadId") as string || undefined;
        updates.manager = formData.get("manager") as typeof managers[number] || undefined;
        updates.role = formData.get("role") as typeof roles[number];
        updates.commissionRate = formData.get("commissionRate") ? Number(formData.get("commissionRate")) : undefined;
        updates.salary = formData.get("salary") as string || undefined;
      }

      await updateProfile(updates);
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Update failed: " + (error as Error).message);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFC300,_0_0_15px_#FFA500]">
            Profile Settings
          </h1>
          {canEdit && ( // Only show edit button if user can edit
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-[#FFD700] text-black rounded hover:bg-[#FFC300] transition-colors"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white font-bold block mb-1 [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFC300,_0_0_15px_#FFA500]">Name</label>
                <input
                  name="name"
                  defaultValue={profile.name}
                  required
                  className="w-full p-2 rounded bg-gray-800 text-white"
                />
              </div>
              <div>
                <label className="text-white font-bold block mb-1 [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFC300,_0_0_15px_#FFA500]">Email</label>
                <input
                  name="email"
                  type="email"
                  defaultValue={profile.email}
                  required
                  className="w-full p-2 rounded bg-gray-800 text-white"
                />
              </div>
              <div>
                <label className="text-white font-bold block mb-1 [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFC300,_0_0_15px_#FFA500]">Phone</label>
                <input
                  name="phone"
                  type="tel"
                  defaultValue={profile.phone}
                  className="w-full p-2 rounded bg-gray-800 text-white"
                />
              </div>
              {isAdmin && (
                <>
                  <div>
                    <label className="text-white font-bold block mb-1 [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFC300,_0_0_15px_#FFA500]">Load ID</label>
                    <input
                      name="loadId"
                      defaultValue={profile.loadId}
                      className="w-full p-2 rounded bg-gray-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-white font-bold block mb-1 [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFC300,_0_0_15px_#FFA500]">Manager</label>
                    <select
                      name="manager"
                      defaultValue={profile.manager}
                      className="w-full p-2 rounded bg-gray-800 text-white"
                    >
                      <option value="">Select Manager</option>
                      {managers.map((manager) => (
                        <option key={manager} value={manager}>
                          {manager}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-white font-bold block mb-1 [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFC300,_0_0_15px_#FFA500]">Role</label>
                    <select
                      name="role"
                      defaultValue={profile.role}
                      required
                      className="w-full p-2 rounded bg-gray-800 text-white"
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-white font-bold block mb-1 [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFC300,_0_0_15px_#FFA500]">Commission Rate (%)</label>
                    <input
                      name="commissionRate"
                      type="number"
                      defaultValue={profile.commissionRate}
                      className="w-full p-2 rounded bg-gray-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-white font-bold block mb-1 [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFC300,_0_0_15px_#FFA500]">Salary</label>
                    <input
                      name="salary"
                      defaultValue={profile.salary}
                      className="w-full p-2 rounded bg-gray-800 text-white"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-[#FFD700] text-black rounded hover:bg-[#FFC300] transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-gray-900 p-6 rounded-lg space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white font-bold block mb-1 [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFC300,_0_0_15px_#FFA500]">Name</label>
                <p className="text-white">{profile.name}</p>
              </div>
              <div>
                <label className="text-white font-bold block mb-1 [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFC300,_0_0_15px_#FFA500]">Email</label>
                <p className="text-white">{profile.email}</p>
              </div>
              <div>
                <label className="text-white font-bold block mb-1 [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFC300,_0_0_15px_#FFA500]">Phone</label>
                <p className="text-white">{profile.phone || 'Not set'}</p>
              </div>
              <div>
                <label className="text-white font-bold block mb-1 [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFC300,_0_0_15px_#FFA500]">Load ID</label>
                <p className="text-white">{profile.loadId || 'Not set'}</p>
              </div>
              <div>
                <label className="text-white font-bold block mb-1 [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFC300,_0_0_15px_#FFA500]">Manager</label>
                <p className="text-white">{profile.manager || 'Not set'}</p>
              </div>
              <div>
                <label className="text-white font-bold block mb-1 [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFC300,_0_0_15px_#FFA500]">Role</label>
                <p className="text-white">{profile.role}</p>
              </div>
              <div>
                <label className="text-white font-bold block mb-1 [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFC300,_0_0_15px_#FFA500]">Commission Rate</label>
                <p className="text-white">{profile.commissionRate ? `${profile.commissionRate}%` : 'Not set'}</p>
              </div>
              <div>
                <label className="text-white font-bold block mb-1 [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFC300,_0_0_15px_#FFA500]">Salary</label>
                <p className="text-white">{profile.salary || 'Not set'}</p>
              </div>
              <div>
                <label className="text-white font-bold block mb-1 [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFC300,_0_0_15px_#FFA500]">Status</label>
                <p className={`inline-block px-3 py-1 rounded-full ${
                  profile.status === 'active'
                    ? 'bg-green-500/20 text-green-500 [text-shadow:_0_0_5px_#22c55e]'
                    : 'bg-red-500/20 text-red-500 [text-shadow:_0_0_5px_#ef4444]'
                }`}>
                  {profile.status}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
