import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import AppBar from '@mui/material/AppBar';
import AppAppBar from '../../components/layout/AppAppBar';

function SignIn() {
  return (
    <Box>
      <AppBar position="fixed" sx={{ backgroundColor: '#0021A5', boxShadow: 1, padding: '19px 12px',}}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button sx={{ display: 'flex', alignItems: 'center', gap: 2, backgroundColor: '#0021A5'}} href='/'>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FA4616' }}>
              GATOR FISH MARKET
            </Typography>
          </Button>
        </Box>
      </AppBar>
      
      <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh" 
      >
        
        <Card variant="outlined" sx={{ 
          minWidth: 500,
          p: 2,
        }}>
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', paddingBottom: 2 }}
          >
            Sign in
          </Typography>
          <Box
              component="form"
              noValidate
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: 2,
              }}
            >
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                  id="email"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  autoComplete="email"
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
              >
                Sign in
              </Button>
              
            </Box>
        </Card>
      </Box>
    </Box>
    
  )
}

export default SignIn