import {
  Box, Container, Typography, ListItemButton, ListItemIcon, ListItemText,
  CssBaseline,
  Avatar,
  Grid,
  List
} from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import { request } from '../../utils/request';
import AppAppBar from "../../components/layout/AppAppBar";
import { Link, Outlet } from 'react-router-dom';
import { stringToColor } from '../../utils/stringToColor';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import EditIcon from '@mui/icons-material/Edit';

function Profile() {
  const [searchParams] = useSearchParams();
  const username = searchParams.get('username');
  const [userProfile, setUserProfile] = useState([]);
  const [editPermission, setEditPermission] = useState(false);
  useEffect(() => {
    setEditPermission(localStorage.getItem('username') === username);
    async function getProfile() {
      try {
        const res = await request.post('/auth/profile', { username });
        setUserProfile(res);
        // console.log(res);
      } catch (error) {
        console.error(error)
      }
    }
    getProfile();

  }, [])

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#f4f6f6',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <CssBaseline />
      <AppAppBar />
      <Box
        sx={{
          width: '100%',
          backgroundColor: '#333',
          py: 4,
          position: 'relative',
          marginTop: 8,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              ml: 8
            }}
          >
            <Avatar
              src="/path/to/user-avatar.jpg"
              alt={userProfile.username}
              sx={{
                bgcolor: stringToColor(userProfile.username),
                width: 128,  // 128px
                height: 128,
                fontSize: '3rem'
              }}
            />
            <Typography variant="h3" component="h1" color='white'>
              {userProfile.username}
            </Typography>
          </Box>
        </Container>
      </Box>
      <Container sx={{ display: 'flex' }}>
        <Grid container spacing={4}>
          {/* left side */}
          <Grid item xs={12} md={3}>
            <List component="nav">
              <ListItemButton
                component={Link} to="/profile"
                selected={selectedIndex === 0}
                onClick={(event) => handleListItemClick(event, 0)}
              >
                <StarOutlineIcon sx={{ color: '#0021A5', mr: 2}}/>
                <ListItemText primary="Sellings and Favorites" />
              </ListItemButton>

              {editPermission && (
                <ListItemButton
                  component={Link} to="/profile/account"
                  selected={selectedIndex === 1}
                  onClick={(event) => handleListItemClick(event, 1)}
                >
                  <ManageAccountsIcon sx={{ color: '#0021A5', mr: 2}}/>
                  <ListItemText primary="Account" />
                </ListItemButton>
              )}
              {editPermission && (
                <ListItemButton
                  component={Link} to="/profile/updateItem"
                  selected={selectedIndex === 2}
                  onClick={(event) => handleListItemClick(event, 2)}
                >
                  <EditIcon sx={{ color: '#0021A5', mr: 2}}/>
                  <ListItemText primary="Edit Products" />
                </ListItemButton>
              )}
            </List>
          </Grid>

          {/* right side */}
          <Grid item xs={12} md={9}>
            <Box
              sx={{
                backgroundColor: '#ffffff',
                minHeight: '100vh',
              }}
            >
              <Outlet context={{ userProfile: userProfile }} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Profile;