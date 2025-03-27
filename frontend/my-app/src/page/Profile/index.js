import { Box, Container, Tabs, Tab, Typography,
  Avatar,
  CardHeader,
  CardContent,
  Grid} from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import { request } from '../../utils/request';
import AppAppBar from "../../components/layout/AppAppBar";
import ProductCard from '../../components/products/ProductCard';
import PropTypes from 'prop-types';
import MuiCard from '@mui/material/Card'
import { styled } from '@mui/material/styles'

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',

  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function Profile() {
  const [searchParams] = useSearchParams();
  const username = searchParams.get('username');
  const [userProfile, setUserProfile] = useState([]);
  useEffect(()=>{
    async function getProfile() {
      try {
        const res = await request.post('/auth/profile', {username});
        setUserProfile(res);
        console.log(res);
      } catch (error) {
        console.error(error)
      }
    }

    getProfile();
  }, [])

  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <AppAppBar />
      <Container
        maxWidth="lg"
        sx={{
          mt: 12,
          mb: 4
        }}
      >
        <Card variant="outlined" sx={{ mt: 4, mb: 4 }}>
          <CardHeader
            avatar={
              <Avatar 
                sx={{ width: 80, height: 80 }}
                src={"https://mui.com/static/images/avatar/1.jpg"}
              >
              </Avatar>
            }
            title={
              <Typography variant="h4" component="div">
                {userProfile.username}
              </Typography>
            }
          />
        </Card>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          <Tab 
            label={"Selling"}
            aria-controls="tabpanel-selling"
          />
          <Tab 
            label={"Liked"}
            aria-controls="tabpanel-favorite"
          />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={2}>
          {userProfile.items?.slice(0, userProfile.size).map((product, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <ProductCard product = {product}/>
            </Grid>
          ))}
        </Grid>
        </TabPanel>
      </Container>
      
    </Box>
  )
}

export default Profile;