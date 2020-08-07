module.exports = {
  name: 'Type check',
  callback: async () => {
    try {
      await runPackageJsonScript('tsc');
      return 'Success';
    } catch (error) {
      throw new Error('Something went wrong');
    }
  },
};
