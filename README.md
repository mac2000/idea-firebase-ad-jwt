For this to work, you will need your service account credentials:

https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk


Usage example:

```
docker run -d --name fb -p 3000:3000 -v config.json:/app/config.json
```
