import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import imageUrl from './ball.jpg'

const Productcard = () => {
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
                <CardMedia
                component="img"
                height="200"
                image = {imageUrl}
                alt="ball"
                />
                <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    Basketball
                </Typography>
                <Typography variant="h5" sx={{ color: 'red' }}>
                    5$
                </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default Productcard