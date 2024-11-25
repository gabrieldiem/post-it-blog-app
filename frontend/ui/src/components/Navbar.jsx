import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import { Icon } from "@mui/material";
import { Link } from "@mui/material";
import { useNavigate } from "react-router-dom";

import "./Navbar.css";
import logo from "../assets/logo.png";

const VIOLET_PRIMARY = "#a757e4";
const VIOLET_PRIMARY_S = "#cfabeb";

const pages = [{ name: "Inicio", link: "/" }];

const settingsWithoutUser = [{ name: "Iniciar sesión", link: "/login" }];

const settingsWithUser = [
  { name: "Cuenta", link: "/account" },
  { name: "Cerrar sesión", link: "/logout" },
];

function Navbar({ userState, children }) {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const NavbarLogoDesktop = (
    <>
      <Box
        className="no-select cursor-hand header-span"
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "nowrap",
          cursor: "pointer",
        }}
        onClick={() => navigate("/")}
      >
        <Icon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}>
          <img src={logo} height={25} width={25} />
        </Icon>
        <Typography
          variant="h5"
          noWrap
          component="a"
          onClick={() => navigate("/")}
          sx={{
            mr: 2,
            display: { xs: "none", md: "flex" },
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: VIOLET_PRIMARY,
            textDecoration: "none",
          }}
        >
          PostIt
        </Typography>
      </Box>
    </>
  );

  const NavbarLogoMobile = (
    <>
      <Icon onClick={() => navigate("/")} sx={{ display: { xs: "flex", md: "none" }, mr: 1, userSelect: "none", cursor: "pointer" }}>
        <img src={logo} height={25} width={25} />
      </Icon>
      <Typography
        variant="h5"
        noWrap
        component="a"
        onClick={() => navigate("/")}
        sx={{
          mr: 2,
          display: { xs: "flex", md: "none" },
          flexGrow: 1,
          fontFamily: "monospace",
          fontWeight: 700,
          letterSpacing: ".3rem",
          color: VIOLET_PRIMARY,
          textDecoration: "none",
          userSelect: "none",
          cursor: "pointer",
        }}
      >
        PostIt
      </Typography>
    </>
  );

  const pagesSectionMobile = (
    <>
      <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
        <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit">
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorElNav}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
          sx={{ display: { xs: "block", md: "none" } }}
        >
          {pages.map((page, i) => (
            <MenuItem
              key={i}
              onClick={() => {
                handleCloseNavMenu();
                navigate(page.link);
              }}
            >
              <Typography sx={{ textAlign: "center" }}>
                <Link underline="hover" color={VIOLET_PRIMARY_S}>
                  {page.name}
                </Link>
              </Typography>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </>
  );

  const pagesSectionDesktop = (
    <>
      <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
        {pages.map((page, i) => (
          <Button
            key={i}
            onClick={() => {
              handleCloseNavMenu();
              navigate(page.link);
            }}
            sx={{ my: 2, color: VIOLET_PRIMARY_S, display: "block" }}
            href={page.link}
          >
            {page.name}
          </Button>
        ))}
      </Box>
    </>
  );

  const getAccountItems = (items) => {
    return items.map((setting, i) => (
      <MenuItem
        key={i}
        onClick={() => {
          handleCloseUserMenu();
          navigate(setting.link);
        }}
      >
        <Typography sx={{ textAlign: "center" }}>
          <Link underline="hover" color={VIOLET_PRIMARY_S}>
            {setting.name}
          </Link>
        </Typography>
      </MenuItem>
    ));
  };

  const [accountMenu, setAccountMenu] = useState(getAccountItems(settingsWithoutUser));
  console.log();

  useEffect(() => {
    if (userState.user != null) {
      setAccountMenu(getAccountItems(settingsWithUser));
    }
  }, [userState, userState.user]);

  const accountSection = (
    <>
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Abrir configuraciones">
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar />
          </IconButton>
        </Tooltip>
        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          {accountMenu}
        </Menu>
      </Box>
    </>
  );

  return (
    <>
      <AppBar position="sticky" color="custom">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {NavbarLogoDesktop}

            {pagesSectionMobile}

            {NavbarLogoMobile}

            {pagesSectionDesktop}

            {accountSection}
          </Toolbar>
        </Container>
      </AppBar>
      {children}
    </>
  );
}

export default Navbar;
