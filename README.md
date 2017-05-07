For this to work, you will need your service account credentials:

https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk


Build & publish:

```
docker build -t mac2000/idea-firebase-ad-jwt .
```

Publish:

```
docker login
docker push mac2000/idea-firebase-ad-jwt:latest
```

Usage example:

```
docker run -d --name fb --expose 3000 -v %cd%\secret:C:\app\secret mac2000/idea-firebase-ad-jwt
```

Interactive:

```
docker run -it --rm --name fb --expose 3000 -v %cd%\secret:C:\app\secret mac2000/idea-firebase-ad-jwt
```

Go inside:

```
docker run -it --rm --name fb --expose 3000 -v %cd%\secret:C:\app\secret mac2000/idea-firebase-ad-jwt cmd
```

Exec:

```
docker exec -it fb cmd
```
