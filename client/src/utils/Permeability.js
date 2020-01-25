export function fromPermeabilityToType(k) {
  if (k < 0.1) {
    return 'clay'; // 10%
  }
  if (k < 0.3) {
    return 'loam'; // 20%
  }
  if (k < 0.7) {
    return 'sand'; // 40%
  }
  return 'gravel'; // 30%
}

export default {
  fromPermeabilityToType,
};
