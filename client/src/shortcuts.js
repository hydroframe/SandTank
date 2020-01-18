import Mousetrap from 'mousetrap';

// ----------------------------------------------------------

const SHORTCUTS = [{ key: 'r', action: 'API_RESET_CAMERA' }];

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
