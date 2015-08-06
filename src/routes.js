import app from './app'

app.config(configFn)

function configFn($state, $url) {
  $url.otherwise('/')

  $state.state('home', {
    url: '/',
    template: '<h1>Home</h1>',
  })

  $state.state('about', {
    url: '/about',
    template: '<h1>About</h1>',
  })
}

configFn.$inject = [
  '$stateProvider',
  '$urlRouterProvider',
]
