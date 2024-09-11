import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  //apiUrl: 'http://5.77.39.57:50502/api/'
  // apiUrl: 'https://api.vel-used.com/api/',
  apiUrl: 'http://192.168.3.24:7567/api/',
};
