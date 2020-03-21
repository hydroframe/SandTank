import arizona from 'parflow-web/src/assets/logo-arizona.png';
import igwmc from 'parflow-web/src/assets/logo-igwmc.png';
import kitware from 'parflow-web/src/assets/logo-kitware.svg';
import mines from 'parflow-web/src/assets/logo-mines.jpg';

export default {
  name: 'About',
  data() {
    return {
      logos: [kitware, arizona, igwmc, mines],
    };
  },
};
