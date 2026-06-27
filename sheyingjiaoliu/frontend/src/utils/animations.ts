export const animations = {
  fadeInUp: 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  scaleIn: 'scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  pulse: 'pulse 2s ease-in-out infinite',
  slideDown: 'slideDown 0.3s ease forwards'
};

export const staggerDelay = (index: number) => ({
  animationDelay: `${index * 0.1}s`
});
