const { runPackageJsonScript } = require('../utils');

module.exports = {
  name: 'Lint',
  callback: async () => {
    try {
      await runPackageJsonScript('lint');
      return 'Success';
    } catch (error) {
      throw new Error('Something went wrong');
    }
  },
};
