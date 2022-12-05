FROM redhat/ubi8

RUN dnf upgrade -y && \
    #https://github.com/pyenv/pyenv/wiki#suggested-build-environment
    dnf install -y python3-devel make gcc zlib-devel bzip2 bzip2-devel sqlite sqlite-devel openssl-devel libffi-devel xz-devel && \
    dnf install -y python3 && \
    pip3 install aws-sam-cli awscli --ignore-installed