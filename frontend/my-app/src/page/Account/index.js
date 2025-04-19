import { Box, Grid, Typography, Link } from '@mui/material';
import { useOutletContext } from 'react-router-dom';

function Account() {
  const { userProfile } = useOutletContext();

  return (
    <Box
      sx={{
        p: 4,
        height: '100%',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Account Information
      </Typography>
      <Grid container spacing={2}>
        <Grid item container alignItems="center" sx={{
          pb: 1,
          borderBottom: '1px solid #ccc'
        }}>
          <Grid item xs={3}>
            <Typography variant="body1" sx={{ textAlign: "left" }}>
              Username:
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography variant="body1">{userProfile.username}</Typography>
          </Grid>
        </Grid>

        <Grid item container alignItems="center" sx={{
          pb: 1,
          borderBottom: '1px solid #ccc'
        }}>
          <Grid item xs={3}>
            <Typography variant="body1" sx={{ textAlign: "left" }}>
              Email:
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography variant="body1">{userProfile.email}</Typography>
          </Grid>
        </Grid>

        <Grid item container alignItems="center" sx={{
          pb: 1,
          borderBottom: '1px solid #ccc'
        }}>
          <Grid item xs={3}>
            <Typography variant="body1" sx={{ textAlign: "left" }}>
              Phone:
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography variant="body1">{userProfile.phone}</Typography>
          </Grid>
        </Grid>

        <Grid item container alignItems="center" sx={{
          pb: 1,
          borderBottom: '1px solid #ccc'
        }}>
          <Grid item xs={3}>
            <Typography variant="body1" sx={{ textAlign: "left" }}>
              Password:
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography variant="body1" component={Link} href={'/password'} underline="none">
              Change Password
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Account;