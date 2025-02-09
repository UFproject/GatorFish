import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Button, Avatar } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AppAppBar from '../../components/layout/AppAppBar';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import imageUrl from '../../assets/images/ball.jpg';

function Product() {
  const [product, setProduct] = useState(null);
  const location = useLocation();
  const productId = new URLSearchParams(location.search).get('id');

  useEffect(() => {
    async function getProduct() {
      try {
        const res = await axios.get(`http://localhost:3004/item/${productId}`);
        setProduct(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    if (productId) {
      getProduct();
    }
  }, [productId]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      <AppAppBar />
      <Container
        maxWidth="lg"
        sx={{
          mt: 12,
          mb: 4
        }}
      >
        <Grid container spacing={4}>
          {/* Left side - Image */}
          <Grid item xs={12} md={8}>
            <Box
              component="img"
              src={imageUrl}
              alt={product.title}
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: 1
              }}
            />
          </Grid>

          {/* Right side - Product Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {product.title}
              </Typography>

              <Typography variant="h3" sx={{ color: '#FA4616', fontWeight: 'bold', my: 3 }}>
                ${product.price}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LocationOnIcon sx={{ color: 'text.secondary' }} />
                <Typography color="text.secondary">
                  {product.location}
                </Typography>
                <Box sx={{ flex: 1 }} />
                <VisibilityIcon sx={{ color: 'text.secondary' }} />
                <Typography color="text.secondary">
                  {product.views} views
                </Typography>
              </Box>

              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 1,
                boxShadow: 1,
                mb: 3
              }}>
                <Avatar
                  src={product.seller.avatar}
                  sx={{ width: 56, height: 56 }}
                />
                <Box>
                  <Typography variant="h6">
                    {product.seller.name}
                  </Typography>
                  <Typography color="text.secondary">
                    Seller
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  bgcolor: '#0021A5',
                  '&:hover': {
                    bgcolor: '#001A84'
                  }
                }}
              >
                Contact Seller
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Product;