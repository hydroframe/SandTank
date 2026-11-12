# -----------------------------------------------------------------------------
# Build options (* = default)
# -----------------------------------------------------------------------------
#
#  BASE_IMAGE
#    *  ubuntu:24.04
#
#  BUILD_TYPE
#    *  Release
#
#  PARFLOW_COMMIT
#    *  9c0b0f54acd6fbef2902c3d52a6bc82c285b335b
#
# -----------------------------------------------------------------------------

ARG BASE_IMAGE=ubuntu:24.04
FROM ${BASE_IMAGE}

ARG BUILD_TYPE=Release
# Use explicit parflow commit ID to version from July 1, 2024
ARG PARFLOW_COMMIT=b52ffd52e2499f212bbace811e3999fcc4241c7a

# -----------------------------------------------------------------------------
# Timezone handling for tzdata
# -----------------------------------------------------------------------------

ENV TZ=Europe/Paris
ENV DEBIAN_FRONTEND=noninteractive
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
        libatomic1 \
        libtool \
        openssl \
        libgomp1 \
        openmpi-bin \
        libopenmpi-dev \
        tcl-dev tk-dev libopenblas-dev liblapack-dev openssh-server \
        pkg-config \
        xz-utils && \
        apt-get install -y --no-install-recommends python3-dev python3-pip python3-setuptools && \
        update-alternatives --install /usr/bin/python python /usr/bin/python3 1 && \
        rm -rf /var/lib/apt/lists/* && \
        pip3 install --break-system-packages wheel mako 'pftools[all]' && \
        curl -fsSLo /tmp/libssl1.1.deb http://security.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2.24_amd64.deb && \
        dpkg -i /tmp/libssl1.1.deb && \
        rm /tmp/libssl1.1.deb

# Get node and npm
ARG NODE_VERSION=26.13.0
ARG NODE_SHA256=d28a96af6c38596f6d9d97c0ee531c13d238d757742387d1928de822d959e997
RUN curl -fsSLo /tmp/node.tar.xz https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz && \
    echo "${NODE_SHA256}  /tmp/node.tar.xz" | sha256sum -c - && \
    tar -xJf /tmp/node.tar.xz -C /usr/local --strip-components=1 --no-same-owner && \
    rm /tmp/node.tar.xz && \
    node --version && npm --version

# -----------------------------------------------------------------------------
# Non privilege user: ubuntu
# -----------------------------------------------------------------------------

# ubuntu:24.04 already ships user ubuntu (UID 1000); create only if missing
RUN if ! id ubuntu >/dev/null 2>&1; then \
        groupadd ubuntu && \
        useradd -g ubuntu -d /home/ubuntu ubuntu && \
        mkhomedir_helper ubuntu; \
    fi && \
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
    curl -L https://github.com/Kitware/CMake/releases/download/v3.28.6/cmake-3.28.6-linux-x86_64.tar.gz | tar --strip-components=1 -xzv

# -----------------------------------------------------------------------------
# Hypre
# -----------------------------------------------------------------------------

RUN mkdir -p /home/ubuntu/hypre && cd /home/ubuntu/hypre && \
    curl -L https://github.com/hypre-space/hypre/archive/v2.17.0.tar.gz | tar --strip-components=1 -xzv && \
    cd src && CFLAGS="-O2 -Wno-error=implicit-function-declaration" ./configure --prefix=/opt/hypre --with-MPI && \
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
# EcoSLIM repo commit Ids: (Bill Hasling observations)
# Nov 14, 2019 (used in sandtank running from July 2021-May 2024) 7371e45f2e7abc1d8a12977d552659efaff712ac
# Sep 10, 2021 (Steve Smith change) 5ed1bf81fc77abd9e180fd67d483f9ac86ddbe62
#    This version requires latest parflow build, but works the same as Nov 14, 2019 version
# Apr 29, 2023 (zperzam change) be9859274e11fdc28b4749bfadc782f4acc8c30f
#    This version contains significant algorithm changes and only gets particles from left/right ends (not working as expected in Sandtank)  
#    Significant changes of Apr 29, 2023 include:
#        introduced two new required parameters in slimin.txt for: velfile and boolName
#        Computed and used BoundFlux in place/in addition to EvapoTransp

RUN cd /home/ubuntu && \
    git clone --recursive https://github.com/reedmaxwell/EcoSLIM.git && \
    cd /home/ubuntu/EcoSLIM && git checkout 5ed1bf81fc77abd9e180fd67d483f9ac86ddbe62

WORKDIR /home/ubuntu/EcoSLIM

# Build
RUN /opt/cmake/bin/cmake -DCMAKE_Fortran_FLAGS="-fallow-argument-mismatch" .
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

ENV PARFLOW_DIR=/opt/parflow
ENV LD_LIBRARY_PATH=/opt/parflow/lib/:/opt/paraview/lib/
ENV PATH=/opt/ecoslim:/opt/parflow/bin:/opt/paraview/bin:/opt/cmake/bin:$PATH

USER ubuntu
