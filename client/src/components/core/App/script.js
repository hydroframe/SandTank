import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  name: 'ParflowWeb',
  computed: {
    ...mapGetters({
      busy: 'UI_BUSY_PARFLOW',
      showVisualization: 'UI_MODE_IS_VISUALIZATION',
      showMaterialEdit: 'UI_MODE_IS_MATERIAL_DEFINITION',
    }),
  },
  methods: {
    ...mapMutations({
      setParflowBusy: 'UI_BUSY_PARFLOW_SET',
    }),
    ...mapActions({
      toggleMode: 'UI_TOGGLE_MODE',
    }),
    fakeBusy() {
      this.setParflowBusy(true);
      setTimeout(() => {
        this.setParflowBusy(false);
      }, 2000);
    },
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
  },
};
