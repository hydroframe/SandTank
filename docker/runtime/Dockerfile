# -----------------------------------------------------------------------------
# Build options (* = default)
# -----------------------------------------------------------------------------
#
#  BASE_IMAGE
#    *  ubuntu:18.04
#
#  DEV_IMAGE
#    *  sandtank-dev
#
#  BUILD_TYPE
#    *  Release
#
#  PARFLOW_COMMIT
#    *  9c0b0f54acd6fbef2902c3d52a6bc82c285b335b
#
# -----------------------------------------------------------------------------

ARG BASE_IMAGE=ubuntu:18.04
ARG DEV_IMAGE=sandtank-dev

FROM ${DEV_IMAGE} AS devimage

FROM ${BASE_IMAGE}

ARG BUILD_TYPE=Release

# -----------------------------------------------------------------------------
# Timezone handling for tzdata
# -----------------------------------------------------------------------------

ENV TZ=Europe/Paris
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# -----------------------------------------------------------------------------
# System development package
# -----------------------------------------------------------------------------

RUN apt-get update && apt-get install -y --no-install-recommends \
        ca-certificates \
        chrpath \
        curl \
        openssl \
        openmpi-bin \
        libopenmpi-dev \
        libgomp1 \
        tcl-dev tk-dev libopenblas-base liblapack-dev openssh-server && \
        apt-get install -y --no-install-recommends python3-dev python3-pip python3-setuptools && \
        update-alternatives --install /usr/bin/python python /usr/bin/python3 1 && \
        rm -rf /var/lib/apt/lists/* && \
        pip3 install wheel && \
        pip3 install mako

# -----------------------------------------------------------------------------
# Non privilege user: ubuntu
# -----------------------------------------------------------------------------

# Create a non-root user
RUN groupadd ubuntu && \
    useradd -g ubuntu -d /home/ubuntu ubuntu && \
    usermod -u 4444 ubuntu && \
    groupmod -g 4444 ubuntu && \
    mkhomedir_helper ubuntu && \
    mkdir -p /opt/paraview && chown -R ubuntu:ubuntu /opt/paraview && \
    mkdir -p /opt/hypre && chown -R ubuntu:ubuntu /opt/hypre && \
    mkdir -p /opt/parflow && chown -R ubuntu:ubuntu /opt/parflow && \
    mkdir -p /opt/ecoslim && chown -R ubuntu:ubuntu /opt/ecoslim

USER ubuntu

COPY --from=devimage  /opt/paraview  /opt/paraview
COPY --from=devimage  /opt/hypre     /opt/hypre
COPY --from=devimage  /opt/parflow   /opt/parflow
COPY --from=devimage  /opt/ecoslim   /opt/ecoslim
COPY --from=devimage  /pvw           /pvw

ENV PARFLOW_DIR      /opt/parflow
ENV LD_LIBRARY_PATH  /opt/parflow/lib/
ENV PATH             /opt/ecoslim:/opt/parflow/bin:/opt/paraview/bin:/opt/cmake/bin:$PATH
