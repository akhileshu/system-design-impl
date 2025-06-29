
```
your-project/
├── src/
├── Dockerfile
├── package.json
├── nginx.conf  ← create it here
```

---

- dockerize nodejs app - follow Dockerfile commmands
- run cmd `docker compose up --scale nodeapp=3` , it runs following services / containers
  - node app replicas
  - nginx-proxy-server to load-balance traffic
  - influxdb to store load test results
  - grafana to run test

You now have:

✅ 3 Node.js containers running on ports 30, 31, 32

✅ NGINX container reverse-proxying on port 80

view app at http://localhost/

```
we see load balancer working , in round robin method

Hello from de32bf58f98e
Hello from dc9853ac3fd2
Hello from b261f14fb132
```

stop all running Docker containers cmd `docker stop $(docker ps -q)`


---

### to run grafana k6
- Start services (from compose)

- Run K6 test (writes to InfluxDB)
```bash
#Replace <your_project_name> with your actual folder name (or check with docker network ls)

docker run --rm --network <your_project_name>_default \
  -v $(pwd):/scripts \
  -e K6_OUT=influxdb=http://influxdb:8086/k6 \
  grafana/k6 run /scripts/loadtest.js

docker run --rm --network scalability-and-performance_default \
  -v $(pwd):/scripts \
  -e K6_OUT=influxdb=http://influxdb:8086/k6 \
  grafana/k6 run /scripts/loadtest.js
```

When you use Docker Compose without specifying a custom network, Docker automatically creates a default network named like this: <project_name>_default

- `--rm` Auto-removes the container after it finishes

- `--network <your_project_name>_default`
Joins the Docker Compose network (containers talk using service names like influxdb, nodeapp).

- `-v $(pwd):/scripts`
Mounts your current directory ($(pwd)) into the container at /scripts.

So loadtest.js inside your folder becomes /scripts/loadtest.js inside the container.

- `-e K6_OUT=influxdb=http://influxdb:8086/k6`
Tells k6 to write results to InfluxDB.

influxdb is the service name (resolves inside Docker network). Port 8086 is InfluxDB’s API port. /k6 means use the k6 database (InfluxDB DB name).

- `grafana/k6 run /scripts/loadtest.js`
Runs the actual k6 load test using your script.

---
load test results with single server

without cluster mode
req per second - 20
mean req duration - 13ms

cluster mode
req per second - 40
mean req duration - 13ms

> ⚠️ Just One Caution
- If each container forks, say, 8 workers (for 8 cores), and you run 3 containers, you now have 24 Node processes competing for CPU — this works only if your host has enough cores. Otherwise, context switching may hurt performance at higher loads.
---

### depricated notes

- run replicas of node app - follow docker-compose.yml command
- run **NGINX as a reverse proxy** to load-balance traffic
- starting nginx container with compose config insted
```bash
# run  nginx loadbalancer with config
docker run -d --name nginx-loadbalancer -p 80:80 \
  -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro \
  nginx

```
or 

```bash
docker start nginx-loadbalancer
# docker restart nginx-loadbalancer
```
