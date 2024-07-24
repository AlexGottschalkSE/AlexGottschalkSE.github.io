import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Hidden,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import StorageIcon from "@mui/icons-material/Storage";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import logo from "../src/assets/SaleSwiftLogoWithoutText.png";

const drawerWidth = 320;

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("businessID");
    navigate("/login");
  };

  const drawer = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "white",
        borderRight: "4px solid #25467B",
        color: "black",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 200,
          bgcolor: "white",
        }}
      >
        <img src={logo} alt="SaleSwift Logo" style={{ height: "15vh" }} />
      </Box>
      <List>
        <ListItem
          button
          onClick={() => navigate("/dashboard")}
          sx={{
            "&:hover": {
              bgcolor: "#25467B",
              color: "white",
              transition: "transform 0.3s",
              transform: "translateY(-10px)",
              "& .MuiListItemIcon-root": {
                color: "white",
              },
            },
            transition: "transform 0.3s",
          }}
        >
          <ListItemIcon sx={{ color: "#25467B" }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem
          button
          onClick={() => navigate("/products")}
          sx={{
            "&:hover": {
              bgcolor: "#25467B",
              color: "white",
              transition: "transform 0.3s",
              transform: "translateY(-10px)",
              "& .MuiListItemIcon-root": {
                color: "white",
              },
            },
            transition: "transform 0.3s",
          }}
        >
          <ListItemIcon sx={{ color: "#25467B" }}>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary="Products" />
        </ListItem>
        <ListItem
          button
          onClick={() => navigate("/sales")}
          sx={{
            "&:hover": {
              bgcolor: "#25467B",
              color: "white",
              transition: "transform 0.3s",
              transform: "translateY(-10px)",
              "& .MuiListItemIcon-root": {
                color: "white",
              },
            },
            transition: "transform 0.3s",
          }}
        >
          <ListItemIcon sx={{ color: "#25467B" }}>
            <LocalMallIcon />
          </ListItemIcon>
          <ListItemText primary="Sales" />
        </ListItem>
        <ListItem
          button
          onClick={() => navigate("/stock")}
          sx={{
            "&:hover": {
              bgcolor: "#25467B",
              color: "white",
              transition: "transform 0.3s",
              transform: "translateY(-10px)",
              "& .MuiListItemIcon-root": {
                color: "white",
              },
            },
            transition: "transform 0.3s",
          }}
        >
          <ListItemIcon sx={{ color: "#25467B" }}>
            <StorageIcon />
          </ListItemIcon>
          <ListItemText primary="Stock" />
        </ListItem>
      </List>
      <List sx={{ marginTop: "auto" }}>
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            "&:hover": {
              bgcolor: "#25467B",
              color: "white",
              transition: "transform 0.3s",
              transform: "translateY(-10px)",
              "& .MuiListItemIcon-root": {
                color: "white",
              },
            },
            transition: "transform 0.3s",
          }}
        >
          <ListItemIcon sx={{ color: "#25467B" }}>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Hidden mdUp>
        <Drawer
          variant="temporary"
          open
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          variant="permanent"
          open
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
    </Box>
  );
};

export default Sidebar;
