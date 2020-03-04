# -----------------------------------------------------------------------------
# Build options (* = default)
# -----------------------------------------------------------------------------
#
#  BASE_IMAGE
#    *  ubuntu:18.04
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
FROM ${BASE_IMAGE}

ARG PYTHON_VERSION=2
ARG BUILD_TYPE=Release
ARG PARFLOW_COMMIT=9c0b0f54acd6fbef2902c3d52a6bc82c285b335b

# The following environment variables help with the Python 2 vs 3 option while
# we still support both of them.  In order for this approach to work, we need
# the RUN command to use bash instead of sh for variable indirection.
SHELL ["/bin/bash", "-c"]

ENV SYSTEM_PYTHON_2_PIP pip
ENV SYSTEM_PYTHON_3_PIP pip3
ENV SYSTEM_PYTHON_PIP "SYSTEM_PYTHON_${PYTHON_VERSION}_PIP"

# -----------------------------------------------------------------------------
# Timezone handling for tzdata
# -----------------------------------------------------------------------------

ENV TZ=Europe/Paris
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# -----------------------------------------------------------------------------
# System development package
# -----------------------------------------------------------------------------

RUN apt-get update && apt-get install -y --no-install-recommends \
        autoconf \
        automake \
        build-essential \
        ca-certificates \
        chrpath \
        curl \
        gfortran \
        git \
        libtool \
        openssl \
        libgomp1 \
        openmpi-bin \
        libopenmpi-dev \
        tcl-dev tk-dev libopenblas-dev liblapack-dev openssh-server \
        pkg-config && \
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
    mkhomedir_helper ubuntu && \
    mkdir -p /opt/paraview && chown -R ubuntu:ubuntu /opt/paraview && \
    mkdir -p /opt/hypre && chown -R ubuntu:ubuntu /opt/hypre && \
    mkdir -p /opt/parflow && chown -R ubuntu:ubuntu /opt/parflow && \
    mkdir -p /opt/cmake && chown -R ubuntu:ubuntu /opt/cmake && \
    mkdir -p /opt/ecoslim && chown -R ubuntu:ubuntu /opt/ecoslim

USER ubuntu

# -----------------------------------------------------------------------------
# CMake
# -----------------------------------------------------------------------------

RUN cd /opt/cmake && \
    curl -L https://cmake.org/files/v3.15/cmake-3.15.0-Linux-x86_64.tar.gz | tar --strip-components=1 -xzv

# -----------------------------------------------------------------------------
# Hypre
# -----------------------------------------------------------------------------

RUN mkdir -p /home/ubuntu/hypre && cd /home/ubuntu/hypre && \
    curl -L https://github.com/hypre-space/hypre/archive/v2.17.0.tar.gz | tar --strip-components=1 -xzv && \
    cd src && ./configure --prefix=/opt/hypre --with-MPI && \
    make install

# -----------------------------------------------------------------------------
# Parflow
# -----------------------------------------------------------------------------

RUN mkdir -p /home/ubuntu/parflow/build && cd /home/ubuntu/parflow/build && \
    git clone --recursive https://github.com/parflow/parflow.git /home/ubuntu/parflow/src && \
    cd /home/ubuntu/parflow/src && git checkout ${PARFLOW_COMMIT}

WORKDIR /home/ubuntu/parflow/build

# Configure
RUN /opt/cmake/bin/cmake /home/ubuntu/parflow/src \
  -DHYPRE_ROOT=/opt/hypre                         \
  -DCMAKE_BUILD_TYPE=Release                      \
  -DPARFLOW_AMPS_LAYER=mpi1                       \
  -DPARFLOW_AMPS_SEQUENTIAL_IO=ON                 \
  -DPARFLOW_ENABLE_HYPRE=ON                       \
  -DPARFLOW_ENABLE_SIMULATOR=ON                   \
  -DPARFLOW_ENABLE_SZLIB=ON                       \
  -DPARFLOW_ENABLE_TOOLS=ON                       \
  -DPARFLOW_ENABLE_ZLIB=ON


# Build
RUN /opt/cmake/bin/cmake --build .

# Install
RUN /opt/cmake/bin/cmake --install . --prefix /opt/parflow

WORKDIR /opt/parflow

# Fix execution flag
USER root
RUN chmod +x /opt/parflow/bin/*
USER ubuntu

# -----------------------------------------------------------------------------
# ParaView
# -----------------------------------------------------------------------------

RUN cd /opt/paraview && \
    curl -L https://www.paraview.org/files/v5.7/ParaView-5.7.0-osmesa-MPI-Linux-Python2.7-64bit.tar.gz | tar --strip-components=1 -xzv

# -----------------------------------------------------------------------------
# EcoSLIM
# -----------------------------------------------------------------------------

RUN cd /home/ubuntu && \
    git clone --recursive https://github.com/reedmaxwell/EcoSLIM.git

WORKDIR /home/ubuntu/EcoSLIM

# Build
RUN /usr/bin/make
RUN install -m 755 -o ubuntu -g ubuntu EcoSLIM.exe /opt/ecoslim

# -----------------------------------------------------------------------------
# Environment
# -----------------------------------------------------------------------------

ENV PARFLOW_DIR /opt/parflow
ENV LD_LIBRARY_PATH /opt/parflow/lib/
ENV PATH /opt/ecoslim:/opt/parflow/bin:/opt/paraview/bin:/opt/cmake/bin:$PATH

USER ubuntu
