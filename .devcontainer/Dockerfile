# Base image for Python development with Node.js integration
ARG VARIANT=3.13-bullseye
FROM mcr.microsoft.com/vscode/devcontainers/python:${VARIANT}

ARG NODE_VERSION="20"
ENV NPM_HOME="/npm"
ENV PATH="$NPM_HOME:$PATH"

RUN if [ "${NODE_VERSION}" != "none" ]; then \
        su vscode -c "umask 0002 && . /usr/local/share/nvm/nvm.sh && nvm install ${NODE_VERSION} && nvm alias default ${NODE_VERSION}"; \
    fi

WORKDIR /workspace

COPY ./backend /workspace/backend

# Install Maven and JRE dependencies
RUN apt-get update && apt-get install -y curl default-jre-headless maven jq && \
    mkdir -p ~/bin/openapitools && \
    curl https://raw.githubusercontent.com/OpenAPITools/openapi-generator/dc175c5/bin/utils/openapi-generator-cli.sh > ~/bin/openapitools/openapi-generator-cli && \
    chmod u+x ~/bin/openapitools/openapi-generator-cli && \
    export PATH=$PATH:~/bin/openapitools/

# Generate API clients
RUN mkdir -p /workspace/backend/lib/aitrios-console-python-client && \
    OPENAPI_GENERATOR_VERSION=7.12.0 ~/bin/openapitools/openapi-generator-cli generate \
    -i /workspace/backend/client_specs/aitrios-console-openapi.json \
    -g python \
    -o /workspace/backend/lib/aitrios-console-python-client \
    --package-name console_api_client

RUN mkdir -p /workspace/backend/lib/aitrios-console-v2-python-client && \
    OPENAPI_GENERATOR_VERSION=7.12.0 ~/bin/openapitools/openapi-generator-cli generate \
    -i /workspace/backend/client_specs/aitrios-console-v2-openapi.json \
    -g python \
    -o /workspace/backend/lib/aitrios-console-v2-python-client \
    --package-name console_v2_api_client

RUN pip install ./backend/lib/aitrios-console-python-client \
    && pip install ./backend/lib/aitrios-console-v2-python-client \
    && pip install -e ./backend

EXPOSE 8000 3000

WORKDIR /workspace/backend
CMD ["sh", "-c", "tail -f /dev/null"]
