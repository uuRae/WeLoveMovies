const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
  const movie = await service.read(req.params.movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  return next({ status: 404, message: `Movie cannot be found.` });
}

async function read(req, res) {
  const { movie } = res.locals;
  res.json({ data: movie });
}

async function list(req, res) {
  const { is_showing } = req.query;
  if (is_showing === "true") {
    const movies = await service.list(true);
    res.json({ data: movies });
  } else {
    const movies = await service.list();
    res.json({ data: movies });
  }
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), read],
};
