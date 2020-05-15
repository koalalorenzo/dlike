# dLike - Decentralised Like Widget for Static Websites
A simple Widget for any website that uses IPFS and OrbitDB to sync with other
users as well as with other services.

This is a [Qm64](https://qm64.tech) experiment!

This widget uses IPFS and OrbitDB to have a fully decentralised and p2p 
"Like button" in the browser without custom daemon or central api servers. 
**Important Note**: This project is just an experiment and far from being 
production ready! 

## Contributing

Please check [the current known issues](https://gitlab.com/Qm64/dlike/-/issues)
if you want to help! You can follow updates on this or other projects on:

- [Main Website](https://qm64.tech)
- [Telegram's Channel](https://t.me/qm64updates)

## How to setup the widget
To generate your own widget you can visit the 
[project page](https://qm64.gitlab.io/dlike/) where you can setup it.
There you can create a widget or load an existing one by knowing the DB Address.

## Requirements

- [Make](https://www.gnu.org/software/make/)
- [NodeJS](https://nodejs.org/en/)
- [yarn](https://yarnpkg.com/)

## Running locally
To run the project locally you can run from a shell:

```bash
make run 
```

This will allow you to visit and test the source code locally on a web browser
by visiting [http://127.0.0.1:9000](http://127.0.0.1:9000).
