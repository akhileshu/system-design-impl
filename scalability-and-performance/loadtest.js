import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  vus: 20, // Virtual users
  duration: "10s", // Test duration
};

export default function () {
  // If using K6 from Docker, use:
  const res = http.get("http://172.17.0.1/api/compute");

  /*
  If running K6 from host, then:
  http.get("http://localhost/api/compute");
  */

  check(res, {
    "status is 200": (r) => r.status === 200,
  });

  sleep(1); // wait 1 sec between requests (optional)
}
