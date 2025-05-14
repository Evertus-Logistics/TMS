import React, { useState, ReactElement } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DescriptionIcon from "@mui/icons-material/Description";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import BarChartIcon from "@mui/icons-material/BarChart";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import SettingsIcon from "@mui/icons-material/Settings";
import { CustomSignOutButton } from "./CustomSignOutButton";

interface SidebarProps {
  onTabChange?: (tab: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: <DashboardIcon />, role: ["all"], path: "/" },
  { id: "loadDashboard", label: "Load Dashboard", icon: <LocalShippingIcon />, role: ["all"], path: "/loads" },
  { id: "records", label: "Records", icon: <DescriptionIcon />, role: ["all"], path: "/records" },
  { id: "users", label: "Users", icon: <GroupIcon />, role: ["admin"], path: "/users" },
  { id: "todo", label: "To Do", icon: <AssignmentIcon />, role: ["all"], path: "/todo" },
  { id: "invoicing", label: "Invoicing", icon: <ReceiptLongIcon />, role: ["all"], path: "/invoices" },
  { id: "accounting", label: "Accounting", icon: <AccountBalanceIcon />, role: ["admin", "Accounting"], path: "/accounting" },
  { id: "reports", label: "Reports", icon: <BarChartIcon />, role: ["admin", "manager"], path: "/reports" },
  { id: "support", label: "Support", icon: <SupportAgentIcon />, role: ["all"], path: "/support" },
  { id: "settings", label: "Settings", icon: <SettingsIcon />, role: ["all"], path: "/settings" },
];

export function Sidebar({ onTabChange }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const profile = useQuery(api.users.getProfile);

  const isAuthorized = (roles: string[]) => {
    if (!profile) return false;
    if (roles.includes("all")) return true;
    return roles.some(role => role === profile.role);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const drawer = (
    <Box sx={{ height: "100%", backgroundColor: "black", color: "white" }}>
      {/* Logo */}
      <Box
        sx={{
          p: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 0,
        }}
      >
        <img 
          src="https://effervescent-camel-645.convex.cloud/api/storage/05b48caa-f6b9-4de0-b356-b91e1164defe"
          alt="Logo"
          style={{
            height: isCollapsed ? '60px' : '130px',
            transition: 'height 0.2s ease-in-out',
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          p: 1,
        }}
      >
        <IconButton
          onClick={toggleCollapse}
          sx={{
            color: "#FFD700",
            '&:hover': {
              backgroundColor: "rgba(255, 215, 0, 0.1)",
            },
          }}
        >
          {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>
      <List>
        {menuItems.filter(item => isAuthorized(item.role)).map((item) => (
          <ListItem key={item.id} disablePadding>
            <Tooltip title={isCollapsed ? item.label : ""} placement="right">
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                  if (onTabChange) {
                    onTabChange(item.id);
                  }
                }}
                sx={{
                  minHeight: 48,
                  justifyContent: isCollapsed ? 'center' : 'initial',
                  px: 2.5,
                  backgroundColor:
                    location.pathname === item.path
                      ? "rgba(255, 215, 0, 0.15)"
                      : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(255, 215, 0, 0.35)",
                  },
                  "& .MuiListItemIcon-root": {
                    color: location.pathname === item.path ? "black" : "#FFD700",
                    minWidth: isCollapsed ? 0 : 56,
                    mr: isCollapsed ? 0 : 3,
                    justifyContent: 'center',
                    filter: location.pathname === item.path 
                      ? "drop-shadow(0 0 5px #FFD700) drop-shadow(0 0 10px #FFC300)"
                      : "none",
                  },
                  "& .MuiListItemText-primary": {
                    color: location.pathname === item.path ? "black" : "white",
                    opacity: isCollapsed ? 0 : 1,
                    fontSize: "0.9rem",
                    fontWeight: location.pathname === item.path ? 600 : 400,
                    textShadow: location.pathname === item.path 
                      ? "0 0 5px #FFD700, 0 0 10px #FFC300"
                      : "none",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
                <ListItemText 
                  primary={item.label} 
                  sx={{ 
                    display: isCollapsed ? 'none' : 'block',
                  }} 
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          p: 2,
        }}
      >
        <CustomSignOutButton isCollapsed={isCollapsed} />
      </Box>
    </Box>
  );

  const drawerWidth = isCollapsed ? 65 : 240;

  return (
    <Box>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{
          mr: 2,
          display: { sm: "none" },
          position: "fixed",
          top: 10,
          left: 10,
          zIndex: 1100,
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          "&:hover": {
            backgroundColor: "rgba(255, 215, 0, 0.1)",
          },
        }}
      >
        <MenuIcon />
      </IconButton>
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
          transition: "width 0.2s ease-in-out",
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "black",
              borderRight: "2px solid #FFD700",
              boxShadow: "0 0 10px 2px #FFD700",
              transition: "width 0.2s ease-in-out",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "black",
              borderRight: "2px solid #FFD700",
              boxShadow: "0 0 10px 2px #FFD700",
              transition: "width 0.2s ease-in-out",
              overflowX: "hidden",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}
