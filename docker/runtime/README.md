# Runtime Docker 

This Dockerfile will create an ubuntu:18.04 machine for runtime environment for ParFlow and ParaView.

This Image will use the development one to copy from ParaView and ParFlow install tree. Both the `development` and `runtime` image can be used interchangeably except that the runtime will be missing all the development tools required to compile any code base but will provide a smaller footprint.
