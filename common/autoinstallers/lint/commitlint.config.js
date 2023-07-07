module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-min-length': [2, 'always', 16],
    'not-allowed-chars': [2, 'always']
  },
  plugins: [
    {
      rules: {
        'not-allowed-chars': params => {
          const { raw } = params;
          const reg =
            /^[a-zA-Z0-9\s`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]+$/im;

          return [
            reg.exec(raw),
            'Your commit message should only contain english characters, numbers, empty space, and special characters.'
          ];
        }
      }
    }
  ]
};
