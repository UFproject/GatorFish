import { useState } from "react";
import { styled } from '@mui/material/styles';
import { Button, Box, Container } from '@mui/material';
import Grid from '@mui/material/Grid2';

import ProductCard from "./components/products/ProductCard";
import AppAppBar from "./components/layout/AppAppBar";
import CategoryMenu from "./components/layout/CategoryMenu";
import FeaturedSection from "./components/layout/FeaturedSection";
import { products } from "./data/mockData";

function App() {
  return (
    <Box className="App">
      <AppAppBar />
      <CategoryMenu />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          my: 16, 
          gap: 4,
          ml: '280px' // Add margin to account for CategoryMenu width
        }}
      >
        <FeaturedSection title="Fashion Refresh" products={products} />
        <FeaturedSection title="Digital Devices" products={products} />
        <FeaturedSection title="Sports Equipment" products={products} />
      </Container>
    </Box>
  );
}

export default App;
