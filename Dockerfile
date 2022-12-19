FROM amazon/aws-sam-cli-build-image-python3.9

RUN yum -y update && yum -y upgrade

RUN curl --silent --location https://rpm.nodesource.com/setup_14.x | bash -
RUN yum -y install nodejs

RUN npm install -g esbuild node-gyp
