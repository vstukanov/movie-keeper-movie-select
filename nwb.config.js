module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: false
  },

  karma: {
    reporters: ['progress']
  },

  webpack: {
    compat: {
      enzyme: true
    }
  }
};
