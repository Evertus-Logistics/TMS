import { useState, useEffect } from 'react';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  FormControlLabel,
  Switch,
  useTheme,
  IconButton,
} from '@mui/material';
import { toast } from "sonner";

interface LoadFormProps {
  open: boolean;
  onClose: () => void;
  loadId?: Id<"loads"> | null;
}

type LoadStatus = "New" | "Active" | "Canceled" | "Closed";
type LoadProgress = "Quoted" | "Planning" | "In-Transit" | "Delivered";
type TrailerType = "Van" | "Flatbed" | "Reefer" | "Container" | "Other";
type Branch = "Nasif's Team" | "Roy's Team" | "Andrew's Team" | "Ali's Team";

interface AuxCharge {
  reason: string;
  quantity: number;
  charge: number;
}

interface FormData {
  customerBusinessName: string;
  lastDateFree: string;
  loadStatus: LoadStatus;
  loadProgress: LoadProgress;
  loadCommodity: string;
  trailerNumber: string;
  trailerType: TrailerType;
  layovers: boolean;
  assignedAgentId: string;
  branch: Branch;
  
  // Pickup Info
  pickupBuildingName: string;
  pickupStreetAddress: string;
  pickupCity: string;
  pickupState: string;
  pickupZip: string;
  pickupDate: string;
  pickupTime: string;
  
  // Delivery Info
  dropoffBuildingName: string;
  dropoffStreetAddress: string;
  dropoffCity: string;
  dropoffState: string;
  dropoffZip: string;
  dropoffDate: string;
  dropoffTime: string;
  
  // Carrier Info
  carrierCompanyName: string;
  carrierStatus: string;
  carrierStreetAddress: string;
  carrierCity: string;
  carrierState: string;
  carrierZip: string;
  carrierPOC: string;
  carrierPOCPhone: string;
  carrierPOCEmail: string;
  truckNumber: string;
  chassisNumber: string;
  
  // Financial Info
  clientRateCon: number;
  carrierPayout: number;
  agentPayout: number;
  grossProfit: number;
  netProfit: number;
  totalFinalInvoice: number;
  totalWeight: number;
  actualWeight: number;
  auxCharges: AuxCharge[];
  
  // Dates
  dateQuotedToClient: string;
  dateDelivered: string;
  dateInvoicedClient: string;
  dateCarrierPaid: string;
  dateAgentPaid: string;
  dateClientPaid: string;
  
  // Notes
  notes: string;
}

const defaultFormData: FormData = {
  customerBusinessName: '',
  lastDateFree: '',
  loadStatus: 'New',
  loadProgress: 'Quoted',
  loadCommodity: '',
  trailerNumber: '',
  trailerType: 'Van',
  layovers: false,
  assignedAgentId: '',
  branch: "Nasif's Team",
  
  pickupBuildingName: '',
  pickupStreetAddress: '',
  pickupCity: '',
  pickupState: '',
  pickupZip: '',
  pickupDate: '',
  pickupTime: '',
  
  dropoffBuildingName: '',
  dropoffStreetAddress: '',
  dropoffCity: '',
  dropoffState: '',
  dropoffZip: '',
  dropoffDate: '',
  dropoffTime: '',
  
  carrierCompanyName: '',
  carrierStatus: '',
  carrierStreetAddress: '',
  carrierCity: '',
  carrierState: '',
  carrierZip: '',
  carrierPOC: '',
  carrierPOCPhone: '',
  carrierPOCEmail: '',
  truckNumber: '',
  chassisNumber: '',
  
  clientRateCon: 0,
  carrierPayout: 0,
  agentPayout: 0,
  grossProfit: 0,
  netProfit: 0,
  totalFinalInvoice: 0,
  totalWeight: 0,
  actualWeight: 0,
  auxCharges: [],
  
  dateQuotedToClient: '',
  dateDelivered: '',
  dateInvoicedClient: '',
  dateCarrierPaid: '',
  dateAgentPaid: '',
  dateClientPaid: '',
  
  notes: '',
};

