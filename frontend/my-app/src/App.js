import { useState } from "react";
import { styled } from '@mui/material/styles';
import { Button, Box, Container } from '@mui/material';
import Grid from '@mui/material/Grid2';


import Productcard from "./components/Productcard";
import AppAppBar from "./components/AppAppBar";


function App() {

  return (
    <Box className="App">
      <AppAppBar></AppAppBar>
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 3 }}>
            <Productcard/>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Productcard/>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Productcard/>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Productcard/>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Productcard/>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Productcard/>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Productcard/>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Productcard/>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default App;
