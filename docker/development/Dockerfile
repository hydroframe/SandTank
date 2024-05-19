# -----------------------------------------------------------------------------
# Build options (* = default)
# -----------------------------------------------------------------------------
#
#  BASE_IMAGE
#    *  ubuntu:18.04
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

ARG BUILD_TYPE=Release
ARG PARFLOW_COMMIT=9c0b0f54acd6fbef2902c3d52a6bc82c285b335b
#ARG PARFLOW_COMMIT=dd49e6fc53266e9fbe4db570d81bca61b79506ad

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
        apt-get install -y --no-install-recommends python3-dev python3-pip python3-setuptools && \
        update-alternatives --install /usr/bin/python python /usr/bin/python3 1 && \
        rm -rf /var/lib/apt/lists/* && \
        pip3 install wheel && \
        pip3 install mako

# Get node and npm
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash && \
    apt-get update && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

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
    mkdir -p /opt/ecoslim && chown -R ubuntu:ubuntu /opt/ecoslim && \
    mkdir -p /pvw && chown -R ubuntu:ubuntu /pvw

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
RUN /usr/bin/make

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
    curl -L https://www.paraview.org/files/v5.7/ParaView-5.7.0-osmesa-MPI-Linux-Python3.7-64bit.tar.gz | tar --strip-components=1 -xzv

# -----------------------------------------------------------------------------
# EcoSLIM
# -----------------------------------------------------------------------------

RUN cd /home/ubuntu && \
    git clone --recursive https://github.com/reedmaxwell/EcoSLIM.git && \
    cd /home/ubuntu/EcoSLIM && git checkout 616cda79c96a7d0e4588b3924296ffe4adb792ed

WORKDIR /home/ubuntu/EcoSLIM

# Build
RUN /opt/cmake/bin/cmake .
RUN /usr/bin/make
RUN install -m 755 -o ubuntu -g ubuntu EcoSLIM.exe /opt/ecoslim

# -----------------------------------------------------------------------------
# Sandtank Client
# -----------------------------------------------------------------------------

# Copy the sandtank repo, install the client, and move it
COPY --chown=ubuntu:ubuntu . /home/ubuntu/sandtank-tmp
RUN SANDTANK_DIR=/home/ubuntu/sandtank-tmp && \
    rm -rf $SANDTANK_DIR/client/node_modules && \
    rm -rf $SANDTANK_DIR/deploy/pvw/www && \
    cd $SANDTANK_DIR/client && \
    npm install && \
    npm run build && \
    mv $SANDTANK_DIR/deploy/pvw/* /pvw/ && \
    rm -rf $SANDTANK_DIR

# -----------------------------------------------------------------------------
# Environment
# -----------------------------------------------------------------------------

ENV PARFLOW_DIR /opt/parflow
ENV LD_LIBRARY_PATH /opt/parflow/lib/
ENV PATH /opt/ecoslim:/opt/parflow/bin:/opt/paraview/bin:/opt/cmake/bin:$PATH

USER ubuntu
