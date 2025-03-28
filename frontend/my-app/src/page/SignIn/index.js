import * as React from 'react'
import MuiCard from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import AppBar from '@mui/material/AppBar'
import { request } from '../../utils/request'
import { useDispatch } from 'react-redux'
import { fetchLogin } from '../../store/modules/user'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from "react"
import Snackbar from '@mui/material/Snackbar'
import Link from '@mui/material/Link'

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

const SignInContainer = styled(Stack)(({ theme }) => ({
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


function SignIn() {
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const location = useLocation()
  const [errorMessage, setErrorMessage] = useState('')


  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const form = {
      "Username": data.get('username'),
      "Password": data.get('password')
    }
    try {
      await dispatch(fetchLogin(form));
      localStorage.setItem('username', form.Username)
      navigate('/', {state: { fromLogin: true }})
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setOpenSnackbar(true)
    }
  }

  useEffect(() => {
    if (location.state?.fromRegister) {
      setErrorMessage('Successful registration!')
      setOpenSnackbar(true)
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const handleClose = () => {
    setOpenSnackbar(false)
  }

  return (
    <Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleClose}
        message={errorMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
      <AppBar position="fixed" sx={{ backgroundColor: '#0021A5', boxShadow: 1, padding: '19px 12px',}}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button sx={{ display: 'flex', alignItems: 'center', gap: 2, backgroundColor: '#0021A5'}} href='/'>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FA4616' }}>
              GATOR FISH MARKET
            </Typography>
          </Button>
        </Box>
      </AppBar>
      
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', paddingBottom: 2 }}
          >
            Sign in
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
                <FormLabel htmlFor="email">Username</FormLabel>
                <TextField
                  id="username"
                  type="username"
                  name="username"
                  placeholder="username"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <TextField
                  name="password"
                  placeholder="••••••"
                  type="password"
                  id="password"
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
                Sign in
              </Button>
              <Typography sx={{ textAlign: 'center' }}>
                Don't have an account?{' '}
                <Link
                  href="/register"
                  variant="body2"
                  sx={{ alignSelf: 'center' }}
                >
                  Sign up
                </Link>
              </Typography>
              
            </Box>
        </Card>
      </SignInContainer>
    </Box>
    
    
  )
}

export default SignIn