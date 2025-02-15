import { styled } from '@mui/material/styles';
import { Button, Box, Container } from '@mui/material';
import Grid from '@mui/material/Grid2';

import AppAppBar from "../../components/layout/AppAppBar";
import CategoryMenu from "../../components/layout/CategoryMenu";
import FeaturedSection from "../../components/layout/FeaturedSection";
import { products } from "../../data/mockData";

import { useState, useEffect } from "react";
import axios from "axios"
import { request } from '../../utils/request';

function Homepage() {
  const [itemList, setItemList] = useState([])

  useEffect(()=>{
    async function getList() {
      try {
        const res = await request.get('/item')
        setItemList(res)
      } catch (error) {
        console.error(error)
      }
    }
    async function test() {
      try {
        const res = await request.post('/login', {"username": "user1", "password": "123456"})
        //console.log(res)
      } catch (error) {
        console.error(error)
      }
    }
    getList()
    test()
  }, [])

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
        <FeaturedSection title="Fashion Refresh" products={itemList} />
        <FeaturedSection title="Digital Devices" products={itemList} />
        <FeaturedSection title="Sports Equipment" products={itemList} />
      </Container>
    </Box>
  );
}

export default Homepage;