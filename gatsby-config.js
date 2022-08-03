module.exports = {
  siteMetadata: {
    title: `Gatsby Default Starter`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `@gatsbyjs`,
    siteUrl: `https://gatsbystarterdefaultsource.gatsbyjs.io/`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: 'gatsby-plugin-firebase',
      options: {
        credentials: {
          apiKey: 'AIzaSyD22NEbGm4Z6eFug-aFiXOlD3ZISDNHVV8',
          authDomain: 'hyper-4fa6c.firebaseapp.com',
          databaseURL: 'https://hyper-4fa6c.firebaseio.com',
          projectId: 'hyper-4fa6c',
          storageBucket: 'hyper-4fa6c.appspot.com',
          messagingSenderId: '846964182879',
          appId: '1:846964182879:web:8e9f9c4e35b3d9498930ea',
          measurementId: 'G-GLPBTT5VNX',
        },
      },
    },
    {
      resolve: `gatsby-plugin-create-client-paths`,
      options: { prefixes: [`/dashboard/*`] },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,

    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
};
