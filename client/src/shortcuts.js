import Mousetrap from 'mousetrap';

// ----------------------------------------------------------

const SHORTCUTS = [{ key: 'n', action: 'PARFLOW_RUN' }];

// ----------------------------------------------------------

export function registerShortcuts(store) {
  SHORTCUTS.forEach(({ key, action }) => {
    Mousetrap.bind(key, (e) => {
      e.preventDefault();
      store.dispatch(action);
    });
  });
}

// ----------------------------------------------------------

export function unregisterShortcuts() {
  SHORTCUTS.forEach(({ key }) => {
    Mousetrap.unbind(key);
  });
}

// ----------------------------------------------------------

export default {
  register: registerShortcuts,
  unregister: unregisterShortcuts,
};
