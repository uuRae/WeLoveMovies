const db = require("../db/connection");

const tableName = "reviews";

async function readCritic(critic_id) {
  return db("critics").where({ critic_id }).first();
}

async function setCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}

async function read(reviewId) {
  return db(tableName).where({ review_id: reviewId }).first();
}

async function update(review) {
  return db(tableName)
    .where({ review_id: review.review_id })
    .update(review, "*")
    .then(() => read(review.review_id))
    .then(setCritic);
}

async function destroy(reviewId) {
  return db(tableName).where({ review_id: reviewId }).del();
}

async function list(movie_id) {
  return db(tableName)
    .where({ movie_id })
    .then((reviews) => Promise.all(reviews.map(setCritic)));
}

module.exports = {
  delete: destroy,
  list,
  read,
  update,
};
