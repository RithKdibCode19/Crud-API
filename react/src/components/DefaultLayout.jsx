import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import axiosClient from "../axios-client.js";
import { useEffect } from "react";
import {
  Box,
  Drawer,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  AppBar,
  Button,
  Menu,
  MenuItem,
  CssBaseline,
  Paper,
} from "@mui/material";
import {
  FaHome,
  FaShoppingCart,
  FaBox,
  FaUsers,
  FaChartBar,
  FaCog,
} from "react-icons/fa";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useState } from "react";

const drawerWidth = 220;

const navItems = [
  { text: "Dashboard", icon: <FaHome />, path: "/" },
  { text: "POS", icon: <FaShoppingCart />, path: "/pos" },
  { text: "Products", icon: <FaBox />, path: "/products" },
  { text: "Category", icon: <FaBox />, path: "/categories" },
  { text: "Customers", icon: <FaUsers />, path: "/customers" },
  { text: "Reports", icon: <FaChartBar />, path: "/reports" },
  { text: "User", icon: <FaChartBar />, path: "/user" },
];

export default function DefaultLayout() {
  const { user, token, setUser, setToken, notification } = useStateContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" />;
  }

  const onLogout = async (ev) => {
    ev.preventDefault();
    try {
      await axiosClient.post("/logout");
    } catch (e) {
      // Optionally handle error (e.g., show notification)
    } finally {
      setUser({});
      setToken(null);
    }
  };

  useEffect(() => {
    axiosClient.get("/user").then(({ data }) => {
      setUser(data);
    });
    // eslint-disable-next-line
  }, []);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Box sx={{ display: "flex", bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      <CssBaseline />
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor:
              "linear-gradient(135deg, #512da8 0%,rgb(16, 78, 141) 100%)", // Gradient purple to blue
            color: "#fff",
            borderTopRightRadius: 24,
            borderBottomRightRadius: 24,
            boxShadow: 4,
            backgroundImage:
              "linear-gradient(135deg,rgb(75, 34, 170) 0%,rgb(17, 71, 125) 100%)", // fallback for MUI
          },
        }}
      >
        <Toolbar sx={{ minHeight: 72 }}>
          <Typography
            variant="h6"
            noWrap
            sx={{ fontWeight: 700, letterSpacing: 1 }}
          >
            Cafe POS
          </Typography>
        </Toolbar>
        <List>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem
                button
                key={item.text}
                component={Link}
                to={item.path}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                  pl: 2,
                  py: 1.2,
                  bgcolor: isActive ? "rgba(255,255,255,0.18)" : "inherit",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.10)",
                  },
                  transition: "background 0.2s",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? "#ffe082" : "#fff",
                    minWidth: 36,
                    fontSize: 26,
                    mr: 1,
                    ...(isActive && { color: "#ffe082" }),
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        fontWeight: isActive ? 700 : 500,
                        fontSize: 17,
                        color: isActive ? "#ffe082" : "#fff",
                        letterSpacing: 0.5,
                      }}
                    >
                      {item.text}
                    </Typography>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <AppBar
          position="static"
          elevation={2}
          sx={{
            bgcolor: "#fff",
            color: "#212b36",
            borderRadius: "0 0 24px 24px",
            boxShadow: 2,
            mb: 3,
            px: 3,
            py: 1,
          }}
        >
          <Toolbar
            sx={{
              minHeight: 72,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Welcome, {user?.name || "Admin"}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Chip
                icon={<FiberManualRecordIcon sx={{ color: "#4caf50" }} />}
                label="Online"
                size="small"
                sx={{ bgcolor: "#e8f5e9", color: "#388e3c", mr: 2 }}
              />
              <Button
                variant="contained"
                color="secondary"
                endIcon={<ArrowDropDownIcon />}
                onClick={handleMenu}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  bgcolor: "#6f42c1",
                  "&:hover": { bgcolor: "#512da8" },
                  pl: 1,
                  pr: 2,
                }}
              >
                <Avatar
                  src="https://via.placeholder.com/32"
                  sx={{ width: 32, height: 32, mr: 1 }}
                />
                {user?.name || "Admin"}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>Settings</MenuItem>
                <MenuItem onClick={onLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content Area */}
        <Box
          component={Paper}
          elevation={0}
          sx={{
            flexGrow: 1,
            bgcolor: "#f4f6f8",
            borderRadius: 3,
            minHeight: "calc(100vh - 120px)",
            p: { xs: 1, sm: 3 },
            boxShadow: 0,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
