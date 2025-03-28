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
    <Box >
      <CssBaseline />
      <AppAppBar />
      <Box
        sx={{
          width: '100%',
          backgroundColor: '#f4f6f6',
          py: 4,
          position: 'relative',
          marginTop: 8
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 4
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
            <Typography variant="h3" component="h1">
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
                <ListItemText primary="Sellings and Favorites" />
              </ListItemButton>

              {editPermission && (
                <ListItemButton 
                  component={Link} to="/profile/account"
                  selected={selectedIndex === 1}
                  onClick={(event) => handleListItemClick(event, 1)}
                >
                  <ListItemText primary="Account" />
                </ListItemButton>
              )}
              {editPermission && (
                <ListItemButton 
                  component={Link} to="/profile/updateItem"
                  selected={selectedIndex === 2}
                  onClick={(event) => handleListItemClick(event, 2)}
                >
                  <ListItemText primary="Edit Products" />
                </ListItemButton>
              )}
            </List>
          </Grid>

          {/* right side */}
          <Grid item xs={12} md={9}>
            <Outlet context={{ userProfile: userProfile }} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Profile;