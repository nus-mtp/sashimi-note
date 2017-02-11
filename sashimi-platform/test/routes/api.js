// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app.js');

chai.should();
chai.use(chaiHttp);

describe('API', () => {
  describe('/GET', () => {
    it('it should get a respond', (done) => {
      chai.request(server)
        .get('/api')
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.be.a('string');
          res.text.should.be.eql('respond with a resource');
          done();
        });
    });
  });
});
