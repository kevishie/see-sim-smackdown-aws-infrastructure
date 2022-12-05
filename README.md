# SEE AWS Infrastructure

This repository contains files which are used to manage infrastructure on AWS.

### Required Software for Development

- [Visual Studio Code](https://code.visualstudio.com)
- [Prettier VS Code](https://github.com/prettier/prettier)
- [Docker](https://www.docker.com/products/docker-desktop)

#### Build Docker image

```sh
docker build --rm -t see/aws-infrastructure .
```

#### Deploy

To deploy the sam template

```bash
docker run \
  -it \
  --rm \
  -v $(pwd):/root/project \
  --workdir=/root/project \
  --env AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY \
  --env AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_KEY \
   see/aws-infrastructure bash
```

Once you have shell access, run the following commands

```bash
# Deploying to production
sam build
sam deploy --config-file samconfig.toml
```
