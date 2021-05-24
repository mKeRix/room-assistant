# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.134.1/containers/typescript-node/.devcontainer/base.Dockerfile
ARG VARIANT="14"
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-${VARIANT}

# [Optional] Uncomment this section to install additional OS packages.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends gnupg2 build-essential libavahi-compat-libdnssd-dev bluetooth libbluetooth-dev libudev-dev \
    && ln -s /usr/bin/gpg /usr/local/bin/gpg

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node packages
# Upgrade npm to v7
RUN sudo -u node npm install -g npm@7
