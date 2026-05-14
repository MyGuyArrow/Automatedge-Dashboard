module.exports = {
  apps: [
    {
      name: 'automatedge-dashboard',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: '3000',
      },
    },
  ],
};
