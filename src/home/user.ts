import Home from './home';

export default class User {
  readonly home: Home;

  constructor(home: Home) {
    this.home = home;
  }
}
