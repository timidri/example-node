import app from '../app.js';
import request from 'request';

describe("Server Response", () => {
  describe("GET /", () => {
    it("should return status code 200", (done) => {
      request.get('http://localhost:3000/', (error, response, body) => {
        expect(response.statusCode).toBe(200);
        app.closeServer();
        done();
      });
    });
  });
});
