import * as React from 'react'
import { alpha, styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField'
import SearchIcon from '@mui/icons-material/Search'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar';
import { Link } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Upload from '@mui/icons-material/Upload';
import Logout from '@mui/icons-material/Logout';
import { useDispatch } from 'react-redux'
import { clearUserInfo } from '../../store/modules/user'
import { stringToColor } from '../../utils/stringToColor'
import { useState } from "react";
import { request } from '../../utils/request';
import { useNavigate } from 'react-router-dom';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  padding: '8px 12px',
  backgroundColor: '#0021A5',
}));

const SearchBar = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'white',
    borderRadius: '20px',
    width: '400px',
    '& fieldset': {
      borderColor: '#e0e0e0',
    },
    '&:hover fieldset': {
      borderColor: '#FA4616',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FA4616',
    },
  },
}));

const AppAppBar = () => {
  const token = localStorage.getItem('token_key')
  const username = localStorage.getItem('username')
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(clearUserInfo())
    setAnchorEl(null)
  };

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async (event) => {
    event.preventDefault();
    
    if (searchTerm) {
      try {
        const res = await request.post('/items/Search', {"query": searchTerm});
        navigate('/search-results', { state: { res } });
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#0021A5', boxShadow: 1 }}>
      <Container maxWidth="lg">
        <StyledToolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FA4616' }} component={Link} to={'/'} style={{ textDecoration: 'none' }}>
              GATOR FISH MARKET
            </Typography>
          </Box>
          <Box>
            <SearchBar
              placeholder="Search for anything"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#0021A5' }} />
                  </InputAdornment>
                ),
              }}
            />
            <IconButton
              onClick={handleSearch}
              aria-label="search"
              color="inherit"
            >
              <SearchIcon />
            </IconButton>
          </Box>


          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {!token && <Button
              sx={{
                color: 'white',
                '&:hover': {
                  color: '#FA4616'
                }
              }}
              href='/login'
            >
              Sign In
            </Button>}
            {token &&
              <Avatar
                src="/path/to/user-avatar.jpg"
                alt={username}
                sx={{ width: 56, height: 56, cursor: 'pointer', bgcolor: stringToColor(username), fontSize: '2rem' }}
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />}
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              slotProps={{
                paper: {
                  style: {
                    width: '20ch',
                  },
                },
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <MenuItem component={Link} to={`/profile?username=${username}`} onClick={handleClose}>
                <ListItemIcon>
                  <AccountCircle sx={{ color: '#0021A5', mr: 3 }} />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
              <MenuItem component={Link} to="/uploadItem" onClick={handleClose}>
                <ListItemIcon>
                  <Upload sx={{ color: '#0021A5', mr: 3 }} />
                </ListItemIcon>
                <ListItemText>Selling</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout sx={{ color: '#0021A5', mr: 3 }} />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
            <IconButton
              sx={{
                color: 'white',
                '&:hover': {
                  color: '#FA4616'
                }
              }}
            >
              <ShoppingCartIcon />
            </IconButton>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
};

export default AppAppBar;