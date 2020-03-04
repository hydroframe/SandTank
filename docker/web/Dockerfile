# -----------------------------------------------------------------------------
# Build options (* = default)
# -----------------------------------------------------------------------------
#
#  BASE_IMAGE
#    *  sandtank-runtime
#
# -----------------------------------------------------------------------------

ARG BASE_IMAGE=sandtank-runtime
FROM ${BASE_IMAGE}

USER root

RUN apt-get update && apt-get install -y --no-install-recommends \
        apache2-dev \
        apache2 \
        libapr1-dev \
        apache2-utils \
        sudo && \
    rm -rf /var/lib/apt/lists/*


RUN groupadd proxy-mapping && \
    groupadd pvw-user && \
    useradd --system -g pvw-user -G proxy-mapping -s /sbin/nologin pvw-user && \
    usermod -a -G proxy-mapping www-data && \
    useradd admin && echo "admin:admin" | chpasswd && adduser admin sudo && \
    mkdir -p /opt/launcher/log && \
    chown -R pvw-user:pvw-user /opt/launcher && \
    mkdir -p /opt/paraviewweb/scripts && \
    touch /opt/launcher/proxy-mapping.txt && \
    chown pvw-user:proxy-mapping /opt/launcher/proxy-mapping.txt && \
    chmod 660 /opt/launcher/proxy-mapping.txt

# Copy the apache configuration file into place
COPY config/apache/001-pvw.conf /etc/apache2/sites-available/001-pvw.conf

# Copy the script into place
COPY scripts/start.sh /opt/paraviewweb/scripts/
COPY scripts/addEndpoints.sh /opt/paraviewweb/scripts/
COPY scripts/server.sh /opt/paraviewweb/scripts/

# Configure the apache web server
RUN a2enmod vhost_alias && \
    a2enmod proxy && \
    a2enmod proxy_http && \
    a2enmod proxy_wstunnel && \
    a2enmod rewrite && \
    a2enmod headers && \
    a2dissite 000-default.conf && \
    a2ensite 001-pvw && \
    a2dismod autoindex -f

# Open port 80 to the world outside the container
EXPOSE 80

# Start the container.  If we're not running this container, but rather are
# building other containers based on it, this entry point can/should be
# overridden in the child container.  In that case, use the "start.sh"
# script instead, or you can provide a custom one.
ENTRYPOINT ["/opt/paraviewweb/scripts/server.sh"]
