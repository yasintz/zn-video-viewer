module.exports = {
  name: 'Test',
  callback: async () => {
    try {
      await runPackageJsonScript('test');
      return 'Success';
    } catch (error) {
      throw new Error('Something went wrong');
    }
  },
};

