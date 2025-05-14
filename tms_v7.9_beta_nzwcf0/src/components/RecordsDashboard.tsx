import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { CarrierTable } from "./CarrierTable";
import { CarrierForm } from "./CarrierForm";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';

const businessTypes = ["Carrier", "Shipper", "Freight-Forwarder", "Co-Broker"] as const;

interface ClientFormProps {
  client?: any;
  isEdit: boolean;
}

interface LocationFormProps {
  location?: any;
  isEdit: boolean;
}

export function RecordsDashboard() {
  // ... keep all existing state and hooks ...
  const profile = useQuery(api.users.getProfile);
  const clients = useQuery(api.clients.listClients) || [];
  const locations = useQuery(api.locations.listLocations) || [];
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [editingLocation, setEditingLocation] = useState<any>(null);
  const [editingCarrierId, setEditingCarrierId] = useState<Id<"carriers"> | "new" | null>(null);
  
  // Client mutations
  const createClient = useMutation(api.clients.createClient);
  const updateClient = useMutation(api.clients.updateClient);
  const deleteClient = useMutation(api.clients.deleteClient);
  const generateUploadUrl = useMutation(api.clients.generateUploadUrl);
  
  // Location mutations
  const createLocation = useMutation(api.locations.createLocation);
  const updateLocation = useMutation(api.locations.updateLocation);
  const deleteLocation = useMutation(api.locations.deleteLocation);

  // ... keep all existing handlers ...
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, isEdit: boolean) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      const clientData = {
        businessType: formData.get("businessType") as typeof businessTypes[number],
        businessName: formData.get("businessName") as string,
        streetAddress: formData.get("streetAddress") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        zip: formData.get("zip") as string,
        country: formData.get("country") as string,
        ein: formData.get("ein") as string,
        dot: formData.get("dot") as string || undefined,
        mc: formData.get("mc") as string || undefined,
        pocName: formData.get("pocName") as string,
        pocDob: formData.get("pocDob") as string,
        pocPhone: formData.get("pocPhone") as string,
        companyPhone: formData.get("companyPhone") as string || undefined,
        companyEmail: formData.get("companyEmail") as string || undefined,
        accountsPayableEmail: formData.get("accountsPayableEmail") as string || undefined,
        factorable: formData.get("factorable") === "true",
        creditApproved: Number(formData.get("creditApproved")),
        creditUsed: Number(formData.get("creditUsed")),
      };

      if (isEdit && editingClient) {
        await updateClient({ id: editingClient._id, ...clientData });
        toast.success("Client updated successfully");
        setEditingClient(null);
      } else {
        await createClient(clientData);
        toast.success("Client created successfully");
        setIsAddingClient(false);
      }
    } catch (error) {
      toast.error("Operation failed: " + (error as Error).message);
    }
  };

  const handleLocationSubmit = async (e: React.FormEvent<HTMLFormElement>, isEdit: boolean) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      const locationData = {
        buildingName: formData.get("buildingName") as string,
        streetAddress: formData.get("streetAddress") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        zip: formData.get("zip") as string,
        country: formData.get("country") as string,
        phone: formData.get("phone") as string,
        hoursOfOperation: formData.get("hoursOfOperation") as string,
      };

      if (isEdit && editingLocation) {
        await updateLocation({ id: editingLocation._id, ...locationData });
        toast.success("Location updated successfully");
        setEditingLocation(null);
      } else {
        await createLocation(locationData);
        toast.success("Location created successfully");
        setIsAddingLocation(false);
      }
    } catch (error) {
      toast.error("Operation failed: " + (error as Error).message);
    }
  };

  const handleDelete = async (clientId: Id<"clients">, clientName: string) => {
    if (window.confirm(`Are you sure you want to delete ${clientName}?`)) {
      try {
        await deleteClient({ id: clientId });
        toast.success("Client deleted successfully");
      } catch (error) {
        toast.error("Delete failed: " + (error as Error).message);
      }
    }
  };

  const handleLocationDelete = async (locationId: Id<"locations">, locationName: string) => {
    if (window.confirm(`Are you sure you want to delete ${locationName}?`)) {
      try {
        await deleteLocation({ id: locationId });
        toast.success("Location deleted successfully");
      } catch (error) {
        toast.error("Delete failed: " + (error as Error).message);
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, clientId: Id<"clients">) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      
      if (!result.ok) {
        throw new Error("Upload failed");
      }

      const { storageId } = await result.json();
      await updateClient({ id: clientId, documentsStorageId: storageId });
      toast.success("Document uploaded successfully");
    } catch (error) {
      toast.error("Upload failed: " + (error as Error).message);
    }
  };

  // ... keep LocationForm and ClientForm components ...
  const LocationForm = ({ location, isEdit }: LocationFormProps) => (
    <form onSubmit={(e) => handleLocationSubmit(e, isEdit)} className="space-y-4 bg-gray-900 p-6 rounded-lg mb-6">
      <div className="grid grid-cols-3 gap-4">
        <input
          name="buildingName"
          defaultValue={location?.buildingName}
          placeholder="Building Name"
          required
          className="p-2 rounded bg-gray-800 text-white"
        />
        <input
          name="streetAddress"
          defaultValue={location?.streetAddress}
          placeholder="Street Address"
          required
          className="p-2 rounded bg-gray-800 text-white"
        />
        <input
          name="city"
          defaultValue={location?.city}
          placeholder="City"
          required
          className="p-2 rounded bg-gray-800 text-white"
        />
        <input
          name="state"
          defaultValue={location?.state}
          placeholder="State"
          required
          className="p-2 rounded bg-gray-800 text-white"
        />
        <input
          name="zip"
          defaultValue={location?.zip}
          placeholder="ZIP"
          required
          className="p-2 rounded bg-gray-800 text-white"
        />
        <input
          name="country"
          defaultValue={location?.country}
          placeholder="Country"
          required
          className="p-2 rounded bg-gray-800 text-white"
        />
        <input
          name="phone"
          defaultValue={location?.phone}
          placeholder="Phone"
          required
          className="p-2 rounded bg-gray-800 text-white"
        />
        <input
          name="hoursOfOperation"
          defaultValue={location?.hoursOfOperation}
          placeholder="Hours of Operation"
          required
          className="p-2 rounded bg-gray-800 text-white"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={() => {
            setIsAddingLocation(false);
            setEditingLocation(null);
          }}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
        >
          {isEdit ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );

  const ClientForm = ({ client, isEdit }: ClientFormProps) => (
    <form onSubmit={(e) => handleSubmit(e, isEdit)} className="space-y-4 bg-gray-900 p-6 rounded-lg mb-6">
      <div className="grid grid-cols-3 gap-4">
        <select
          name="businessType"
          defaultValue={client?.businessType}
          required
          className="p-2 rounded bg-gray-800 text-white"
        >
          <option value="">Select Business Type</option>
          {businessTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <input
          name="businessName"
          defaultValue={client?.businessName}
          placeholder="Business Name"
          required
          className="p-2 rounded bg-gray-800 text-white"
        />
        <input
          name="streetAddress"
          defaultValue={client?.streetAddress}
          placeholder="Street Address"
          required
          className="p-2 rounded bg-gray-800 text-white"
        />
        <input
          name="city"
          defaultValue={client?.city}
          placeholder="City"
          required
          className="p-2 rounded bg-gray-800 text-white"
        />
        <input
          name="state"
          defaultValue={client?.state}
          placeholder="State"
          required
          className="p-2 rounded bg-gray-800 text-white"
        />
        <input
          name="zip"
          defaultValue={client?.zip}
          placeholder="ZIP"
          required
          className="p-2 rounded bg-gray-800 text-white"
        />
        <input
          name="country"
          defaultValue={client?.country}
          placeholder="Country"
          required
          className="p-2 rounded bg-gray-800 text-white"
        />
        <input
          name="ein"
          defaultValue={client?.ein}
          placeholder="EIN"
          required
          className="p-2 rounded bg-gray-800 text-white"
        />
        <input
          name="dot"
          defaultValue={client?.dot}
          placeholder="DOT (optional)"
          className="p-2 rounded bg-gray-800 text-white"
        />
        <input
          name="mc"
          defaultValue={client?.mc}
          placeholder="MC (optional)"
          className="p-2 rounded bg-gray-800 text-white"
        />
        <input
          name="pocName"
          defaultValue={client?.pocName}
          placeholder="POC Name"
          required
          className="p-2 rounded bg-gray-800 text-white"
        />
        <input
          name="pocDob"
          type="date"
          defaultValue={client?.pocDob}
          required
          className="p-2 rounded bg-gray-800 text-white"
        />
        <input
          name="pocPhone"
          defaultValue={client?.pocPhone}
          placeholder="POC Phone"
          required
          className="p-2 rounded bg-gray-800 text-white"
        />
        <input
          name="companyPhone"
          defaultValue={client?.companyPhone}
          placeholder="Company Phone (optional)"
          className="p-2 rounded bg-gray-800 text-white"
        />
        <input
          name="companyEmail"
          type="email"
          defaultValue={client?.companyEmail}
          placeholder="Company Email (optional)"
          className="p-2 rounded bg-gray-800 text-white"
        />
        <input
          name="accountsPayableEmail"
          type="email"
          defaultValue={client?.accountsPayableEmail}
          placeholder="Accounts Payable Email (optional)"
          className="p-2 rounded bg-gray-800 text-white"
        />
        <select
          name="factorable"
          defaultValue={client?.factorable?.toString()}
          required
          className="p-2 rounded bg-gray-800 text-white"
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        <input
          name="creditApproved"
          type="number"
          defaultValue={client?.creditApproved}
          placeholder="Credit Approved (USD)"
          required
          className="p-2 rounded bg-gray-800 text-white"
        />
        <input
          name="creditUsed"
          type="number"
          defaultValue={client?.creditUsed}
          placeholder="Credit Used (USD)"
          required
          className="p-2 rounded bg-gray-800 text-white"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={() => {
            setIsAddingClient(false);
            setEditingClient(null);
          }}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
        >
          {isEdit ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFC300,_0_0_15px_#FFA500] text-center flex-grow">
          RECORDS DASHBOARD
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

      <div className="space-y-8">
        {/* Clients Section */}
        <div className="bg-gray-900 rounded-lg p-6 border-2 border-yellow-400 shadow-[0_0_10px_2px_#FFD700]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-black [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFC300,_0_0_15px_#FFA500]">
              Clients
            </h2>
            <button
              onClick={() => setIsAddingClient(true)}
              className="px-4 py-2 bg-[#FFD700] text-black rounded hover:bg-[#FFC300] transition-colors"
            >
              Add New Client
            </button>
          </div>

          {(isAddingClient || editingClient) && (
            <ClientForm client={editingClient} isEdit={!!editingClient} />
          )}

          <div className="overflow-x-auto">
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-black">
                  <tr className="text-left border-b-2 border-[#FFD700]">
                    <th className="p-4 text-[#FFD700]">Business Type</th>
                    <th className="p-4 text-[#FFD700]">Business Name</th>
                    <th className="p-4 text-[#FFD700]">POC Name</th>
                    <th className="p-4 text-[#FFD700]">Credit Approved</th>
                    <th className="p-4 text-[#FFD700]">Credit Used</th>
                    <th className="p-4 text-[#FFD700]">Credit Available</th>
                    <th className="p-4 text-[#FFD700]">Documents</th>
                    <th className="p-4 text-[#FFD700]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client: any) => (
                    <tr key={client._id} className="border-b border-gray-700 hover:bg-gray-900">
                      <td className="p-4 text-white">{client.businessType}</td>
                      <td className="p-4 text-white">{client.businessName}</td>
                      <td className="p-4 text-white">{client.pocName}</td>
                      <td className="p-4 text-white">${client.creditApproved.toLocaleString()}</td>
                      <td className="p-4 text-white">${client.creditUsed.toLocaleString()}</td>
                      <td className="p-4 text-white">${(client.creditApproved - client.creditUsed).toLocaleString()}</td>
                      <td className="p-4">
                        <input
                          type="file"
                          onChange={(e) => handleFileUpload(e, client._id)}
                          className="hidden"
                          id={`file-${client._id}`}
                        />
                        <label
                          htmlFor={`file-${client._id}`}
                          className="cursor-pointer text-blue-500 hover:text-blue-400"
                        >
                          Upload
                        </label>
                      </td>
                      <td className="p-4">
                        <IconButton
                          size="small"
                          onClick={() => setEditingClient(client)}
                          sx={{ 
                            mr: 1,
                            color: '#3b82f6',
                            '&:hover': {
                              color: '#60a5fa',
                            }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(client._id, client.businessName)}
                          sx={{ 
                            color: '#ef4444',
                            '&:hover': {
                              color: '#f87171',
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Locations Section */}
        <div className="bg-gray-900 rounded-lg p-6 border-2 border-yellow-400 shadow-[0_0_10px_2px_#FFD700]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-black [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFC300,_0_0_15px_#FFA500]">
              📍 Locations
            </h2>
            <button
              onClick={() => setIsAddingLocation(true)}
              className="px-4 py-2 bg-[#FFD700] text-black rounded hover:bg-[#FFC300] transition-colors"
            >
              Add New Location
            </button>
          </div>

          {(isAddingLocation || editingLocation) && (
            <LocationForm location={editingLocation} isEdit={!!editingLocation} />
          )}

          <div className="overflow-x-auto">
            <div className="max-h-[350px] overflow-y-auto">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-black">
                  <tr className="text-left border-b-2 border-[#FFD700]">
                    <th className="p-4 text-[#FFD700]">Building Name</th>
                    <th className="p-4 text-[#FFD700]">Address</th>
                    <th className="p-4 text-[#FFD700]">City</th>
                    <th className="p-4 text-[#FFD700]">State</th>
                    <th className="p-4 text-[#FFD700]">Phone</th>
                    <th className="p-4 text-[#FFD700]">Hours</th>
                    <th className="p-4 text-[#FFD700]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {locations.map((location: any) => (
                    <tr key={location._id} className="border-b border-gray-700 hover:bg-gray-900">
                      <td className="p-4 text-white">{location.buildingName}</td>
                      <td className="p-4 text-white">{location.streetAddress}</td>
                      <td className="p-4 text-white">{location.city}</td>
                      <td className="p-4 text-white">{location.state}</td>
                      <td className="p-4 text-white">{location.phone}</td>
                      <td className="p-4 text-white">{location.hoursOfOperation}</td>
                      <td className="p-4">
                        <IconButton
                          size="small"
                          onClick={() => setEditingLocation(location)}
                          sx={{ 
                            mr: 1,
                            color: '#3b82f6',
                            '&:hover': {
                              color: '#60a5fa',
                            }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleLocationDelete(location._id, location.buildingName)}
                          sx={{ 
                            color: '#ef4444',
                            '&:hover': {
                              color: '#f87171',
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Carriers Section */}
        <div className="bg-gray-900 rounded-lg p-6 border-2 border-yellow-400 shadow-[0_0_10px_2px_#FFD700]">
          {editingCarrierId && (
            <CarrierForm 
              open={editingCarrierId !== null}
              onClose={() => setEditingCarrierId(null)}
              carrierId={editingCarrierId}
            />
          )}
          <CarrierTable onEdit={setEditingCarrierId} />
        </div>
      </div>
    </div>
  );
}
