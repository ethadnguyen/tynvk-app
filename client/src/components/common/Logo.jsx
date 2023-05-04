import { Typography, useTheme } from '@mui/material';
import uiConfigs from '../../configs/ui.configs';
import { Link } from 'react-router-dom';
import menuConfigss from '../../configs/menu.configs';
const Logo = () => {
  const theme = useTheme();

  return (
    <Typography
      fontWeight="700"
      fontSize="1.7rem" sx={{ cursor: 'pointer', textDecoration: 'none', ...uiConfigs.style.rainbowText }}
      component={Link}
      to={menuConfigss.main[0].path}
    >
      TYN<span style={{ color: theme.palette.primary.main }}>VK</span>
    </Typography>
  );
};

export default Logo;