import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import { pdf } from '@react-pdf/renderer';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Box,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { InvoicePDF } from "./InvoicePDF";
import { LoadForm } from "./loads/LoadForm";
import { toast } from "sonner";

type Load = Doc<"loads">;

export function InvoicePage() {
  const [viewMode, setViewMode] = useState<'pending' | 'completed'>('pending');
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoadFormOpen, setIsLoadFormOpen] = useState(false);
  
  const loads = useQuery(api.loads.getAllLoads) || [];
  const toggleStatus = useMutation(api.loads.toggleInvoiceStatus);

  // Calculate metrics
  const totalReceived = loads
    .filter((load: Load) => load.dateClientPaid)
    .reduce((sum: number, load: Load) => sum + (load.totalFinalInvoice || 0), 0);

  const totalPending = loads
    .filter((load: Load) => !load.dateClientPaid && load.dateInvoicedClient)
    .reduce((sum: number, load: Load) => sum + (load.totalFinalInvoice || 0), 0);

  const totalOverall = totalReceived + totalPending;

  // Filter and sort loads
  const filteredLoads = loads
    .filter((load: Load) => {
      const matchesViewMode = viewMode === 'pending' 
        ? !load.dateClientPaid && load.dateInvoicedClient
        : load.dateClientPaid;
      
      const matchesSearch = searchTerm === "" || 
        load.customerBusinessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        load._id.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesViewMode && matchesSearch;
    })
    .sort((a: Load, b: Load) => {
      if (sortBy === 'date') {
        const dateA = a.dateInvoicedClient || '';
        const dateB = b.dateInvoicedClient || '';
        return sortOrder === 'asc' 
          ? dateA.localeCompare(dateB)
          : dateB.localeCompare(dateA);
      } else {
        const amountA = a.totalFinalInvoice || 0;
        const amountB = b.totalFinalInvoice || 0;
        return sortOrder === 'asc'
          ? amountA - amountB
          : amountB - amountA;
      }
    });

  const handleGeneratePDF = async (load: Load) => {
    try {
      const blob = await pdf(<InvoicePDF load={load} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${load._id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleToggleStatus = async (load: Load) => {
    try {
      await toggleStatus({ id: load._id, isPaid: !load.dateClientPaid });
      toast.success(`Invoice marked as ${load.dateClientPaid ? 'pending' : 'paid'}`);
    } catch (error) {
      toast.error("Failed to update invoice status: " + (error as Error).message);
    }
  };

  return (
    <>
      <div className="p-8 bg-black min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFC300,_0_0_15px_#FFA500]">
            INVOICES
          </h1>
          <img 
            src="https://effervescent-camel-645.convex.cloud/api/storage/05b48caa-f6b9-4de0-b356-b91e1164defe" 
            alt="Logo" 
            className="h-16"
          />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <Box className="bg-gray-900 p-6 rounded-lg border-2 border-yellow-400 shadow-[0_0_10px_2px_#FFD700] flex flex-col items-center">
            <Typography variant="h6" className="text-[#FFD700] mb-2">Total Received</Typography>
            <CircularProgress
              variant="determinate"
              value={totalOverall ? (totalReceived / totalOverall) * 100 : 0}
              size={80}
              thickness={4}
              sx={{ color: '#FFD700' }}
            />
            <Typography variant="h5" className="text-white mt-2">
              ${totalReceived.toLocaleString()}
            </Typography>
          </Box>
          <Box className="bg-gray-900 p-6 rounded-lg border-2 border-yellow-400 shadow-[0_0_10px_2px_#FFD700] flex flex-col items-center">
            <Typography variant="h6" className="text-[#FFD700] mb-2">Total Pending</Typography>
            <CircularProgress
              variant="determinate"
              value={totalOverall ? (totalPending / totalOverall) * 100 : 0}
              size={80}
              thickness={4}
              sx={{ color: '#FFC300' }}
            />
            <Typography variant="h5" className="text-white mt-2">
              ${totalPending.toLocaleString()}
            </Typography>
          </Box>
          <Box className="bg-gray-900 p-6 rounded-lg border-2 border-yellow-400 shadow-[0_0_10px_2px_#FFD700] flex flex-col items-center">
            <Typography variant="h6" className="text-[#FFD700] mb-2">Total Overall</Typography>
            <CircularProgress
              variant="determinate"
              value={100}
              size={80}
              thickness={4}
              sx={{ color: '#FFD700' }}
            />
            <Typography variant="h5" className="text-white mt-2">
              ${totalOverall.toLocaleString()}
            </Typography>
          </Box>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-4 items-center">
          <Button
            onClick={() => setViewMode('pending')}
            variant={viewMode === 'pending' ? 'contained' : 'outlined'}
            size="small"
            sx={{
              backgroundColor: viewMode === 'pending' ? "#FFD700" : "transparent",
              color: viewMode === 'pending' ? "black" : "#FFD700",
              borderColor: "#FFD700",
              fontSize: '0.875rem',
              '&:hover': {
                backgroundColor: viewMode === 'pending' ? "#FFC300" : "rgba(255, 215, 0, 0.1)",
                borderColor: "#FFD700",
              },
            }}
          >
            Pending Invoices
          </Button>
          <Button
            onClick={() => setViewMode('completed')}
            variant={viewMode === 'completed' ? 'contained' : 'outlined'}
            size="small"
            sx={{
              backgroundColor: viewMode === 'completed' ? "#FFD700" : "transparent",
              color: viewMode === 'completed' ? "black" : "#FFD700",
              borderColor: "#FFD700",
              fontSize: '0.875rem',
              '&:hover': {
                backgroundColor: viewMode === 'completed' ? "#FFC300" : "rgba(255, 215, 0, 0.1)",
                borderColor: "#FFD700",
              },
            }}
          >
            Completed Invoices
          </Button>

          <TextField
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{
              ml: 'auto',
              '& .MuiOutlinedInput-root': {
                color: 'white',
                fontSize: '0.875rem',
                '& fieldset': {
                  borderColor: '#FFD700',
                },
                '&:hover fieldset': {
                  borderColor: '#FFC300',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FFD700',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#FFD700', fontSize: '1.2rem' }} />
                </InputAdornment>
              ),
            }}
          />

          <IconButton
            onClick={(e) => setFilterAnchorEl(e.currentTarget)}
            size="small"
            sx={{ color: '#FFD700' }}
          >
            <FilterListIcon fontSize="small" />
          </IconButton>

          <IconButton
            onClick={(e) => setSortAnchorEl(e.currentTarget)}
            size="small"
            sx={{ color: '#FFD700' }}
          >
            <SortIcon fontSize="small" />
          </IconButton>

          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={() => setFilterAnchorEl(null)}
            PaperProps={{
              sx: {
                backgroundColor: '#1a1a1a',
                border: '1px solid #FFD700',
                '& .MuiMenuItem-root': {
                  color: '#FFD700',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255, 215, 0, 0.2)',
                  },
                },
              },
            }}
          >
            <MenuItem 
              onClick={() => {
                setViewMode('pending');
                setFilterAnchorEl(null);
              }}
              selected={viewMode === 'pending'}
            >
              Show Pending
            </MenuItem>
            <MenuItem 
              onClick={() => {
                setViewMode('completed');
                setFilterAnchorEl(null);
              }}
              selected={viewMode === 'completed'}
            >
              Show Completed
            </MenuItem>
          </Menu>

          <Menu
            anchorEl={sortAnchorEl}
            open={Boolean(sortAnchorEl)}
            onClose={() => setSortAnchorEl(null)}
            PaperProps={{
              sx: {
                backgroundColor: '#1a1a1a',
                border: '1px solid #FFD700',
                '& .MuiMenuItem-root': {
                  color: '#FFD700',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  },
                },
              },
            }}
          >
            <MenuItem onClick={() => {
              setSortBy('date');
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              setSortAnchorEl(null);
            }}>
              Sort by Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
            </MenuItem>
            <MenuItem onClick={() => {
              setSortBy('amount');
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              setSortAnchorEl(null);
            }}>
              Sort by Amount {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
            </MenuItem>
          </Menu>
        </div>

        {/* Invoices Table */}
        <div className="bg-gray-900 rounded-lg p-6 border-2 border-yellow-400 shadow-[0_0_10px_2px_#FFD700]">
          <TableContainer 
            component={Paper}
            sx={{
              backgroundColor: 'transparent',
              "& .MuiTableCell-root": {
                color: "white",
                borderColor: "#FFD700",
                fontSize: '0.875rem',
                padding: '8px 16px',
              },
              "& .MuiTableHead-root .MuiTableCell-root": {
                backgroundColor: "#1a1a1a",
                fontWeight: "bold",
                color: "#FFD700",
              },
              "& .MuiTableBody-root .MuiTableRow-root:hover": {
                backgroundColor: "rgba(255, 215, 0, 0.1)",
              },
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Load ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLoads.map((load: Load) => (
                  <TableRow key={load._id}>
                    <TableCell>{load._id}</TableCell>
                    <TableCell>{load.customerBusinessName}</TableCell>
                    <TableCell>{load.dateInvoicedClient}</TableCell>
                    <TableCell>${load.totalFinalInvoice?.toLocaleString()}</TableCell>
                    <TableCell>
                      {load.dateClientPaid ? (
                        <span className="text-green-500">Paid</span>
                      ) : (
                        <span className="text-yellow-500">Pending</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          startIcon={<PictureAsPdfIcon />}
                          onClick={() => handleGeneratePDF(load)}
                          size="small"
                          sx={{
                            color: "#FFD700",
                            fontSize: '0.875rem',
                            '&:hover': {
                              backgroundColor: "rgba(255, 215, 0, 0.1)",
                            },
                          }}
                        >
                          View PDF
                        </Button>
                        <IconButton
                          onClick={() => handleToggleStatus(load)}
                          size="small"
                          sx={{
                            color: load.dateClientPaid ? "#4CAF50" : "#FFD700",
                            '&:hover': {
                              backgroundColor: "rgba(255, 215, 0, 0.1)",
                            },
                          }}
                        >
                          {load.dateClientPaid ? <CancelIcon /> : <CheckCircleIcon />}
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <div className="mt-8 text-center text-white text-sm">
          <p>Evertus logistics thanks you for your business</p>
          <p>For any issues, please contact accounting at: <a href="mailto:Accounting@Evertu-logistics.com" className="text-[#FFD700]">Accounting@Evertu-logistics.com</a></p>
        </div>
      </div>

      <LoadForm 
        open={isLoadFormOpen}
        onClose={() => setIsLoadFormOpen(false)}
      />
    </>
  );
}
