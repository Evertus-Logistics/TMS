import React, { useState, useEffect } from 'react';
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
  useTheme,
  IconButton,
} from '@mui/material';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { toast } from "sonner";

const PAYMENT_OPTIONS = [
  'Standard',
  'Net30',
  'Quick-Pay 5%',
] as const;

const PAYMENT_METHODS = [
  'ACH',
  'Paper-Check',
  'Wire $25-$90 fee',
  'Zelle 5% fee',
  'Cashapp or Venmo 7% Fee',
] as const;

const STATUS_OPTIONS = [
  'Approved',
  'DO NOT USE',
] as const;

interface CarrierFormProps {
  open: boolean;
  onClose: () => void;
  carrierId?: Id<"carriers"> | "new";
}

type PaymentOption = typeof PAYMENT_OPTIONS[number];
type PaymentMethod = typeof PAYMENT_METHODS[number];
type Status = typeof STATUS_OPTIONS[number];

interface FormData {
  carrierCompanyName: string;
  carrierStreetAddress: string;
  carrierCity: string;
  carrierState: string;
  carrierZip: string;
  carrierPOC: string;
  carrierPOCPhone: string;
  carrierPOCEmail: string;
  truckNumber: string;
  chassisNumber: string;
  mcNumber: string;
  dotNumber: string;
  einNumber: string;
  paymentOption: PaymentOption;
  paymentMethod: PaymentMethod;
  website: string;
  saferScoreLink: string;
  status: Status;
}

const defaultFormData: FormData = {
  carrierCompanyName: '',
  carrierStreetAddress: '',
  carrierCity: '',
  carrierState: '',
  carrierZip: '',
  carrierPOC: '',
  carrierPOCPhone: '',
  carrierPOCEmail: '',
  truckNumber: '',
  chassisNumber: '',
  mcNumber: '',
  dotNumber: '',
  einNumber: '',
  paymentOption: PAYMENT_OPTIONS[0],
  paymentMethod: PAYMENT_METHODS[0],
  website: '',
  saferScoreLink: '',
  status: STATUS_OPTIONS[0],
};

