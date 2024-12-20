import { useEffect, useState } from "react";
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, Icon, Link, Divider } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import { CLIENT_URLS } from "../services/globals";
import "./select.css";
import logo from "../assets/logo.png";

import { deleteUserFromLocalStorage } from "../services/user";

const VIOLET_AVATAR = "#44225e";
const VIOLET_PRIMARY = "#a757e4";
const VIOLET_PRIMARY_S = "#cfabeb";

function Navbar({ userState, children }) {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [logout, setLogout] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  const settingsWithoutUser = [{ name: "Iniciar sesión", link: CLIENT_URLS.LOGIN, func: null }];
  const pages = [
    { name: "Inicio", link: CLIENT_URLS.HOME },
    { name: "Crear Post", link: CLIENT_URLS.CREATE_POST },
  ];

  const settingsWithUser = [
    { name: "Cuenta", link: CLIENT_URLS.ACCOUNT, func: null },
    {
      name: "Cerrar sesión",
      link: null,
      func: () => {
        setLogout(true);
        deleteUserFromLocalStorage();
        console.log("func");
      },
    },
  ];

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
        onClick={() => navigate(CLIENT_URLS.HOME)}
      >
        <Icon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}>
          <img src={logo} height={25} width={25} />
        </Icon>
        <Typography
          variant="h5"
          noWrap
          component="a"
          onClick={() => navigate(CLIENT_URLS.HOME)}
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
      <Icon onClick={() => navigate(CLIENT_URLS.HOME)} sx={{ display: { xs: "flex", md: "none" }, mr: 1, userSelect: "none", cursor: "pointer" }}>
        <img src={logo} height={25} width={25} />
      </Icon>
      <Typography
        variant="h5"
        noWrap
        component="a"
        onClick={() => navigate(CLIENT_URLS.HOME)}
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
        <IconButton size="large" aria-label="Menu" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} color="white">
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
        {pages.map((page, i) => {
          return (
            <Button
              key={i}
              onClick={() => {
                handleCloseNavMenu();
                navigate(page.link);
              }}
              sx={{ my: 2, color: VIOLET_PRIMARY_S, display: "block" }}
            >
              {page.name}
            </Button>
          );
        })}
      </Box>
    </>
  );

  const getAccountItems = (items, salt) => {
    return items.map((setting, i) => (
      <MenuItem
        key={i + salt}
        onClick={() => {
          handleCloseUserMenu();
          if (setting.func) {
            setting.func();
          }
          if (setting.link) {
            console.log("link", setting.link);
            navigate(setting.link);
            if (setting.link == CLIENT_URLS.LOGIN) {
              navigate(0);
            }
          }
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

  const [accountMenu, setAccountMenu] = useState(getAccountItems(settingsWithoutUser, 0));

  useEffect(() => {
    if (userState.user != null) {
      setAccountMenu(getAccountItems(settingsWithUser, 1));
      setLogout(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userState, userState.user]);

  useEffect(() => {
    if (logout) {
      userState.setUser(null);
      setAccountMenu(getAccountItems(settingsWithoutUser, 0));
      navigate(CLIENT_URLS.HOME);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logout]);

  const parseAvatarName = (username) => {
    return username.length >= 2 ? username.slice(0, 2) : username;
  };

  const accountSection = (
    <>
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Abrir configuraciones">
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            {userState && userState.user && userState.user.name ? <Avatar sx={{ bgcolor: VIOLET_PRIMARY_S, color: VIOLET_AVATAR }}>{parseAvatarName(userState.user.name)}</Avatar> : <Avatar />}
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
