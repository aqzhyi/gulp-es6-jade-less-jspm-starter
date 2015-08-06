// core
import 'bootstrap/css/bootstrap.css!css'
import 'bootstrap'
import angular from 'angular'

// app
import app from './app'
import './routes'

angular.bootstrap(document, [app.name])
