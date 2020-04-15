const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4')

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const checkId = (request, response, next) => {
  const { id } = request.params;

  const repositoryIdx = repositories.findIndex(repository => repository.id === id);
  
  if (repositoryIdx < 0) {
    return response.status(400).json({msg: 'Repository index does not exists'});
  }

  request.params.requestedIndex = repositoryIdx;

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", checkId, (request, response) => {
  const { title, url, techs } = request.body;
  const index = request.params.requestedIndex;

  repositories[index].title = title;
  repositories[index].url = url;
  repositories[index].techs = techs;

  return response.json(repositories[index]);
});

app.delete("/repositories/:id", checkId, (request, response) => {
  const index = request.params.requestedIndex;

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checkId, (request, response) => {
  const index = request.params.requestedIndex;

  repositories[index].likes += 1;

  return response.json(repositories[index]);
});

module.exports = app;
