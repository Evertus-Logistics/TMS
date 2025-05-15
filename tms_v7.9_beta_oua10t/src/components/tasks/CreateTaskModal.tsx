import { useState } from "react";
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
} from "@mui/material";

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
}

type Priority = "Low" | "Medium" | "High" | "EMERGENCY";

interface FormData {
  title: string;
  description: string;
  priority: Priority;
  assigneeId: Id<"userProfiles"> | "";
  dueDate: string;
}

export function CreateTaskModal({ open, onClose }: CreateTaskModalProps) {
  const createTask = useMutation(api.tasks.createTask);
  const users = useQuery(api.users.getAllProfiles, {
    search: undefined,
    role: undefined,
    status: undefined,
  }) || [];

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    priority: "Low",
    assigneeId: "",
    dueDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.assigneeId) return;
    
    try {
      await createTask({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        assigneeId: formData.assigneeId,
        dueDate: formData.dueDate || undefined,
      });
      onClose();
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ backgroundColor: "#FFD700", color: "black" }}>
        Create New Task
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ mt: 2 }}>
          <div className="space-y-4">
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                label="Priority"
                required
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="EMERGENCY">EMERGENCY</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Assign To</InputLabel>
              <Select
                name="assigneeId"
                value={formData.assigneeId}
                onChange={handleChange}
                label="Assign To"
                required
              >
                {users.map((user: any) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.name} ({user.role})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              type="date"
              label="Due Date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
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
            Create Task
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
