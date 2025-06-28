
```
your-project/
├── src/
├── Dockerfile
├── package.json
├── nginx.conf  ← create it here
```

---

- dockerize nodejs app - follow Dockerfile commmands
- run replicas of node app - follow docker-compose.yml command
- run **NGINX as a reverse proxy** to load-balance traffic
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

---

stop all running Docker containers

```bash
docker stop $(docker ps -q)
```
