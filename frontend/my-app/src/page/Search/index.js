import { Button, Box, Container, Snackbar, Grid, Typography } from '@mui/material';

import AppAppBar from "../../components/layout/AppAppBar";
import CategoryMenu from "../../components/layout/CategoryMenu";
import ProductCard from '../../components/products/ProductCard';

import { useState, useEffect } from "react";
import { useLocation, useSearchParams } from 'react-router-dom';
import { request } from '../../utils/request';

function SearchResult() {
  const location = useLocation();
  const itemList = location.state?.res.items || [];

  return (
    <Box>
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
        <Box sx={{ mb: 6 }}>
          {/* Section Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
              pb: 1,
              borderBottom: 1,
              borderColor: 'divider'
            }}
          >
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
              Search Results
            </Typography>

          </Box>

          {/* Products Grid */}
          <Grid container spacing={2}>
            {itemList?.slice(0, itemList.size).map((product, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default SearchResult;