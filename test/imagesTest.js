var assert = require('assert')
var request = require('supertest')
var path = require('path')
var Reporter = require('jsreport-core').Reporter

describe('images', function () {
  var reporter

  beforeEach(function (done) {
    // looks like a current bug in jsreport-express, it should start on random port by default
    process.env.PORT = 0
    reporter = new Reporter({
      rootDirectory: path.join(__dirname, '../')
    })

    reporter.init().then(function () {
      done()
    }).catch(done)
  })

  it('shoulb be able to upload', function (done) {
    reporter.images.upload('test', 'image/jpeg', new Buffer([1, 2, 3]))
      .then(function () {
        return reporter.documentStore.collection('images').find()
      })
      .then(function (res) {
        assert.equal(1, res.length)
        done()
      }).catch(done)
  })

  it('express get by name for not existing image should return not found', function (done) {
    request(reporter.express.app)
      .get('/api/image/name/foo')
      .expect(404, done)
  })

  it('should replace image tag with full base64 content', function (done) {
    reporter.images.upload('test withSpace', 'image/jpeg', new Buffer([1, 2, 3]))
      .then(function () {
        var request = {
          logger: reporter.logger
        }

        var response = {
          content: new Buffer('a{#image test withSpace}')
        }

        reporter.images.handleAfterTemplatingEnginesExecuted(request, response).then(function () {
          assert.equal(response.content.toString(), 'adata:image/jpeg;base64,' + new Buffer([1, 2, 3]).toString('base64'))
          done()
        }).catch(done)
      }).catch(done)
  })

  it('should replace image tag with plain base64 content', function (done) {
    reporter.images.upload('foo', 'image/jpeg', new Buffer([1, 2, 3]))
      .then(function () {
        var request = {
          logger: reporter.logger
        }

        var response = {
          content: new Buffer('a{#image foo @encoding=base64}')
        }

        reporter.images.handleAfterTemplatingEnginesExecuted(request, response).then(function () {
          assert.equal(response.content.toString(), 'a' + new Buffer([1, 2, 3]).toString('base64'))
          done()
        }).catch(done)
      }).catch(done)
  })

  it('should throw when inserting image with name containing @', function (done) {
    reporter.documentStore.collection('images').insert({
      name: 'foo@',
      content: 'foo'
    }).then(function () {
      done(new Error('Should have failed'))
    }).catch(function () {
      done()
    })
  })

  it('should throw when updating image with name containing @', function (done) {
    reporter.documentStore.collection('images').insert({
      name: 'foo',
      content: 'foo'
    }).then(function () {
      return reporter.documentStore.collection('images').update({ name: 'foo' }, { $set: { name: 'foo@' } }).then(function () {
        done(new Error('Should have failed'))
      })
    }).catch(function () {
      done()
    })
  })
})
