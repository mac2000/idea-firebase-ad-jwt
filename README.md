For this to work, you will need your service account credentials:

https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk

App expects it to leave here `secret/config.json`

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

Run on server:

```
docker run -d --name fb -p 58083:3000 -v %cd%\secret:C:\app\secret mac2000/idea-firebase-ad-jwt
```

On Beta:

```
docker run -d --name fb -p 58083:3000 -v  D:\mac\idea-firebase-ad-jwt\secret:C:\app\secret mac2000/idea-firebase-ad-jwt
```

On Azure:

Pass project_id, private_key_id, private_key, client_email, client_id, client_x509_cert_url environment variables from config.json
