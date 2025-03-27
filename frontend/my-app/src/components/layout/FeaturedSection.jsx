import React from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ProductCard from '../products/ProductCard';
import { useNavigate } from 'react-router-dom'

const FeaturedSection = ({ title, products }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/category?category_name=${title}`);
  };

  return (
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
          {title}
        </Typography>
        <Button 
          endIcon={<ArrowForwardIcon />}
          sx={{ 
            color: '#0021A5',
            '&:hover': {
              color: '#FA4616',
              backgroundColor: 'transparent'
            }
          }}
          onClick={handleClick}
        >
          See All
        </Button>
      </Box>

      {/* Products Grid */}
      <Grid container spacing={2}>
        {products?.slice(0, 4).map((product, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <ProductCard product = {product}/>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeaturedSection;
