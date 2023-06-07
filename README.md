This is a starter template for [Learn Next.js](https://nextjs.org/learn).


build
```sh
docker buildx build -f Dockerfile.prod . -t sotig/arm-snw-files:v12 --platform=linux/arm32v8
docker push  sotig/arm-snw-files:v12
```