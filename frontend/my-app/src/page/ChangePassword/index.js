import MuiCard from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import { Box, Button, Typography, Stack, FormLabel, FormControl, TextField} from '@mui/material';
import { request } from '../../utils/request'
import { useDispatch } from 'react-redux'
import { fetchLogin } from '../../store/modules/user'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from "react"
import Snackbar from '@mui/material/Snackbar'
import Link from '@mui/material/Link'
import AppAppBar from "../../components/layout/AppAppBar";

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const ChangePWContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));


function ChnagePassword() {
  const username = localStorage.getItem('username');

  const navigate = useNavigate()
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get('newPw') !== data.get('confirmPw')) {
      console.log('New passwords do not match.');
      alert('New passwords do not match.');
      return;
    }

    if (data.get('currentPw') === data.get('newPw')) {
      console.log('New password must be diffrent from current password.');
      alert('New password must be diffrent from current password.');
      return;
    }

    const form = {
      "Username": username,
      "old_password": data.get('currentPw'),
      "new_password": data.get('newPw'),
    }

    try {
      const res = await request.post('/auth/change', form);
      navigate(`/profile?username=${username}`);
      alert(res.message);
    } catch (error) {
      alert(error.response.data.error);
    }
  }

  return (
    <Box>
      <AppAppBar />
      
      <ChangePWContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', paddingBottom: 2 }}
          >
            Change Password
          </Typography>
          <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: 2,
              }}
            >
              <FormControl>
                <FormLabel htmlFor="password">Current Password</FormLabel>
                <TextField
                  id="currentPw"
                  type="password"
                  name="currentPw"
                  placeholder="Current Password"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password">New Password</FormLabel>
                <TextField
                  name="newPw"
                  placeholder="New Password"
                  type="password"
                  id="newPw"
                  autoComplete="current-password"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password">New Password (again)</FormLabel>
                <TextField
                  name="confirmPw"
                  placeholder="New Password (again)"
                  type="password"
                  id="confirmPw"
                  autoComplete="current-password"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                />
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ backgroundColor: '#0021A5'}}
              >
                Change Password
              </Button>
            </Box>
        </Card>
      </ChangePWContainer>
    </Box>
  )
}

export default ChnagePassword