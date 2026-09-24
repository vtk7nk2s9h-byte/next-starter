// ESM: `prisma orm init` added "type": "module" to package.json, which makes a
// plain .js config CommonJS-in-an-ESM-scope and throws on `module.exports`.
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
