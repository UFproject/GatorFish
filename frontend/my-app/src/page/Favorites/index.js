import { Box,Tabs, Tab, Grid } from '@mui/material';
import ProductCard from '../../components/products/ProductCard';
import PropTypes from 'prop-types';
import { useState} from "react";
import { useOutletContext } from 'react-router-dom';

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

function Favorites() {
  const { userProfile } = useOutletContext();
  console.log(useOutletContext());

  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{
      p: 4,
      height: '100%',
      backgroundColor: 'background.paper'
    }}>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        <Tab
          label={"Sellings"}
          aria-controls="tabpanel-selling"
        />
        <Tab
          label={"Favorites"}
          aria-controls="tabpanel-favorite"
        />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={2}>
          {userProfile.posted_items?.slice(0, userProfile.posted_items.size).map((product, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={2}>
          {userProfile.liked_items?.slice(0, userProfile.liked_items.size).map((product, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>
    </Box>
  )
}

export default Favorites;