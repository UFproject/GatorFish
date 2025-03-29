import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MLink from '@mui/material/Link';
import { Link } from 'react-router-dom';
import { stringToColor } from '../../utils/stringToColor';
import { useNavigate } from 'react-router-dom';
// import imageUrl from '../../assets/images/ball.jpg';

const ProductUpdateCard = ({ product }) => {
  // console.log(product)
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/updateItem', {state: { product: product }})
  }


  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      borderBottom: '1px solid #ccc'
    }}>
      <Card sx={{
        maxWidth: 600,
        display: 'flex',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-4px)',
          transition: 'all 0.3s ease-in-out'
        },
        flex: 1
      }}>
        <CardActionArea component={Link} to={`/item?id=${product.Item_id}`} state={{ product }} sx={{ display: 'flex', flexGrow: 1 }}>
          <CardMedia
            component="img"
            height="200"
            image={`${BASE_URL}${product.Pic}`}
            alt={product.Title}
            sx={{
              width: 200,
              height: 200,
              objectFit: 'cover',
            }}
          />
          <CardContent sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            p: 2
          }}>
            <Typography gutterBottom variant="h6" component="div">
              {product.Title}
            </Typography>
            <Typography variant="h5" sx={{ color: '#FA4616', fontWeight: 'bold', mb: 1 }}>
              ${product.Price}
            </Typography>

            {/* Seller Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                src="/path/to/user-avatar.jpg"
                alt={product.Seller_name}
                sx={{
                  width: 24,
                  height: 24,
                  bgcolor: stringToColor(product.Seller_name)
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Sold by:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {product.Seller_name}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
      <MLink component="button" onClick={handleClick} underline="none">
        Edit
      </MLink>
    </Box>
  );
}

export default ProductUpdateCard; 