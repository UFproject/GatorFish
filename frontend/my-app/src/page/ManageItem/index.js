import { Box, Typography } from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import ProductUpdateCard from '../../components/products/ProductUpdateCard';

function ManageItem() {
  const { userProfile } = useOutletContext();

  return (
    <Box>
      {userProfile.posted_items?.map((product, index) => (
        <ProductUpdateCard product={product} />
      ))}
    </Box>
  )
}

export default ManageItem;