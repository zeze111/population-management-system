import chai from "chai";
import chaiHttp from "chai-http";
import app from "../index";
import {
  locationMock,
  parentLocationMock,
  locationMock2,
  errorLocationMock
} from "./mock";

const should = chai.should();

chai.use(chaiHttp);

let locationId;
let locationId2;

describe("Empty data for get all locations", () => {
  it("it should return an empty list", done => {
    chai
      .request(app)
      .get("/api/v1/locations")
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.body.status.should.equal("Successful");
        res.body.message.should.equal("There are currently no locations");
        done();
      });
  });
});

describe("Create a location", () => {
  it("should return an error that there's no parent location", done => {
    chai
      .request(app)
      .post("/api/v1/location")
      .send(locationMock)
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(404);
        res.body.status.should.equal("Unsuccessful");
        res.body.message.should.equal(
          "Parent location does not exist in the database"
        );
        done();
      });
  });

  it("should create a new location", done => {
    chai
      .request(app)
      .post("/api/v1/location")
      .send(parentLocationMock)
      .end((err, res) => {
        locationId = res.body.location.id;
        should.not.exist(err);
        res.status.should.equal(201);
        res.body.status.should.equal("Successful");
        done();
      });
  });

  it("should create a new location", done => {
    chai
      .request(app)
      .post("/api/v1/location")
      .send(locationMock)
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(201);
        res.body.status.should.equal("Successful");
        done();
      });
  });

  it("should create a new location", done => {
    chai
      .request(app)
      .post("/api/v1/location")
      .send(locationMock)
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(409);
        res.body.status.should.equal("Unsuccessful");
        res.body.message.should.equal("Location already exist");
        done();
      });
  });

  it("should create a new location", done => {
    chai
      .request(app)
      .post("/api/v1/location")
      .send(locationMock2)
      .end((err, res) => {
        locationId2 = res.body.location.id;
        should.not.exist(err);
        res.status.should.equal(201);
        res.body.status.should.equal("Successful");
        done();
      });
  });

  it("should return a validation error", done => {
    chai
      .request(app)
      .post("/api/v1/location")
      .send(errorLocationMock)
      .end((err, res) => {
        res.status.should.equal(422);
        res.body.status.should.equal("Unsuccessful");
        res.body.message.should.equal("Invalid data input");
        done();
      });
  });
});

describe("Get all locations", () => {
  it("it should return a nested list of locations", done => {
    chai
      .request(app)
      .get("/api/v1/locations")
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.body.status.should.equal("Successful");
        done();
      });
  });
});

describe("Update a location", () => {
  it("should return an error that id is not a number", done => {
    chai
      .request(app)
      .put("/api/v1/location/thirty")
      .send({ females: "46" })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(406);
        res.body.status.should.equal("Unsuccessful");
        res.body.message.should.equal("Location ID must be a number");
        done();
      });
  });

  it("should return an error that location wasn't found", done => {
    chai
      .request(app)
      .put(`/api/v1/location/24`)
      .send({ females: "46" })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(404);
        res.body.status.should.equal("Unsuccessful");
        res.body.message.should.equal("Location not found");
        done();
      });
  });

  it("should return a validation error", done => {
    chai
      .request(app)
      .put(`/api/v1/location/${locationId}`)
      .send({ name: "os" })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(422);
        res.body.status.should.equal("Unsuccessful");
        res.body.message.should.equal("Invalid data input");
        done();
      });
  });

  it("should return an error that user must input data", done => {
    chai
      .request(app)
      .put(`/api/v1/location/${locationId}`)
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(400);
        res.body.status.should.equal("Unsuccessful");
        res.body.message.should.equal("Must input data");
        done();
      });
  });

  it("should update a location", done => {
    chai
      .request(app)
      .put(`/api/v1/location/${locationId}`)
      .send({ females: "46" })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.body.status.should.equal("Successful");
        done();
      });
  });
});

describe("Delete a location", () => {
  it("should return an error that location does not exist", done => {
    chai
      .request(app)
      .delete("/api/v1/location/61")
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(404);
        res.body.status.should.equal("Unsuccessful");
        res.body.message.should.equal("Location not found");
        done();
      });
  });

  it("should delete the specified location", done => {
    chai
      .request(app)
      .delete(`/api/v1/location/${locationId2}`)
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.body.status.should.equal("Successful");
        res.body.message.should.equal("New York has been deleted");
        done();
      });
  });
});
