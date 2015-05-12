import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import { defineFixture } from 'ic-ajax';
import startApp from 'manifoldjs-site/tests/helpers/start-app';

var App;

module('Acceptance: Generator Errors', {
  beforeEach: function() {
    App = startApp();
    App.register('ga:main',function(){},{ instantiate: false });
    defineFixture('http://testserver/manifests/',{
      response: {
        "content":{
          "start_url":"http://bing.com",
          "short_name":"BingCom"
        },
        "format":"w3c",
        "id":"123",
        "errors":[],
        "suggestions":[],
        "warnings":[]
      },
      jqXHR: {},
      textStatus: 'success'
    });

  },

  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('shows errors if the build fails', function(assert) {
  defineFixture('http://testserver/manifests/123/build',{
    errorThrown: 'There were errors',
    jqXHR: {},
    textStatus: 'error'
  });

  visit('/generator');
  fillIn('.form-item.url > input','bing.com');
  click('.get-started');
  click('.build');
  andThen(function() {
    var errors = find(".build-errors > p");
    assert.equal(errors.text(), 'There were errors');
  });
});

test('shows only error notification if no message is found in error', function(assert) {
  defineFixture('http://testserver/manifests/123/build',{
    errorThrown: '',
    jqXHR: {},
    textStatus: 'error'
  });

  visit('/generator');
  fillIn('.form-item.url > input','bing.com');
  click('.get-started');
  click('.build');
  andThen(function() {
    var errors = find(".build-errors > p"),
        errorNotification = find(".build-errors > h5");

    assert.equal(errorNotification.text(),"There were some errors while trying to build your project");
    assert.equal(errors.length,0);
  });
});
