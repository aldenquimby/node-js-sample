var frisby = require('frisby');

var URL = 'http://localhost:5000/api';

frisby.globalSetup({
  request: {
    headers: { 'X-Auth-Token': 'fa8426a0-8eaf-4d22-8e13-7c1b16a9370c' }
  }
});

frisby.create('Create post')
  .post(URL + '/post', {
    author: 'Alden',
    title: 'Cool',
    body: 'My blog post.'
  })
  .expectStatus(201)
  .expectHeader('content-type', 'application/json')
  .expectJSONTypes({
    id: String,
    date: String,
  })
  .expectJSON({
    author: 'Alden',
    title: 'Cool',
    body: 'My blog post.'      
  })
.toss();
