module.exports = {
  servers: {
    one: {
      // TODO: set host address, username, and authentication method
      host: '52.78.202.57',
      username: 'ubuntu',
      pem: '/Users/sungjunyoung/Downloads/twiiks.pem'
      // password: 'server-password'
      // or neither for authenticate from ssh-agent
    }
  },

  app: {
    // TODO: change app name and path
    name: 'fontto',
      path: './',

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      // TODO: Change to your app's url
      // If you are using ssl, it needs to start with https://
        ROOT_URL: 'http://52.78.202.57/',
        MONGO_URL: 'mongodb://mongodb:27017/fontto',
        FONTTO_QUEUE: 'dev_processingQueue',
        FONTTO_ENV: 'development',
        FONTTO_AMQP_URL: 'amqp://processingHost:twiiks_1234@52.78.114.28:5672'
    },

    // ssl: { // (optional)
    //   // Enables let'screen.ynchronized encrypt (optional)
    //   autogenerate: {
    //     email: 'email.address@domain.com',
    //     // comma separated list of domains
    //     domains: 'website.com,www.website.com'
    //   }
    // },

    docker: {
      // change to 'abernix/meteord:base' if your app is using Meteor 1.4 - 1.5
      image: 'abernix/meteord:node-8.4.0-base',
    },

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true
  },

  mongo: {
    version: '3.4.1',
    servers: {
      one: {}
    }
  }
};
