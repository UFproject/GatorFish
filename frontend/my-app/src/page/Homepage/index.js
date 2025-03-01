import { styled } from '@mui/material/styles';
import { Button, Box, Container, Snackbar} from '@mui/material';
import Grid from '@mui/material/Grid2';

import AppAppBar from "../../components/layout/AppAppBar";
import CategoryMenu from "../../components/layout/CategoryMenu";
import FeaturedSection from "../../components/layout/FeaturedSection";
import { products } from "../../data/mockData";

import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import axios from "axios"
import { request } from '../../utils/request';

function Homepage() {
  const [itemList, setItemList] = useState([])
  const [digitalItemList, setDigitalItemList] = useState([])
  const location = useLocation()
  const [openSnackbar, setOpenSnackbar] = useState(false)

  useEffect(()=>{
    async function getList() {
      try {
        const res = await request.post('/items/Category', {
          "category_name": "Electronics",
          "start": 0,
          "end": 10
        })
        setItemList(res.items)
      } catch (error) {
        console.error(error)
      }
    }

    async function getDigitalItemList() {
      try {
        const res = await request.post('/items/Category', {
          "category_name": "Phones/Digital/Computers",
          "start": 0,
          "end": 10
        })
        setDigitalItemList(res.items)
      } catch (error) {
        console.error(error)
      }
    }
    
    getList();
    getDigitalItemList();
  }, [])

  useEffect(() => {
    if (location.state?.fromLogin) {
      setOpenSnackbar(true)
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const handleClose = () => {
    setOpenSnackbar(false);
  }

  return (
    <Box>
       <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleClose}
        message="Login Successful!"
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
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
        <FeaturedSection title="Fashion Refresh" products={itemList} />
        <FeaturedSection title="Digital Devices" products={digitalItemList} />
        <FeaturedSection title="Sports Equipment" products={itemList} />
      </Container>
    </Box>
  );
}

export default Homepage;