export function CarrierForm({ open, onClose, carrierId }: CarrierFormProps) {
  const theme = useTheme();
  const createCarrier = useMutation(api.carriers.create);
  const updateCarrier = useMutation(api.carriers.update);
  const uploadW9 = useMutation(api.carriers.uploadW9);
  const uploadSupportingDocs = useMutation(api.carriers.uploadSupportingDocs);
  const generateUploadUrl = useMutation(api.clients.generateUploadUrl);
  const carrier = carrierId && carrierId !== 'new' ? useQuery(api.carriers.get, { id: carrierId }) : null;

  const [formData, setFormData] = useState<FormData>(defaultFormData);

  // Update form data when carrier data changes
  useEffect(() => {
    if (carrier) {
      setFormData({
        carrierCompanyName: carrier.carrierCompanyName,
        carrierStreetAddress: carrier.carrierStreetAddress,
        carrierCity: carrier.carrierCity,
        carrierState: carrier.carrierState,
        carrierZip: carrier.carrierZip,
        carrierPOC: carrier.carrierPOC,
        carrierPOCPhone: carrier.carrierPOCPhone,
        carrierPOCEmail: carrier.carrierPOCEmail,
        truckNumber: carrier.truckNumber || '',
        chassisNumber: carrier.chassisNumber || '',
        mcNumber: carrier.mcNumber,
        dotNumber: carrier.dotNumber,
        einNumber: carrier.einNumber,
        paymentOption: carrier.paymentOption as PaymentOption,
        paymentMethod: carrier.paymentMethod as PaymentMethod,
        website: carrier.website || '',
        saferScoreLink: carrier.saferScoreLink,
        status: carrier.status as Status,
      });
    } else if (carrierId === 'new') {
      setFormData(defaultFormData);
    }
  }, [carrier, carrierId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (carrierId === 'new') {
        await createCarrier(formData);
        toast.success("Carrier created successfully");
      } else if (carrierId) {
        await updateCarrier({ id: carrierId, ...formData });
        toast.success("Carrier updated successfully");
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

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'w9' | 'supporting') => {
    if (!carrierId || carrierId === 'new' || !event.target.files?.[0]) return;
    
    const file = event.target.files[0];
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
      if (type === 'w9') {
        await uploadW9({ carrierId, fileId: storageId });
        toast.success("W9 uploaded successfully");
      } else {
        await uploadSupportingDocs({ carrierId, fileId: storageId });
        toast.success("Supporting documents uploaded successfully");
      }
    } catch (error) {
      toast.error("Upload failed: " + (error as Error).message);
    }
  };

  const inputProps = {
    sx: {
      '& .MuiOutlinedInput-root': {
        '&:hover fieldset': {
          borderColor: theme.palette.primary.main,
        },
      },
      '& .MuiInputLabel-root': {
        color: theme.palette.grey[600],
      },
      '& .MuiInputLabel-root.Mui-focused': {
        color: theme.palette.primary.main,
      },
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '8px',
          backgroundColor: "#1a1a1a",
          color: "white",
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
          },
          "& .MuiSelect-icon": {
            color: "#FFD700",
          },
          "& .MuiMenuItem-root": {
            color: "black",
          },
        }
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: "#FFD700",
          color: 'black',
          fontWeight: 600,
        }}
      >
        {carrierId === 'new' ? 'Add New Carrier' : 'Edit Carrier'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ mt: 2 }}>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <TextField
                {...inputProps}
                fullWidth
                label="Company Name"
                name="carrierCompanyName"
                value={formData.carrierCompanyName}
                onChange={handleTextChange}
                required
              />
            </div>
            <div className="col-span-12">
              <TextField
                {...inputProps}
                fullWidth
                label="Street Address"
                name="carrierStreetAddress"
                value={formData.carrierStreetAddress}
                onChange={handleTextChange}
                required
              />
            </div>
            <div className="col-span-4">
              <TextField
                {...inputProps}
                fullWidth
                label="City"
                name="carrierCity"
                value={formData.carrierCity}
                onChange={handleTextChange}
                required
              />
            </div>
            <div className="col-span-4">
              <TextField
                {...inputProps}
                fullWidth
                label="State"
                name="carrierState"
                value={formData.carrierState}
                onChange={handleTextChange}
                required
              />
            </div>
            <div className="col-span-4">
              <TextField
                {...inputProps}
                fullWidth
                label="ZIP Code"
                name="carrierZip"
                value={formData.carrierZip}
                onChange={handleTextChange}
                required
              />
            </div>
            <div className="col-span-12">
              <TextField
                {...inputProps}
                fullWidth
                label="Point of Contact"
                name="carrierPOC"
                value={formData.carrierPOC}
                onChange={handleTextChange}
                required
              />
            </div>
            <div className="col-span-6">
              <TextField
                {...inputProps}
                fullWidth
                label="POC Phone"
                name="carrierPOCPhone"
                value={formData.carrierPOCPhone}
                onChange={handleTextChange}
                required
              />
            </div>
            <div className="col-span-6">
              <TextField
                {...inputProps}
                fullWidth
                label="POC Email"
                name="carrierPOCEmail"
                value={formData.carrierPOCEmail}
                onChange={handleTextChange}
                required
                type="email"
              />
            </div>
            <div className="col-span-6">
              <TextField
                {...inputProps}
                fullWidth
                label="Truck # (Optional)"
                name="truckNumber"
                value={formData.truckNumber}
                onChange={handleTextChange}
              />
            </div>
            <div className="col-span-6">
              <TextField
                {...inputProps}
                fullWidth
                label="Chassis # (Optional)"
                name="chassisNumber"
                value={formData.chassisNumber}
                onChange={handleTextChange}
              />
            </div>
            <div className="col-span-4">
              <TextField
                {...inputProps}
                fullWidth
                label="MC #"
                name="mcNumber"
                value={formData.mcNumber}
                onChange={handleTextChange}
                required
              />
            </div>
            <div className="col-span-4">
              <TextField
                {...inputProps}
                fullWidth
                label="DOT #"
                name="dotNumber"
                value={formData.dotNumber}
                onChange={handleTextChange}
                required
              />
            </div>
            <div className="col-span-4">
              <TextField
                {...inputProps}
                fullWidth
                label="EIN #"
                name="einNumber"
                value={formData.einNumber}
                onChange={handleTextChange}
                required
              />
            </div>
            <div className="col-span-6">
              <FormControl fullWidth {...inputProps}>
                <InputLabel>Payment Option</InputLabel>
                <Select
                  name="paymentOption"
                  value={formData.paymentOption}
                  onChange={handleSelectChange}
                  label="Payment Option"
                  required
                >
                  {PAYMENT_OPTIONS.map(option => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="col-span-6">
              <FormControl fullWidth {...inputProps}>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleSelectChange}
                  label="Payment Method"
                  required
                >
                  {PAYMENT_METHODS.map(method => (
                    <MenuItem key={method} value={method}>
                      {method}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="col-span-12">
              <TextField
                {...inputProps}
                fullWidth
                label="Website (Optional)"
                name="website"
                value={formData.website}
                onChange={handleTextChange}
              />
            </div>
            <div className="col-span-12">
              <TextField
                {...inputProps}
                fullWidth
                label="Safer Score Weblink"
                name="saferScoreLink"
                value={formData.saferScoreLink}
                onChange={handleTextChange}
                required
              />
            </div>
            <div className="col-span-12">
              <FormControl fullWidth {...inputProps}>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleSelectChange}
                  label="Status"
                  required
                >
                  {STATUS_OPTIONS.map(status => (
                    <MenuItem 
                      key={status} 
                      value={status}
                      sx={{
                        color: status === 'Approved' 
                          ? theme.palette.success.main 
                          : theme.palette.error.main,
                        fontWeight: 500,
                      }}
                    >
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* File Upload Section */}
            {carrierId && carrierId !== 'new' && (
              <div className="col-span-12 flex gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    id="w9-upload"
                    onChange={(e) => handleFileUpload(e, 'w9')}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                  />
                  <label
                    htmlFor="w9-upload"
                    className="flex items-center justify-center gap-2 p-2 border-2 border-dashed border-[#FFD700] rounded-lg cursor-pointer
                      hover:bg-[#FFD700]/10 transition-colors"
                  >
                    <UploadFileIcon sx={{ color: '#FFD700' }} />
                    <span className="text-[#FFD700]">Upload W9</span>
                  </label>
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    id="supporting-docs-upload"
                    onChange={(e) => handleFileUpload(e, 'supporting')}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                  />
                  <label
                    htmlFor="supporting-docs-upload"
                    className="flex items-center justify-center gap-2 p-2 border-2 border-dashed border-[#FFD700] rounded-lg cursor-pointer
                      hover:bg-[#FFD700]/10 transition-colors"
                  >
                    <UploadFileIcon sx={{ color: '#FFD700' }} />
                    <span className="text-[#FFD700]">Upload Supporting Docs</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: "rgba(255, 215, 0, 0.1)" }}>
          <Button 
            onClick={onClose}
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
            sx={{ 
              backgroundColor: "#FFD700",
              color: "black",
              '&:hover': {
                backgroundColor: "#FFC300",
              },
            }}
          >
            {carrierId === 'new' ? 'Create' : 'Update'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
