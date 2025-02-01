import { useState } from "react";
import { styled } from '@mui/material/styles';
import { Button, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';


import Productcard from "./components/Productcard";


function App() {

  return (
    <Box className="App">
      <Box style={{margin: 100}}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 4, md: 2 }}>
            <Productcard/>
          </Grid>
          <Grid size={{ xs: 4, md: 2 }}>
            <Productcard/>
          </Grid>
          <Grid size={{ xs: 4, md: 2 }}>
            <Productcard/>
          </Grid>
          <Grid size={{ xs: 4, md: 2 }}>
            <Productcard/>
          </Grid>
          <Grid size={{ xs: 4, md: 2 }}>
            <Productcard/>
          </Grid>
          <Grid size={{ xs: 4, md: 2 }}>
            <Productcard/>
          </Grid>
          <Grid size={{ xs: 4, md: 2 }}>
            <Productcard/>
          </Grid>
          <Grid size={{ xs: 4, md: 2 }}>
            <Productcard/>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default App;
