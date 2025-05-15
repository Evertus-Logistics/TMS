import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'sonner';

interface PayItem {
  description: string;
  notes: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface BOLFormProps {
  open: boolean;
  onClose: () => void;
}

export function BOLForm({ open, onClose }: BOLFormProps) {
  const createBOL = useMutation(api.bols.create);
  const [payItems, setPayItems] = useState<PayItem[]>([{
    description: '',
    notes: '',
    quantity: 0,
    rate: 0,
    amount: 0
  }]);

  const [formData, setFormData] = useState({
    loadId: '',
    date: new Date().toISOString().split('T')[0],
    equipmentType: '',
    weight: '',
    equipmentLength: '',
    commodity: '',
    distance: '',
    containerNumber: '',
    tractorNumber: '',
    
    carrierName: '',
    carrierPOCName: '',
    carrierPOCEmail: '',
    carrierAddress: '',
    dotNumber: '',
    driverName: '',
    mcNumber: '',
    carrierPOCPhone: '',
    notesAndReferences: '',
    
    pickupCompanyName: '',
    pickupAddress: '',
    pickupCity: '',
    pickupState: '',
    pickupZip: '',
    
    deliveryCompanyName: '',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryState: '',
    deliveryZip: '',
    
    note: '',
    
    signerName: '',
    signature: '',
    signDate: new Date().toISOString().split('T')[0],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayItemChange = (index: number, field: keyof PayItem, value: string | number) => {
    const newPayItems = [...payItems];
    newPayItems[index] = {
      ...newPayItems[index],
      [field]: value,
      amount: field === 'quantity' || field === 'rate' 
        ? Number(newPayItems[index].quantity) * Number(newPayItems[index].rate)
        : newPayItems[index].amount
    };
    setPayItems(newPayItems);
  };

  const addPayItem = () => {
    if (payItems.length < 7) {
      setPayItems([...payItems, {
        description: '',
        notes: '',
        quantity: 0,
        rate: 0,
        amount: 0
      }]);
    }
  };

  const removePayItem = (index: number) => {
    setPayItems(payItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const grandTotal = payItems.reduce((sum, item) => sum + item.amount, 0);
      await createBOL({
        ...formData,
        payItems,
        grandTotal,
      });
      toast.success('BOL created successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to create BOL: ' + (error as Error).message);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'black',
          border: '2px solid #FFD700',
          boxShadow: '0 0 10px 2px #FFD700',
        }
      }}
    >
      <DialogTitle sx={{ color: '#FFD700', borderBottom: '1px solid #FFD700' }}>
        New Bill of Lading
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          {/* Load Details Section */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
              Load Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="loadId"
                  label="Load ID"
                  value={formData.loadId}
                  onChange={handleInputChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: '#FFD700',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#FFD700',
                    },
                  }}
                />
              </Grid>
              {/* Add other load detail fields */}
            </Grid>
          </Grid>

          {/* Carrier Information Section */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
              Carrier Information
            </Typography>
            <Grid container spacing={2}>
              {/* Add carrier information fields */}
            </Grid>
          </Grid>

          {/* Locations Section */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
              Locations
            </Typography>
            <Grid container spacing={2}>
              {/* Add location fields */}
            </Grid>
          </Grid>

          {/* Pay Items Section */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
              Pay Items
            </Typography>
            <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#FFD700' }}>Description</TableCell>
                    <TableCell sx={{ color: '#FFD700' }}>Notes</TableCell>
                    <TableCell sx={{ color: '#FFD700' }}>Quantity</TableCell>
                    <TableCell sx={{ color: '#FFD700' }}>Rate</TableCell>
                    <TableCell sx={{ color: '#FFD700' }}>Amount</TableCell>
                    <TableCell sx={{ color: '#FFD700' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TextField
                          fullWidth
                          value={item.description}
                          onChange={(e) => handlePayItemChange(index, 'description', e.target.value)}
                          sx={{ input: { color: 'white' } }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          value={item.notes}
                          onChange={(e) => handlePayItemChange(index, 'notes', e.target.value)}
                          sx={{ input: { color: 'white' } }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handlePayItemChange(index, 'quantity', Number(e.target.value))}
                          sx={{ input: { color: 'white' } }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={item.rate}
                          onChange={(e) => handlePayItemChange(index, 'rate', Number(e.target.value))}
                          sx={{ input: { color: 'white' } }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'white' }}>
                        ${item.amount}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => removePayItem(index)}
                          sx={{ color: '#FFD700' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button
              startIcon={<AddIcon />}
              onClick={addPayItem}
              disabled={payItems.length >= 7}
              sx={{
                mt: 2,
                color: '#FFD700',
                borderColor: '#FFD700',
                '&:hover': {
                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                },
              }}
            >
              Add Pay Item
            </Button>
          </Grid>

          {/* Signature Section */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
              Signature
            </Typography>
            <Grid container spacing={2}>
              {/* Add signature fields */}
            </Grid>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            onClick={onClose}
            sx={{
              color: '#FFD700',
              borderColor: '#FFD700',
              '&:hover': {
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: '#FFD700',
              color: 'black',
              '&:hover': {
                backgroundColor: '#FFC300',
              },
            }}
          >
            Create BOL
          </Button>
        </Box>

        {/* Disclaimers */}
        <Typography variant="caption" sx={{ color: 'gray', mt: 4, display: 'block', fontSize: 7 }}>
          Net30 Payout $0 Processing fee I Quick pay 5% Processing fee 72 hour payout
          {/* Add other disclaimers */}
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
