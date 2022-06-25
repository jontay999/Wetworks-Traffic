# Wetworks-Traffic

- Go http server using gin gonic
- Vanilla Javascript with drag and drop api
- Dockerfile to run on alpine and compile down to binary

## To host it locally

```
docker build -t wetworks .
docker run --rm -p 3000:3000 wetworks
```

And connect to `localhost:3000`

- Or simply run `go run main.go`
  - You might need to run it in `sudo` because it needs to create some temp files in the `/var/` directories
