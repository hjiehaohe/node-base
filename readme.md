# create a node project in docker with mongodb , redis and kafka.

## running it in docker-compose, make sure you have install docker-compose

about the config:
in docker-compose.yml, you should replace the `KAFKA_ADVERTISED_HOST_NAME` with your own IP address. It will not work with 127.0.0.1 and localhost.


in this root directory, run:
``` docker-compose up -d ```
then it will auto build images, create containers, and finally run the container.
