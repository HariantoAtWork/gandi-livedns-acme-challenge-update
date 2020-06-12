# Gandi LiveDNS ACME Challenge update

Terminal commands to update your Gandi API v5 LiveDNS records for Let´s Encrypt Acme Challenges, build on Node

> NODE: v13.6.0
> NPM: 6.13.4

## RUN NODE SCRIPT

### Step #1

Before you can run this, you need to install `node_modules`.
This was build on (See NODE and NPM versions above)

```bash
npm i
```

### Step #2

Get your hands on _Gandi Apikey_

- Search Google: `gandi api key`
- Or go to this link: https://docs.gandi.net/en/domain_names/advanced_users/api.html

> At the time of this writing, url might change in the future

There are two options to include _Gandi Apikey_: File or Environment variable

- Create `APIKEY` file and store your _Gandi Apikey_
- Or run `APIKEY=GANDIAPIKEY ./gandiAcmeChallenge.js`

### METHOD: GET domain.ext

Run the script

```bash
./gandiAcmeChallenge.js domain.ext
```

On SUCCESS

```js
{
  rrset_type: 'TXT',
  rrset_ttl: 1800,
  rrset_name: '_acme-challenge',
  rrset_href: 'https://api.gandi.net/v5/livedns/domains/domain.ext/records/_acme-challenge/TXT',
  rrset_values: [
    '"acmeChallenge1"',
    '"acmeChallenge2"'
  ]
}
```

On FAIL

```js
ERROR: {
  code: 404,
  message: "Can't find the DNS record _acme-challenge/TXT in the zone",
  object: 'dns-record',
  cause: 'Not Found'
}
```

### METHOD: GET domain.ext -r subdomain

> `-r`: use this for subdomains, to read multiple subdomains: `sub1,sub2,othersub3`

Run the script

```bash
./gandiAcmeChallenge.js domain.ext -r subdomain
```

On SUCCESS

```js
{
  rrset_type: 'TXT',
  rrset_ttl: 1800,
  rrset_name: '_acme-challenge',
  rrset_href: 'https://api.gandi.net/v5/livedns/domains/domain.ext/records/_acme-challenge/TXT',
  rrset_values: [
    '"acmeChallenge1"',
    '"acmeChallenge2"'
  ]
},
{
  rrset_type: 'TXT',
  rrset_ttl: 1800,
  rrset_name: '_acme-challenge',
  rrset_href: 'https://api.gandi.net/v5/livedns/domains/domain.ext/records/_acme-challenge.subdomain/TXT',
  rrset_values: [
    '"acmeChallenge1"',
    '"acmeChallenge2"'
  ]
}
```

On FAIL

```js
ERROR: {
  code: 404,
  message: "Can't find the DNS record _acme-challenge.subdomain/TXT in the zone",
  object: 'dns-record',
  cause: 'Not Found'
}
```

### METHOD: PUT domain.ext -w acmeChallenge1 acmeChallenge2

This will create record even it's not exist or overwrite values if exist
> `-w`: Enable this to PUT keys

Run the script

```bash
./gandiAcmeChallenge.js domain.ext -w acmeChallenge1 acmeChallenge2
```

On SUCCESS

```js
{
	message: 'DNS Record Created'
}
```

Note:

Default record value will be

```js
{
  rrset_type: 'TXT',
  rrset_ttl: 1800,
  rrset_name: '_acme-challenge',
  rrset_href: 'https://api.gandi.net/v5/livedns/domains/domain.ext/records/_acme-challenge/TXT',
  rrset_values: [
    '"acmeChallenge1"',
    '"acmeChallenge2"'
  ]
}
```

### METHOD: PUT domain.ext -w acmeChallenge1 acmeChallenge2 subdomain:acmeChallenge3

This will create record even it's not exist or overwrite values if exist
> `-w`: Enable this to PUT keys
> `subdomain:acmeChallenge`: use `:` for subdomains: `_acme-challenge.subdomain`

Run the script

```bash
./gandiAcmeChallenge.js domain.ext -w acmeChallenge1 acmeChallenge2 subdomain:acmeChallenge3
```

On SUCCESS

```js
{
	message: 'DNS Record Created'
}
```

Note:

Default record value will be

```js
{
  rrset_type: 'TXT',
  rrset_ttl: 1800,
  rrset_name: '_acme-challenge',
  rrset_href: 'https://api.gandi.net/v5/livedns/domains/domain.ext/records/_acme-challenge/TXT',
  rrset_values: [
    '"acmeChallenge1"',
    '"acmeChallenge2"'
  ]
},
{
  rrset_type: 'TXT',
  rrset_ttl: 1800,
  rrset_name: '_acme-challenge',
  rrset_href: 'https://api.gandi.net/v5/livedns/domains/domain.ext/records/_acme-challenge.subdomain/TXT',
  rrset_values: [
    '"acmeChallenge3"'
  ]
}
```

## Run Docker

Use docker to run this, before that pull the repo first

```bash
docker pull harianto/gandi-acme-challenge
```

```bash
# OPTION 1:
docker run -v $PWD/APIKEY:/home/node/app/APIKEY:ro --rm -it harianto/gandi-acme-challenge
# OPTION 2:
docker run -e APIKEY=GANDI_API_KEY --rm -it harianto/gandi-acme-challenge
```

### METHOD: GET domain.ext

```bash
docker run -v $PWD/APIKEY:/home/node/app/APIKEY:ro --rm -it harianto/gandi-acme-challenge domain.ext
```

### METHOD: PUT domain.ext acmeChallenge1 acmeChallenge2

```bash
docker run -v $PWD/APIKEY:/home/node/app/APIKEY:ro --rm -it harianto/gandi-acme-challenge domain.ext acmeChallenge1 acmeChallenge2
```
