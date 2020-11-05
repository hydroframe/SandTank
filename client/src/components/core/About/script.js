import arizona from 'parflow-web/src/assets/logo-arizona.png';
import igwmc from 'parflow-web/src/assets/logo-igwmc.png';
import kitware from 'parflow-web/src/assets/logo-kitware.svg';
import princeton from 'parflow-web/src/assets/PU-standard.png';
import hmei from 'parflow-web/src/assets/HMEI-logo-light-bg.png';

export default {
  name: 'About',
  data() {
    return {
      logos: [kitware, arizona, igwmc, princeton, hmei],
    };
  },
};
