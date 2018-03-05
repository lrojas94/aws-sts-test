This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Below you will find some information on how to perform common tasks.<br>
You can find the most recent version of this guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Purpose
This is a simple project whose only purpose is to train a bit on AWS. Here, we go ahead and use STS (Security Token Service) via a WebIdentity for temporary access.

This is purely a front-end app. using React (based on Create-React-App), and all it does is login with Facebook, and then show in the contents of an S3 Bucket. Note that the bucket *should* have CORS enabled for it to properly work. Make sure to configure **.env.local** in accordance to **.env.sample** to get the app to work as expected.

You can create **.env.sample** by doing:
```
cp .env.sample .env.local
```

To run the app you may use `yarn start`. Make sure you install deps. with `yarn install`.