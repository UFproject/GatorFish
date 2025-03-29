import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Button, Avatar, Snackbar } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AppAppBar from '../../components/layout/AppAppBar';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { request } from '../../utils/request';
import { stringToColor } from '../../utils/stringToColor';

function Product() {
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || null);
  const productId = new URLSearchParams(location.search).get('id');
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const username = localStorage.getItem('username');

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  // console.log(location)

  // useEffect(() => {
  //   async function getProduct() {
  //     try {
  //       // const res = await axios.get(`http://localhost:3004/item/${productId}`);
  //       const res = await axios.get(`http://localhost:3004/item/1`);
  //       setProduct(res.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  //   if (productId) {
  //     getProduct();
  //   }
  // }, [productId]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleLiked = async () => {
    try {
      const res = await request.post('/items/AddLike', {
        "username": username,
        "item_id": product.Item_id
      });
      setSnackbarMsg("Successfully added to favorites");
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error add like behavior:', error);
      setSnackbarMsg(error.response.data.error);
      setOpenSnackbar(true);
    }
  }

  const handleClose = () => {
    setOpenSnackbar(false);
  }


  return (
    <Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleClose}
        message={snackbarMsg}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
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
              src={`${BASE_URL}${product.Pic}`}
              alt={product.Title}
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
                {product.Title}
              </Typography>

              <Typography variant="h3" sx={{ color: '#FA4616', fontWeight: 'bold', my: 3 }}>
                ${product.Price}
              </Typography>

              {/* {<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LocationOnIcon sx={{ color: 'text.secondary' }} />
                <Typography color="text.secondary">
                  Gainesville
                </Typography>
                <Box sx={{ flex: 1 }} />
                <VisibilityIcon sx={{ color: 'text.secondary' }} />
                <Typography color="text.secondary">
                  100 views
                </Typography>
              </Box>} */}
              <Typography fontSize={24} gutterBottom>
                Description: {product.Description}
              </Typography>

              <Box component={Link} to={`/profile?username=${product.Seller_name}`} sx={{
                textDecoration: 'none',
                color: 'inherit',
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
                  src="/path/to/user-avatar.jpg"
                  alt={product.Seller_name}
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: stringToColor(product.Seller_name),
                    fontSize: '2rem'
                  }}
                />
                <Box>
                  <Typography variant="h6">
                    {product.Seller_name}
                  </Typography>
                  <Typography color="text.secondary">
                    Seller
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" gap={1} width="100%">
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: '#0021A5',
                    '&:hover': {
                      bgcolor: '#001A84'
                    },
                    width: 'calc(50% - 4px)'
                  }}
                >
                  Contact Seller
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: '#1976d2',
                    '&:hover': {
                      bgcolor: '#1976d2'
                    },
                    width: 'calc(50% - 4px)'
                  }}
                  onClick={handleLiked}
                >
                  Add to Favorites
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Product;