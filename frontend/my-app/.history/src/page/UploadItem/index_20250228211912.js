import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';

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

function UploadItem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    description: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('Title', formData.title);
      formDataToSend.append('Price', formData.price);
      formDataToSend.append('Category', formData.category);
      formDataToSend.append('Description', formData.description);
      formDataToSend.append('Pic', formData.image);

      await request.post('/items/upload', formDataToSend);
      navigate('/');
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
            Upload Item for Sale
          </Typography>
          
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
              List Item
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default UploadItem;