FROM python:3.13-slim

ARG INSTALL_DEBUG_DEPENDENCIES=false

WORKDIR /app/

COPY . /app

RUN apt-get update && apt-get install -y curl default-jre-headless maven jq && \
    mkdir -p ~/bin/openapitools && \
    curl https://raw.githubusercontent.com/OpenAPITools/openapi-generator/dc175c5/bin/utils/openapi-generator-cli.sh > ~/bin/openapitools/openapi-generator-cli && \
    chmod u+x ~/bin/openapitools/openapi-generator-cli && \
    export PATH=$PATH:~/bin/openapitools/

RUN mkdir -p /app/lib/aitrios-console-python-client && \
    OPENAPI_GENERATOR_VERSION=7.12.0 ~/bin/openapitools/openapi-generator-cli generate \
    -i /app/client_specs/aitrios-console-openapi.json \
    -g python \
    -o /app/lib/aitrios-console-python-client \
    --package-name console_api_client

RUN mkdir -p /app/lib/aitrios-console-v2-python-client && \
    OPENAPI_GENERATOR_VERSION=7.12.0 ~/bin/openapitools/openapi-generator-cli generate \
    -i /app/client_specs/aitrios-console-v2-openapi.json \
    -g python \
    -o /app/lib/aitrios-console-v2-python-client \
    --package-name console_v2_api_client

RUN pip install lib/aitrios-console-python-client
RUN pip install lib/aitrios-console-v2-python-client
RUN pip install -e . && if [ "$INSTALL_DEBUG_DEPENDENCIES" = "true" ]; then pip install -e .[debug]; fi

WORKDIR /app/app

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
