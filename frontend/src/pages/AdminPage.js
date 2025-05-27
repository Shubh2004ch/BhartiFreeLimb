import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import FoodStallManager from '../components/admin/FoodStallManager';
import ClinicManager from '../components/admin/ClinicManager';
import SleepingBagManager from '../components/admin/SleepingBagManager';
import WaterPondForm from '../components/admin/WaterPondForm';
import CentersManager from '../components/admin/CentersManager';
import MediaManager from '../components/admin/MediaManager';
import ReviewManager from '../components/admin/ReviewManager';
import ShelterManager from '../components/admin/ShelterManager';

// Define TabPanel component
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
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminPage = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box 
        sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        }}
      >
        <Tabs 
          value={value} 
          onChange={handleChange} 
          aria-label="admin tabs"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            minWidth: '100%',
            '& .MuiTab-root': {
              minWidth: 'auto',
              padding: '12px 16px',
              whiteSpace: 'nowrap',
            },
          }}
        >
          <Tab label="Media" />
          <Tab label="Customer Reviews" />
          <Tab label="Centers" />
          <Tab label="Food Stalls" />
          <Tab label="Clinics & Shelters" />
          <Tab label="Sleeping Bags" />
          <Tab label="Water Ponds" />
          <Tab label="Homeless Shelters" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <MediaManager />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ReviewManager />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <CentersManager />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <FoodStallManager />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <ClinicManager />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <SleepingBagManager />
      </TabPanel>
      <TabPanel value={value} index={6}>
        <WaterPondForm />
      </TabPanel>
      <TabPanel value={value} index={7}>
        <ShelterManager />
      </TabPanel>
    </Box>
  );
};

export default AdminPage;