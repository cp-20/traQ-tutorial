const isDevelopment = process.env.NODE_ENV === 'development';
export const traqDomain = isDevelopment
  ? 'https://q-dev.trapti.tech'
  : 'https://q.trap.jp';
