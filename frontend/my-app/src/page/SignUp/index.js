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
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useState} from "react"
import Snackbar from '@mui/material/Snackbar'
import Link from '@mui/material/Link'
import { request } from '../../utils/request'

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


function SignUp() {
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  const navigate = useNavigate()
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const form = {
      "Username": data.get('username'),
      "Password": data.get('password'),
      "Phone": data.get('phone'),
      "Email": data.get('email')
    }
    try {
      const res = await request.post('/auth/register', form)
      navigate('/login', {state: { fromRegister: true }})
    } catch (error) {
      setAlertMessage(error.response.data.error)
      setOpenSnackbar(true)
    }
  }
  
  const handleClose = () => {
    setOpenSnackbar(false)
  }

  return (
    <Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleClose}
        message={alertMessage}
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
            Sign up
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
                <FormLabel htmlFor="username">Username</FormLabel>
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
              <FormControl>
                <FormLabel htmlFor="phone">Phone Number</FormLabel>
                <TextField
                  id="phone"
                  type="phone"
                  name="phone"
                  placeholder="phone number"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                  name="email"
                  placeholder="email"
                  type="email"
                  id="email"
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
                Sign up
              </Button>
              <Typography sx={{ textAlign: 'center' }}>
                Already have an account?{' '}
                <Link
                  href="/login"
                  variant="body2"
                  sx={{ alignSelf: 'center' }}
                >
                  Sign in
                </Link>
              </Typography>
              
            </Box>
        </Card>
      </SignInContainer>
    </Box>
  )
}

export default SignUp