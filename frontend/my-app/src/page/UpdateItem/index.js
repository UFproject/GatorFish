import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Input
} from '@mui/material';
import AppAppBar from '../../components/layout/AppAppBar';
import { request } from '../../utils/request';
import { useNavigate, useLocation } from 'react-router-dom';

const categories = [
  'Phones/Digital/Computers',
  'Fashion/Bags/Sports',
  'Baby/Beauty/Personal Care',
  'Home/Appliances/Furniture',
  'Collectibles/Jewelry/Gifts',
  'Food/Pets/Flowers',
  'Books/Games/Media',
  'Cars/E-vehicles/Rentals'
];

function UpdateItem() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;

  const token = localStorage.getItem('token_key');

  const [formData, setFormData] = useState({
    title: product?.Title || '',
    price: product?.Price || '',
    category: product?.Category || '',
    description: product?.Description || '',
    image: null
  });

  const [imagePreview, setImagePreview] = useState(
    product?.Pic ? `${BASE_URL}${product.Pic}` : null
  );


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (product) {
      setFormData({
        item_id: product.Item_id,
        title: product.Title,
        price: product.Price,
        category: product.Category_name,
        description: product.Description,
        image: null
      });
      setImagePreview(product.Pic ? `${BASE_URL}${product.Pic}` : null);
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('seller_jwt', token);
      formDataToSend.append('item_id', formData.item_id);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category_name', formData.category);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('file', formData.image);

      await request.post('items/update', formDataToSend);
      
      navigate(`/profile?username=${localStorage.getItem('username')}`);
    } catch (error) {
      console.error('Error uploading item:', error);
    }
  };

  return (
    <Box>
      <AppAppBar />
      <Container maxWidth="md" sx={{ mt: 12, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#0021A5' }}>
            Edit Item
          </Typography>
          <img
            image={`${BASE_URL}${product.Pic}`}
            alt="img"
            style={{ maxWidth: '200px', maxHeight: '200px' }}
          />

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: '$'
              }}
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              margin="normal"
              required
              multiline
              rows={4}
            />

            <Box sx={{ mt: 3, mb: 2 }}>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                sx={{ display: 'none' }}
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  sx={{
                    color: '#0021A5',
                    borderColor: '#0021A5',
                    '&:hover': {
                      borderColor: '#FA4616',
                      color: '#FA4616'
                    }
                  }}
                >
                  Upload Image
                </Button>
              </label>
            </Box>

            {imagePreview && (
              <Box sx={{ mt: 2, mb: 3 }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: '200px', maxHeight: '200px' }}
                />
              </Box>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                bgcolor: '#0021A5',
                '&:hover': {
                  bgcolor: '#001A84'
                }
              }}
            >
              Submit
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default UpdateItem;