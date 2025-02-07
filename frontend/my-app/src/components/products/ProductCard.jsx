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
import imageUrl from '../../assets/images/ball.jpg';

const ProductCard = () => {
    return (
        <Card sx={{ 
            maxWidth: 345,
            '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease-in-out'
            }
        }}>
            <CardActionArea href='/item' target='_blank'>
                <CardMedia
                    component="img"
                    height="200"
                    image={imageUrl}
                    alt="ball"
                />
                <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                        Basketball
                    </Typography>
                    <Typography variant="h5" sx={{ color: '#FA4616', fontWeight: 'bold', mb: 1 }}>
                        $5
                    </Typography>
                    
                    {/* Location and Views */}
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        mb: 2,
                        color: 'text.secondary'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationOnIcon sx={{ fontSize: 16 }} />
                            <Typography variant="body2">
                                Gainesville
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <VisibilityIcon sx={{ fontSize: 16 }} />
                            <Typography variant="body2">
                                245 views
                            </Typography>
                        </Box>
                    </Box>

                    {/* Seller Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar 
                            sx={{ width: 24, height: 24 }}
                            src="https://mui.com/static/images/avatar/1.jpg"
                        />
                        <Typography variant="body2" color="text.secondary">
                            John Doe
                        </Typography>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default ProductCard; 