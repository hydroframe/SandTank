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
#  PYTHON_VERSION
#    *  2
#       3
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

ARG PYTHON_VERSION=2
ARG BUILD_TYPE=Release

ENV SYSTEM_PYTHON_2_PIP pip
ENV SYSTEM_PYTHON_3_PIP pip3
ENV SYSTEM_PYTHON_PIP "SYSTEM_PYTHON_${PYTHON_VERSION}_PIP"

# -----------------------------------------------------------------------------
# The following environment variables help with the Python 2 vs 3 option while
# we still support both of them.  In order for this approach to work, we need
# the RUN command to use bash instead of sh for variable indirection.
# -----------------------------------------------------------------------------

SHELL ["/bin/bash", "-c"]

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
        if [ "${PYTHON_VERSION}" = "2" ]; then apt-get install -y --no-install-recommends python2.7-dev python-pip python-setuptools; fi && \
        if [ "${PYTHON_VERSION}" = "3" ]; then apt-get install -y --no-install-recommends python3-dev python3-pip python3-setuptools; fi && \
        if [ "${PYTHON_VERSION}" = "3" ]; then update-alternatives --install /usr/bin/python python /usr/bin/python3 1; fi && \
        rm -rf /var/lib/apt/lists/* && \
        ${!SYSTEM_PYTHON_PIP} install wheel && \
        ${!SYSTEM_PYTHON_PIP} install mako

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
