import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

type UserRole = "admin" | "manager" | "Broker Sales Agent" | "Carrier Sales Agent" | "Support" | "Accounting";
type UserStatus = "active" | "inactive";
type Manager = "Hector" | "Roy" | "Nasif" | "Ali" | "Andrew";

interface UserProfile {
  _id: Id<"userProfiles">;
  name: string;
  email: string;
  phone?: string;
  manager?: Manager;
  role: UserRole;
  status: UserStatus;
  commissionRate?: number;
  salary?: string;
  loadId?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  manager: Manager | "";
  role: UserRole;
  status: UserStatus;
  commissionRate: string;
  salary: string;
  loadId: string;
}

const defaultFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  manager: "",
  role: "Broker Sales Agent",
  status: "active",
  commissionRate: "",
  salary: "",
  loadId: "",
};

export function UsersPage() {
  const users = useQuery(api.users.getAllProfiles, {
    search: undefined,
    role: undefined,
    status: undefined,
  });
  const createProfile = useMutation(api.users.createProfile);
  const updateProfile = useMutation(api.users.updateProfile);
  const deleteProfile = useMutation(api.users.deleteProfile);
  const availableUsers = useQuery(api.users.getAvailableUsers);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  const handleEditUser = (user: UserProfile) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      manager: user.manager || "",
      role: user.role,
      status: user.status,
      commissionRate: user.commissionRate?.toString() || "",
      salary: user.salary || "",
      loadId: user.loadId || "",
    });
  };

  const handleClose = () => {
    setIsCreateModalOpen(false);
    setEditingUser(null);
    setFormData(defaultFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const profileData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        manager: formData.manager || undefined,
        role: formData.role,
        status: formData.status,
        commissionRate: formData.commissionRate ? parseFloat(formData.commissionRate) : undefined,
        salary: formData.salary || undefined,
        loadId: formData.loadId || undefined,
      };

      if (editingUser) {
        await updateProfile({
          id: editingUser._id,
          ...profileData,
        });
        toast.success("User updated successfully");
      } else {
        await createProfile(profileData);
        toast.success("User created successfully");
      }
      handleClose();
    } catch (error) {
      toast.error("Operation failed: " + (error as Error).message);
    }
  };

  const handleDelete = async (id: Id<"userProfiles">) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteProfile({ id });
        toast.success("User deleted successfully");
      } catch (error) {
        toast.error("Failed to delete user: " + (error as Error).message);
      }
    }
  };

  const handleChange = (field: keyof FormData) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white [text-shadow:_0_0_5px_#FFD700,_0_0_10px_#FFC300,_0_0_15px_#FFA500]">
          USERS MANAGEMENT
        </h1>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          variant="contained"
          sx={{
            backgroundColor: "#FFD700",
            color: "black",
            "&:hover": {
              backgroundColor: "#FFC300",
            },
          }}
        >
          Create User
        </Button>
      </div>

      <div className="bg-gray-900 rounded-lg p-6 border-2 border-yellow-400 shadow-[0_0_10px_2px_#FFD700]">
        <TableContainer 
          component={Paper}
          sx={{
            backgroundColor: 'transparent',
            "& .MuiTableCell-root": {
              color: "white",
              borderColor: "#FFD700",
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
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Load ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Manager</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Commission Rate</TableCell>
                <TableCell>Salary</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.loadId || "-"}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || "-"}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.manager || "-"}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>{user.commissionRate ? `${user.commissionRate}%` : "-"}</TableCell>
                  <TableCell>{user.salary || "-"}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEditUser(user)}
                      sx={{ color: 'blue' }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(user._id)}
                      sx={{ color: "#ef4444" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Dialog 
        open={isCreateModalOpen || !!editingUser} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
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
          },
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ backgroundColor: "#FFD700", color: "black" }}>
            {editingUser ? "Edit User" : "Create New User"}
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <div className="space-y-4 pt-4">
              <TextField
                fullWidth
                label="Load ID"
                value={formData.loadId}
                onChange={handleChange("loadId")}
                placeholder="L000000"
              />
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={handleChange("name")}
                required
              />
              {editingUser ? (
                <TextField
                  fullWidth
                  label="Email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  disabled
                />
              ) : (
                <FormControl fullWidth>
                  <InputLabel>Email</InputLabel>
                  <Select
                    value={formData.email}
                    onChange={handleChange("email")}
                    label="Email"
                    required
                  >
                    {availableUsers?.map((email) => (
                      <MenuItem key={email} value={email}>
                        {email}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={handleChange("phone")}
              />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  onChange={handleChange("role")}
                  label="Role"
                  required
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="Broker Sales Agent">Broker Sales Agent</MenuItem>
                  <MenuItem value="Carrier Sales Agent">Carrier Sales Agent</MenuItem>
                  <MenuItem value="Support">Support</MenuItem>
                  <MenuItem value="Accounting">Accounting</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Manager</InputLabel>
                <Select
                  value={formData.manager}
                  onChange={handleChange("manager")}
                  label="Manager"
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  <MenuItem value="Hector">Hector</MenuItem>
                  <MenuItem value="Roy">Roy</MenuItem>
                  <MenuItem value="Nasif">Nasif</MenuItem>
                  <MenuItem value="Ali">Ali</MenuItem>
                  <MenuItem value="Andrew">Andrew</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={handleChange("status")}
                  label="Status"
                  required
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Commission Rate (%)"
                type="number"
                value={formData.commissionRate}
                onChange={handleChange("commissionRate")}
                inputProps={{ step: "0.1" }}
              />
              <TextField
                fullWidth
                label="Salary"
                value={formData.salary}
                onChange={handleChange("salary")}
              />
            </div>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={handleClose}
              sx={{ color: "#FFD700" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#FFD700",
                color: "black",
                "&:hover": {
                  backgroundColor: "#FFC300",
                },
              }}
            >
              {editingUser ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
