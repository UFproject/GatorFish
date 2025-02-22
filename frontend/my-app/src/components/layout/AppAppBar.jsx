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

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#0021A5', boxShadow: 1 }}>
      <Container maxWidth="lg">
        <StyledToolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FA4616' }} component={Link} to={'/'} style={{ textDecoration: 'none' }}>
              GATOR FISH MARKET
            </Typography>
          </Box>
          
          <SearchBar
            placeholder="Search for anything"
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#0021A5' }}/>
                </InputAdornment>
              ),
            }}
          />
          
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
            {token && <Avatar
                  src={"https://mui.com/static/images/avatar/1.jpg"}
                  sx={{ width: 56, height: 56 }}
                />}
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