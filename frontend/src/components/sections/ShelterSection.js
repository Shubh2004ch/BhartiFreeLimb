import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Chip,
  Skeleton,
  Fade,
  useTheme,
  useMediaQuery,
  Button,
} from '@mui/material';
import {
  LocationOn,
  People,
  Home,
  ArrowForward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { shelterService } from '../../services/api';
import { getImageUrl } from '../../constants';

// Loading Skeleton
const LoadingSkeleton = () => (
  <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
    <Container maxWidth="lg">
      <Typography
        variant="h3"
        component="h2"
        gutterBottom
        align="center"
        sx={{
          mb: 6,
          fontWeight: 'bold',
          color: 'primary.main',
          letterSpacing: 2,
        }}
      >
        Free Homeless Shelters
      </Typography>
      <Grid container spacing={4}>
        {[1, 2, 3].map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item}>
            <Skeleton
              variant="rounded"
              height={210}
              sx={{ borderRadius: 4, mb: 1 }}
            />
            <Skeleton variant="text" height={40} width="80%" />
            <Skeleton variant="text" height={20} width="60%" />
            <Skeleton variant="text" height={20} width="50%" />
            <Skeleton variant="rectangular" height={32} width="60%" sx={{ borderRadius: 2, mt: 2 }} />
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

// Shelter Card (with glassmorphism and animated hover)
const ShelterCard = ({ item, index }) => (
  <Fade in timeout={600} style={{ transitionDelay: `${index * 120}ms` }}>
    <Card
      sx={{
        height: '100%',
        width: 320,
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        boxShadow: '0 6px 32px 0 rgba(56, 189, 248, 0.10), 0 1.5px 4px 0 rgba(0,0,0,0.06)',
        backdropFilter: 'blur(3.5px)',
        background: 'linear-gradient(120deg,rgba(236, 254, 255, 0.75) 80%,rgba(236, 254, 255, 0.93) 100%)',
        overflow: 'hidden',
        position: 'relative',
        transition: 'transform 0.25s cubic-bezier(.4,0,.2,1), box-shadow 0.25s cubic-bezier(.4,0,.2,1)',
        '&:hover': {
          transform: 'translateY(-10px) scale(1.03)',
          boxShadow: '0 10px 32px 0 rgba(59,130,246,0.18), 0 2px 8px 0 rgba(0,0,0,0.10)',
        },
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        {item.images?.length > 0 && (
          <CardMedia
            component="img"
            height="160"
            image={getImageUrl(item.images[0])}
            alt={item.name}
            sx={{
              objectFit: 'cover',
              filter: 'brightness(0.97)',
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              transition: 'filter 0.3s',
              '&:hover': { filter: 'brightness(0.92)' },
            }}
          />
        )}
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            bgcolor: 'rgba(255,255,255,0.94)',
            px: 1.5,
            py: 0.5,
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 2px 8px 0 rgba(59,130,246,0.07)',
          }}
        >
          <People sx={{ color: 'primary.main', fontSize: '1.1rem', mr: 0.5 }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {item.currentOccupancy}/{item.capacity}
          </Typography>
        </Box>
        <Home
          sx={{
            position: 'absolute',
            left: 10,
            top: 10,
            color: '#2563eb',
            fontSize: 30,
            opacity: 0.85,
          }}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 'bold',
            mb: 1,
            color: 'primary.main',
            fontSize: '1.17rem',
            letterSpacing: 0.1,
          }}
        >
          {item.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOn sx={{ color: 'info.main', fontSize: '1.15rem', mr: 0.7 }} />
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.97rem' }}>
            {item.address}, {item.city}, {item.state}
          </Typography>
        </Box>
        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {item.description}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
          {item.facilities?.map((facility, idx) => (
            <Chip
              key={idx}
              label={facility}
              size="small"
              sx={{
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
                fontSize: '0.75rem',
                height: '22px',
                fontWeight: 500,
                letterSpacing: 0.2,
              }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  </Fade>
);

const ShelterSection = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await shelterService.getShelters();
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching shelters:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayedItems = showAll ? items : items.slice(0, 3);

  if (loading) return <LoadingSkeleton />;

  return (
    <Box
      sx={{
        py: { xs: 4, sm: 6 },
        bgcolor: 'background.default',
        borderBottom: '1px solid',
        borderColor: 'divider',
        minHeight: '60vh',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            mb: 5,
            gap: 1,
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 900,
              color: 'primary.main',
              letterSpacing: 1.5,
              fontSize: { xs: '1.4rem', sm: '2rem' },
              background: 'linear-gradient(90deg, #2563eb 30%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
            }}
          >
            Free Homeless Shelters
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {!loading && items.length > 3 && (
              <Button
                variant={showAll ? 'outlined' : 'contained'}
                onClick={() => setShowAll(!showAll)}
                size="small"
                sx={{
                  fontSize: '0.95rem',
                  px: 3,
                  borderRadius: 99,
                  fontWeight: 700,
                  letterSpacing: 0.3,
                  textTransform: 'none',
                  boxShadow: showAll ? 0 : 2,
                  background: !showAll
                    ? 'linear-gradient(to right, #38bdf8, #2563eb)'
                    : undefined,
                  color: !showAll ? '#fff' : undefined,
                }}
              >
                {showAll ? 'Show Less' : 'View All'}
              </Button>
            )}
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/shelters')}
              size="small"
              sx={{
                fontSize: '0.95rem',
                px: 3,
                borderRadius: 99,
                fontWeight: 700,
                letterSpacing: 0.3,
                textTransform: 'none',
                boxShadow: 2,
                background: 'linear-gradient(to right, #38bdf8, #2563eb)',
                color: '#fff',
              }}
            >
              See All
            </Button>
          </Box>
        </Box>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{
            maxWidth: 600,
            mx: 'auto',
            mb: 1.5,
            fontWeight: 500,
            fontSize: { xs: '1.1rem', md: '1.25rem' },
            textAlign: 'center',
          }}
        >
          Find safe and secure shelters near you.
        </Typography>

        <Grid
          container
          spacing={5}
          justifyContent="center"
          alignItems="stretch"
        >
          {displayedItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <ShelterCard item={item} index={index} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ShelterSection;