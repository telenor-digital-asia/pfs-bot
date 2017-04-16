const chai = require('chai');
const chaiHttp = require('chai-http');
const index = require('../index');

const expect = chai.expect;

chai.use(chaiHttp);

describe('/', () => {
    it('should return 200 with text', (done) => {
        chai.request(index)
            .get('/')
            .end((err, res) => {
                expect(res.status).to.be.ok;
                expect(res.text).to.equal('Hello world');
                done();
            });
    });
});

describe('/time', () => {
    it('should return all datetime when no sending param', (done) => {
        chai.request(index)
            .post('/time')
            .end((err, res) => {
                expect(res.status).to.be.ok;
                expect(res.body.response_type).to.equal('in_channel');
                expect(res.text).to.match(/.+Oslo.+Islamabad.+Dhaka.+Yangon.+Bangkok.+/);
                done();
            });
    });

    it('should return all datetime when sending text = `all`', (done) => {
        chai.request(index)
            .post('/time')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({'text': 'all'})
            .end((err, res) => {
                expect(res.status).to.be.ok;
                expect(res.body.response_type).to.equal('in_channel');
                expect(res.text).to.match(/.+Oslo.+Islamabad.+Dhaka.+Yangon.+Bangkok.+/);
                done();
            });
    });

    it('should return datetime by specific country code', (done) => {
        chai.request(index)
            .post('/time')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({'text': 'th'})
            .end((err, res) => {
                expect(res.status).to.be.ok;
                expect(res.text).to.match(/Bangkok/);
                expect(res.text).to.not.match(/\n/);
                done();
            });
    });

    it('should return description command when parameter is incorrect', (done) => {
        chai.request(index)
            .post('/time')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({'text': 'test'})
            .end((err, res) => {
                expect(res.status).to.be.ok;
                expect(res.body.response_type).to.equal('ephemeral');
                expect(res.text).to.match(/Multi countries are allowed by comma separating/);
                done();
            });
    });
});