import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import ChairIcon from '@mui/icons-material/Chair';
import DiamondIcon from '@mui/icons-material/Diamond';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

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
  return (
    <Box sx={{ 
      width: 280,
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
            button
            sx={{
              '&:hover': {
                bgcolor: 'action.hover',
                '& .MuiListItemIcon-root': {
                  color: '#FA4616'
                }
              }
            }}
          >
            <ListItemIcon sx={{ color: '#0021A5' }}>
              {category.icon}
            </ListItemIcon>
            <ListItemText primary={category.title} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default CategoryMenu;
