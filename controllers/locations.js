import Sequelize from "sequelize";
import Validator from "validatorjs";
import { Location } from "../models";
import { locationRules, isNum, updateLocationRules } from "../helper";

const Op = Sequelize.Op;

export default class Locations {
  static create(request, response) {
    const validator = new Validator(request.body, locationRules);
    if (validator.passes()) {
      const males = parseInt(request.body.males);
      const females = parseInt(request.body.females);
      Location.findOne({
        where: { name: { [Sequelize.Op.iLike]: request.body.name } }
      })
        .then(foundLocation => {
          if (foundLocation) {
            return response.status(409).json({
              status: "Unsuccessful",
              message: "Location already exist"
            });
          } else {
            Location.findOne({
              where: {
                name: { [Sequelize.Op.iLike]: request.body.parentLocation }
              }
            }).then(locationFound => {
              let responseData;
              if (locationFound || request.body.parentLocation === "") {
                const locationId = locationFound
                  ? locationFound.dataValues.id
                  : null;
                Location.create({
                  name: request.body.name,
                  males,
                  females,
                  parentLocation: request.body.parentLocation,
                  parentLocationId: locationId
                }).then(location => {
                  responseData = response.status(201).json({
                    status: "Successful",
                    location
                  });
                });
              } else {
                responseData = response.status(404).json({
                  status: "Unsuccessful",
                  message: "Parent location does not exist in the database"
                });
              }
              return responseData;
            });
          }
        })
        .catch(() =>
          response.status(500).json({
            message: "Internal Server Error"
          })
        );
    } else {
      const errors = validator.errors.all();
      return response.status(422).json({
        status: "Unsuccessful",
        message: "Invalid data input",
        errors
      });
    }
  }

  static getAll(request, response) {
    let totalMales = 0;
    let totalFemales = 0;
    Location.findAll({})
      .then(async locations => {
        if (locations.length === 0) {
          return response.status(200).json({
            status: "Successful",
            message: "There are currently no locations"
          });
        } else {
          const parentLocationIds = locations.map(
            location => location.parentLocationId
          );
          const ids = parentLocationIds.filter(id => id > 0);
          const parentLocations = await Location.findAll({
            where: {
              id: ids
            }
          });

          const parentLocationNames = parentLocations.map(
            location => location.name
          );
          const names = parentLocationNames.filter(name => name.length > 0);

          const subLocations = await Location.findAll({
            where: {
              parentLocation: names
            },
            attributes: ["id", "name", "males", "females", "parentLocation"]
          });

          const nestedLocations = parentLocations.map(location => {
            const specificSubLocations = subLocations.map(subLocation => {
              if (location.name === subLocation.parentLocation)
                return subLocation;
            });
            totalFemales = 0;
            totalMales = 0;

            const specificSubs = specificSubLocations.filter(
              location => location !== undefined
            );

            specificSubs.filter(location => {
              totalFemales = totalFemales + location.dataValues.females;
              totalMales = totalMales + location.dataValues.males;
              return location !== null;
            });
            const totalResidents = totalFemales + totalMales;
            const fullLocation = {
              id: location.id,
              name: location.name,
              totalFemales,
              totalMales,
              totalResidents,
              subLocations: specificSubs
            };
            return fullLocation;
          });

          return response.status(200).json({
            status: "Successful",
            locations: nestedLocations
          });
        }
      })
      .catch(() =>
        response.status(500).json({
          message: "Internal Server Error"
        })
      );
  }

  static update(request, response) {
    if (!isNum(request.params.locationId, response, "Location")) {
      const { name, males, females, parentLocation } = request.body;
      if (name || males || females || parentLocation) {
        const validator = new Validator(request.body, updateLocationRules);
        if (validator.passes()) {
          Location.findByPk(request.params.locationId)
            .then(location => {
              if (!location) {
                return response.status(404).json({
                  status: "Unsuccessful",
                  message: "Location does not exist"
                });
              } else {
                location
                  .update({
                    name: name || location.name,
                    males: males || location.males,
                    females: females || location.females,
                    parentLocation: parentLocation || location.parentLocation
                  })
                  .then(updatedLocation => {
                    response.status(200).json({
                      status: "Successful",
                      location: updatedLocation
                    });
                  });
              }
            })
            .catch(() =>
              response.status(500).json({
                message: "Internal Server Error"
              })
            );
        } else {
          const errors = validator.errors.all();
          return response.status(422).json({
            status: "Unsuccessful",
            message: "Invalid data input",
            errors
          });
        }
      } else {
        response.status(400).json({
          status: "Unsuccessful",
          message: "Must input data"
        });
      }
    }
  }

  static delete(request, response) {
    if (!isNum(request.params.locationId, response, "Location")) {
      Location.findByPk(request.params.locationId)
        .then(location => {
          if (!location) {
            response.status(404).json({
              status: "Unsuccessful",
              message: "Location not found"
            });
          } else {
            location
              .destroy()
              .then(() => {
                response.status(200).json({
                  status: "Successful",
                  message: `${location.name} has been deleted`
                });
              })
              .catch(error => response.status(400).send(error));
          }
        })
        .catch(() =>
          response.status(500).json({
            message: "Internal Server Error"
          })
        );
    }
  }
}
