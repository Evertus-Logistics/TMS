import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function CarrierTable({ onEdit }: { onEdit: (id: Id<"carriers"> | "new") => void }) {
  const carriers = useQuery(api.carriers.list) || [];
  const deleteCarrier = useMutation(api.carriers.remove);
  const theme = useTheme();

  const handleDelete = async (id: Id<"carriers">) => {
    if (window.confirm('Are you sure you want to delete this carrier?')) {
      await deleteCarrier({ id });
    }
  };

  const commonCellStyles = {
    borderBottom: '1px solid rgba(107, 114, 128, 0.7)', // border-gray-700
  };

  const headerCellStyles = {
    fontWeight: 600, 
    backgroundColor: 'black',
    color: '#FFD700',
    borderBottom: '2px solid #FFD700',
  };

  return (
    <Paper 
      sx={{ 
        width: '100%', 
        overflow: 'hidden',
        backgroundColor: 'transparent',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      }}
    >
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
        }}
      >
        <h2 className="text-2xl font-bold text-black [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFC300,_0_0_15px_#FFA500]">
          🚚 Carriers
        </h2>
        <Button
          onClick={() => onEdit("new")}
          sx={{
            px: 2,
            py: 1,
            backgroundColor: '#FFD700',
            color: 'black',
            borderRadius: '0.375rem',
            '&:hover': {
              backgroundColor: '#FFC300',
            },
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: 'none',
          }}
        >
          Add New Carrier
        </Button>
      </Box>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={headerCellStyles}>Company Name</TableCell>
              <TableCell sx={headerCellStyles}>POC</TableCell>
              <TableCell sx={headerCellStyles}>Phone</TableCell>
              <TableCell sx={headerCellStyles}>Email</TableCell>
              <TableCell sx={headerCellStyles}>MC#</TableCell>
              <TableCell sx={headerCellStyles}>Status</TableCell>
              <TableCell sx={headerCellStyles}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {carriers.map((carrier) => (
              <TableRow 
                key={carrier._id}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  },
                  backgroundColor: 'transparent',
                }}
              >
                <TableCell sx={{ color: 'white', ...commonCellStyles }}>
                  {carrier.carrierCompanyName}
                </TableCell>
                <TableCell sx={{ color: 'white', ...commonCellStyles }}>
                  {carrier.carrierPOC}
                </TableCell>
                <TableCell sx={{ color: 'white', ...commonCellStyles }}>
                  {carrier.carrierPOCPhone}
                </TableCell>
                <TableCell sx={{ color: 'white', ...commonCellStyles }}>
                  {carrier.carrierPOCEmail}
                </TableCell>
                <TableCell sx={{ color: 'white', ...commonCellStyles }}>
                  {carrier.mcNumber}
                </TableCell>
                <TableCell sx={{ ...commonCellStyles }}>
                  <Typography
                    component="span"
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: '16px',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      backgroundColor: carrier.status === 'Approved' 
                        ? 'rgba(34, 197, 94, 0.2)'
                        : 'rgba(239, 68, 68, 0.2)',
                      color: carrier.status === 'Approved' 
                        ? '#22c55e'
                        : '#ef4444',
                      textShadow: carrier.status === 'Approved'
                        ? '0 0 5px #22c55e'
                        : '0 0 5px #ef4444',
                    }}
                  >
                    {carrier.status}
                  </Typography>
                </TableCell>
                <TableCell sx={{ ...commonCellStyles }}>
                  <IconButton
                    size="small"
                    onClick={() => onEdit(carrier._id)}
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
                    onClick={() => handleDelete(carrier._id)}
                    sx={{ 
                      color: '#ef4444',
                      '&:hover': {
                        color: '#f87171',
                      }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
