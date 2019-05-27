export const locationRules = {
  name: "required|string|min:3",
  males: "required|numeric|min:1",
  females: "required|numeric|min:1",
  parentLocation: "alpha|min:3"
};

export const updateLocationRules = {
  name: "alpha|min:3",
  males: "numeric|min:1",
  females: "numeric|min:1",
  parentLocation: "alpha|min:3"
};

export const isNum = (number, response, modelType) => {
  if (isNaN(number)) {
    return response.status(406).json({
      status: "Unsuccessful",
      message: `${modelType} ID must be a number`
    });
  }
};
