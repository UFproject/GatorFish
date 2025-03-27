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
  const [itemList1, setItemList1] = useState([])
  const [itemList2, setItemList2] = useState([])
  const [itemList3, setItemList3] = useState([])
  const location = useLocation()
  const [openSnackbar, setOpenSnackbar] = useState(false)

  useEffect(()=>{
    
    async function getItem1() {
      try {
        const res = await request.post('/items/Category', {
          "category_name": "Phones/Digital/Computers",
          "start": 0,
          "end": 10
        })
        setItemList1(res.items)
      } catch (error) {
        console.error(error)
      }
    }

    async function getItem2() {
      try {
        const res = await request.post('/items/Category', {
          "category_name": "Fashion/Bags/Sports",
          "start": 0,
          "end": 4
        })
        setItemList2(res.items)
      } catch (error) {
        console.error(error)
      }
    }

    async function getItem3() {
      try {
        const res = await request.post('/items/Category', {
          "category_name": "Baby/Beauty/Personal Care",
          "start": 0,
          "end": 4
        })
        setItemList3(res.items)
      } catch (error) {
        console.error(error)
      }
    }

    getItem1();
    getItem2();
    getItem3();
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
        <FeaturedSection title="Phones/Digital/Computers" products={itemList1} />
        <FeaturedSection title="Fashion/Bags/Sports" products={itemList2} />
        <FeaturedSection title="Baby/Beauty/Personal Care" products={itemList3} />
      </Container>
    </Box>
  );
}

export default Homepage;