export function LoadForm({ open, onClose, loadId }: LoadFormProps) {
  const createLoad = useMutation(api.loads.createLoad);
  const updateLoad = useMutation(api.loads.updateLoad);
  const load = loadId ? useQuery(api.loads.get, { id: loadId }) : null;
  const users = useQuery(api.users.getAllProfiles, {
    search: undefined,
    role: undefined,
    status: undefined,
  }) || [];

  const [formData, setFormData] = useState<FormData>(defaultFormData);

  // Update form data when load data changes
  useEffect(() => {
    if (load) {
      setFormData({
        customerBusinessName: load.customerBusinessName || '',
        lastDateFree: load.lastDateFree || '',
        loadStatus: (load.loadStatus as LoadStatus) || 'New',
        loadProgress: (load.loadProgress as LoadProgress) || 'Quoted',
        loadCommodity: load.loadCommodity || '',
        trailerNumber: load.trailerNumber || '',
        trailerType: (load.trailerType as TrailerType) || 'Van',
        layovers: load.layovers || false,
        assignedAgentId: load.assignedAgentId || '',
        branch: (load.branch as Branch) || "Nasif's Team",
        
        pickupBuildingName: load.pickupBuildingName || '',
        pickupStreetAddress: load.pickupStreetAddress || '',
        pickupCity: load.pickupCity || '',
        pickupState: load.pickupState || '',
        pickupZip: load.pickupZip || '',
        pickupDate: load.pickupDate || '',
        pickupTime: load.pickupTime || '',
        
        dropoffBuildingName: load.dropoffBuildingName || '',
        dropoffStreetAddress: load.dropoffStreetAddress || '',
        dropoffCity: load.dropoffCity || '',
        dropoffState: load.dropoffState || '',
        dropoffZip: load.dropoffZip || '',
        dropoffDate: load.dropoffDate || '',
        dropoffTime: load.dropoffTime || '',
        
        carrierCompanyName: load.carrierCompanyName || '',
        carrierStatus: load.carrierStatus || '',
        carrierStreetAddress: load.carrierStreetAddress || '',
        carrierCity: load.carrierCity || '',
        carrierState: load.carrierState || '',
        carrierZip: load.carrierZip || '',
        carrierPOC: load.carrierPOC || '',
        carrierPOCPhone: load.carrierPOCPhone || '',
        carrierPOCEmail: load.carrierPOCEmail || '',
        truckNumber: load.truckNumber || '',
        chassisNumber: load.chassisNumber || '',
        
        clientRateCon: load.clientRateCon || 0,
        carrierPayout: load.carrierPayout || 0,
        agentPayout: load.agentPayout || 0,
        grossProfit: load.grossProfit || 0,
        netProfit: load.netProfit || 0,
        totalFinalInvoice: load.totalFinalInvoice || 0,
        totalWeight: load.totalWeight || 0,
        actualWeight: load.actualWeight || 0,
        auxCharges: load.auxCharges || [],
        
        dateQuotedToClient: load.dateQuotedToClient || '',
        dateDelivered: load.dateDelivered || '',
        dateInvoicedClient: load.dateInvoicedClient || '',
        dateCarrierPaid: load.dateCarrierPaid || '',
        dateAgentPaid: load.dateAgentPaid || '',
        dateClientPaid: load.dateClientPaid || '',
        
        notes: load.notes || '',
      });
    }
  }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.assignedAgentId) {
      toast.error("Please select an assigned agent");
      return;
    }

    try {
      const submitData = {
        ...formData,
        assignedAgentId: formData.assignedAgentId as Id<"userProfiles">,
      };

      if (loadId) {
        await updateLoad({
          id: loadId,
          ...submitData,
        });
        toast.success("Load updated successfully");
      } else {
        await createLoad(submitData);
        toast.success("Load created successfully");
      }
      onClose();
    } catch (error) {
      toast.error("Operation failed: " + (error as Error).message);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "#1a1a1a",
          color: "white",
          margin: { xs: 1, sm: 2 },
          width: { xs: 'calc(100% - 16px)', sm: 'calc(100% - 32px)' },
          maxHeight: { xs: '98vh', sm: '90vh' },
          overflowY: 'auto',
          "& .MuiInputLabel-root": {
            color: "#FFD700",
          },
          "& .MuiOutlinedInput-root": {
            color: "white",
            "& fieldset": {
              borderColor: "#FFD700",
            },
            "&:hover fieldset": {
              borderColor: "#FFC300",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#FFD700",
            },
          },
          "& .MuiInputBase-input": {
            color: "white",
            fontSize: { xs: '14px', sm: '16px' },
          },
          "& .MuiSelect-icon": {
            color: "#FFD700",
          },
          "& .MuiMenuItem-root": {
            color: "black",
          },
        },
      }}
    >
      <DialogTitle 
        sx={{ 
          backgroundColor: "#FFD700", 
          color: "black",
          fontSize: { xs: '18px', sm: '24px' },
          padding: { xs: 2, sm: 3 },
        }}
      >
        {loadId ? 'Edit Load' : 'Create New Load'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent 
          sx={{ 
            mt: { xs: 1, sm: 2 },
            p: { xs: 2, sm: 3 },
          }}
        >
          <div className="flex flex-col space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-6">
                  <TextField
                    fullWidth
                    label="Customer Business Name"
                    name="customerBusinessName"
                    value={formData.customerBusinessName}
                    onChange={handleTextChange}
                    required
                  />
                </div>
                <div className="md:col-span-6">
                  <TextField
                    fullWidth
                    label="Last Date Free"
                    name="lastDateFree"
                    type="date"
                    value={formData.lastDateFree}
                    onChange={handleTextChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
                <div className="md:col-span-3">
                  <FormControl fullWidth>
                    <InputLabel>Load Status</InputLabel>
                    <Select
                      name="loadStatus"
                      value={formData.loadStatus}
                      onChange={handleSelectChange}
                      label="Load Status"
                      required
                    >
                      <MenuItem value="New">New</MenuItem>
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Canceled">Canceled</MenuItem>
                      <MenuItem value="Closed">Closed</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="md:col-span-3">
                  <FormControl fullWidth>
                    <InputLabel>Load Progress</InputLabel>
                    <Select
                      name="loadProgress"
                      value={formData.loadProgress}
                      onChange={handleSelectChange}
                      label="Load Progress"
                      required
                    >
                      <MenuItem value="Quoted">Quoted</MenuItem>
                      <MenuItem value="Planning">Planning</MenuItem>
                      <MenuItem value="In-Transit">In-Transit</MenuItem>
                      <MenuItem value="Delivered">Delivered</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="md:col-span-3">
                  <FormControl fullWidth>
                    <InputLabel>Branch</InputLabel>
                    <Select
                      name="branch"
                      value={formData.branch}
                      onChange={handleSelectChange}
                      label="Branch"
                      required
                    >
                      <MenuItem value="Nasif's Team">Nasif's Team</MenuItem>
                      <MenuItem value="Roy's Team">Roy's Team</MenuItem>
                      <MenuItem value="Andrew's Team">Andrew's Team</MenuItem>
                      <MenuItem value="Ali's Team">Ali's Team</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="md:col-span-3">
                  <FormControl fullWidth>
                    <InputLabel>Assigned Agent</InputLabel>
                    <Select
                      name="assignedAgentId"
                      value={formData.assignedAgentId}
                      onChange={handleSelectChange}
                      label="Assigned Agent"
                      required
                    >
                      {users.map((user) => (
                        <MenuItem key={user._id} value={user._id}>
                          {user.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>

            {/* Load Details */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Load Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4">
                  <TextField
                    fullWidth
                    label="Load Commodity"
                    name="loadCommodity"
                    value={formData.loadCommodity}
                    onChange={handleTextChange}
                    required
                  />
                </div>
                <div className="md:col-span-4">
                  <TextField
                    fullWidth
                    label="Trailer Number"
                    name="trailerNumber"
                    value={formData.trailerNumber}
                    onChange={handleTextChange}
                  />
                </div>
                <div className="md:col-span-4">
                  <FormControl fullWidth>
                    <InputLabel>Trailer Type</InputLabel>
                    <Select
                      name="trailerType"
                      value={formData.trailerType}
                      onChange={handleSelectChange}
                      label="Trailer Type"
                      required
                    >
                      <MenuItem value="Van">Van</MenuItem>
                      <MenuItem value="Flatbed">Flatbed</MenuItem>
                      <MenuItem value="Reefer">Reefer</MenuItem>
                      <MenuItem value="Container">Container</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="md:col-span-12">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.layovers}
                        onChange={handleSwitchChange}
                        name="layovers"
                      />
                    }
                    label="Layovers"
                  />
                </div>
              </div>
            </div>

            {/* Pickup and Delivery Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pickup Info */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Pickup Information</h3>
                <div className="space-y-4">
                  <TextField
                    fullWidth
                    label="Building Name"
                    name="pickupBuildingName"
                    value={formData.pickupBuildingName}
                    onChange={handleTextChange}
                    required
                  />
                  <TextField
                    fullWidth
                    label="Street Address"
                    name="pickupStreetAddress"
                    value={formData.pickupStreetAddress}
                    onChange={handleTextChange}
                    required
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <TextField
                      fullWidth
                      label="City"
                      name="pickupCity"
                      value={formData.pickupCity}
                      onChange={handleTextChange}
                      required
                    />
                    <TextField
                      fullWidth
                      label="State"
                      name="pickupState"
                      value={formData.pickupState}
                      onChange={handleTextChange}
                      required
                    />
                    <TextField
                      fullWidth
                      label="ZIP"
                      name="pickupZip"
                      value={formData.pickupZip}
                      onChange={handleTextChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextField
                      fullWidth
                      label="Date"
                      name="pickupDate"
                      type="date"
                      value={formData.pickupDate}
                      onChange={handleTextChange}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                    <TextField
                      fullWidth
                      label="Time"
                      name="pickupTime"
                      type="time"
                      value={formData.pickupTime}
                      onChange={handleTextChange}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Delivery Information</h3>
                <div className="space-y-4">
                  <TextField
                    fullWidth
                    label="Building Name"
                    name="dropoffBuildingName"
                    value={formData.dropoffBuildingName}
                    onChange={handleTextChange}
                    required
                  />
                  <TextField
                    fullWidth
                    label="Street Address"
                    name="dropoffStreetAddress"
                    value={formData.dropoffStreetAddress}
                    onChange={handleTextChange}
                    required
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <TextField
                      fullWidth
                      label="City"
                      name="dropoffCity"
                      value={formData.dropoffCity}
                      onChange={handleTextChange}
                      required
                    />
                    <TextField
                      fullWidth
                      label="State"
                      name="dropoffState"
                      value={formData.dropoffState}
                      onChange={handleTextChange}
                      required
                    />
                    <TextField
                      fullWidth
                      label="ZIP"
                      name="dropoffZip"
                      value={formData.dropoffZip}
                      onChange={handleTextChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextField
                      fullWidth
                      label="Date"
                      name="dropoffDate"
                      type="date"
                      value={formData.dropoffDate}
                      onChange={handleTextChange}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                    <TextField
                      fullWidth
                      label="Time"
                      name="dropoffTime"
                      type="time"
                      value={formData.dropoffTime}
                      onChange={handleTextChange}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Carrier Info */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Carrier Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-6">
                  <TextField
                    fullWidth
                    label="Company Name"
                    name="carrierCompanyName"
                    value={formData.carrierCompanyName}
                    onChange={handleTextChange}
                    required
                  />
                </div>
                <div className="md:col-span-6">
                  <TextField
                    fullWidth
                    label="Status"
                    name="carrierStatus"
                    value={formData.carrierStatus}
                    onChange={handleTextChange}
                    required
                  />
                </div>
                <div className="md:col-span-12">
                  <TextField
                    fullWidth
                    label="Street Address"
                    name="carrierStreetAddress"
                    value={formData.carrierStreetAddress}
                    onChange={handleTextChange}
                    required
                  />
                </div>
                <div className="md:col-span-4">
                  <TextField
                    fullWidth
                    label="City"
                    name="carrierCity"
                    value={formData.carrierCity}
                    onChange={handleTextChange}
                    required
                  />
                </div>
                <div className="md:col-span-4">
                  <TextField
                    fullWidth
                    label="State"
                    name="carrierState"
                    value={formData.carrierState}
                    onChange={handleTextChange}
                    required
                  />
                </div>
                <div className="md:col-span-4">
                  <TextField
                    fullWidth
                    label="ZIP"
                    name="carrierZip"
                    value={formData.carrierZip}
                    onChange={handleTextChange}
                    required
                  />
                </div>
                <div className="md:col-span-4">
                  <TextField
                    fullWidth
                    label="Point of Contact"
                    name="carrierPOC"
                    value={formData.carrierPOC}
                    onChange={handleTextChange}
                    required
                  />
                </div>
                <div className="md:col-span-4">
                  <TextField
                    fullWidth
                    label="POC Phone"
                    name="carrierPOCPhone"
                    value={formData.carrierPOCPhone}
                    onChange={handleTextChange}
                    required
                  />
                </div>
                <div className="md:col-span-4">
                  <TextField
                    fullWidth
                    label="POC Email"
                    name="carrierPOCEmail"
                    value={formData.carrierPOCEmail}
                    onChange={handleTextChange}
                    required
                    type="email"
                  />
                </div>
                <div className="md:col-span-6">
                  <TextField
                    fullWidth
                    label="Truck Number"
                    name="truckNumber"
                    value={formData.truckNumber}
                    onChange={handleTextChange}
                  />
                </div>
                <div className="md:col-span-6">
                  <TextField
                    fullWidth
                    label="Chassis Number"
                    name="chassisNumber"
                    value={formData.chassisNumber}
                    onChange={handleTextChange}
                  />
                </div>
              </div>
            </div>

            {/* Financial Info */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Financial Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4">
                  <TextField
                    fullWidth
                    label="Client Rate Con"
                    name="clientRateCon"
                    type="number"
                    value={formData.clientRateCon}
                    onChange={handleNumberChange}
                    required
                  />
                </div>
                <div className="md:col-span-4">
                  <TextField
                    fullWidth
                    label="Carrier Payout"
                    name="carrierPayout"
                    type="number"
                    value={formData.carrierPayout}
                    onChange={handleNumberChange}
                    required
                  />
                </div>
                <div className="md:col-span-4">
                  <TextField
                    fullWidth
                    label="Agent Payout"
                    name="agentPayout"
                    type="number"
                    value={formData.agentPayout}
                    onChange={handleNumberChange}
                    required
                  />
                </div>
                <div className="md:col-span-4">
                  <TextField
                    fullWidth
                    label="Gross Profit"
                    name="grossProfit"
                    type="number"
                    value={formData.grossProfit}
                    onChange={handleNumberChange}
                    required
                  />
                </div>
                <div className="md:col-span-4">
                  <TextField
                    fullWidth
                    label="Net Profit"
                    name="netProfit"
                    type="number"
                    value={formData.netProfit}
                    onChange={handleNumberChange}
                    required
                  />
                </div>
                <div className="md:col-span-4">
                  <TextField
                    fullWidth
                    label="Total Final Invoice"
                    name="totalFinalInvoice"
                    type="number"
                    value={formData.totalFinalInvoice}
                    onChange={handleNumberChange}
                    required
                  />
                </div>
                <div className="md:col-span-6">
                  <TextField
                    fullWidth
                    label="Total Weight"
                    name="totalWeight"
                    type="number"
                    value={formData.totalWeight}
                    onChange={handleNumberChange}
                    required
                  />
                </div>
                <div className="md:col-span-6">
                  <TextField
                    fullWidth
                    label="Actual Weight"
                    name="actualWeight"
                    type="number"
                    value={formData.actualWeight}
                    onChange={handleNumberChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Dates */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Important Dates</h3>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <TextField
                  fullWidth
                  label="Date Quoted to Client"
                  name="dateQuotedToClient"
                  type="date"
                  value={formData.dateQuotedToClient}
                  onChange={handleTextChange}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  label="Date Delivered"
                  name="dateDelivered"
                  type="date"
                  value={formData.dateDelivered}
                  onChange={handleTextChange}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  label="Date Invoiced Client"
                  name="dateInvoicedClient"
                  type="date"
                  value={formData.dateInvoicedClient}
                  onChange={handleTextChange}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  label="Date Carrier Paid"
                  name="dateCarrierPaid"
                  type="date"
                  value={formData.dateCarrierPaid}
                  onChange={handleTextChange}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  label="Date Agent Paid"
                  name="dateAgentPaid"
                  type="date"
                  value={formData.dateAgentPaid}
                  onChange={handleTextChange}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  label="Date Client Paid"
                  name="dateClientPaid"
                  type="date"
                  value={formData.dateClientPaid}
                  onChange={handleTextChange}
                  InputLabelProps={{ shrink: true }}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleTextChange}
                multiline
                rows={4}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions 
          sx={{ 
            p: { xs: 2, sm: 3 },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 2 },
            backgroundColor: "rgba(255, 215, 0, 0.1)",
          }}
        >
          <Button 
            onClick={onClose}
            fullWidth
            sx={{ 
              color: "#FFD700",
              '&:hover': {
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
              },
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth
            sx={{ 
              backgroundColor: "#FFD700",
              color: "black",
              '&:hover': {
                backgroundColor: "#FFC300",
              },
            }}
          >
            {loadId ? 'Update Load' : 'Create Load'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
