import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Link } from '@mui/material';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import ChairIcon from '@mui/icons-material/Chair';
import DiamondIcon from '@mui/icons-material/Diamond';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { useNavigate, useLocation } from 'react-router-dom'


const categories = [
  { title: 'Phones/Digital/Computers', icon: <PhoneAndroidIcon /> },
  { title: 'Fashion/Bags/Sports', icon: <CheckroomIcon /> },
  { title: 'Baby/Beauty/Personal Care', icon: <ChildCareIcon /> },
  { title: 'Home/Appliances/Furniture', icon: <ChairIcon /> },
  { title: 'Collectibles/Jewelry/Gifts', icon: <DiamondIcon /> },
  { title: 'Food/Pets/Flowers', icon: <RestaurantIcon /> },
  { title: 'Books/Games/Media', icon: <SportsEsportsIcon /> },
  { title: 'Cars/E-vehicles/Rentals', icon: <DirectionsCarIcon /> },
];

const CategoryMenu = () => {
  const navigate = useNavigate();

  const handleClick = (category) => {
    navigate(`/category?category_name=${category.title}`);
  };

  return (
    <Box sx={{ 
      width: 300,
      bgcolor: 'background.paper',
      borderRight: 1,
      borderColor: 'divider',
      height: '100vh',
      position: 'fixed',
      top: 64,
      left: 0,
      overflowY: 'auto',
      pt: 4,
    }}>
      <List>
        {categories.map((category, index) => (
          <ListItem 
            key={index} 
            sx={{
              '&:hover': {
                bgcolor: 'action.hover',
                '& .MuiListItemIcon-root': {
                  color: '#FA4616'
                }
              }
            }}
          >
            <ListItemButton onClick={() => handleClick(category)}>
              <ListItemIcon sx={{ color: '#0021A5' }}>
                {category.icon}
              </ListItemIcon>
              <ListItemText primary={category.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default CategoryMenu;
