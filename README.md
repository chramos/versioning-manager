## Versioning Manager CLI

Versioning manager is a CLI that simply increment the version for android and iOS

### Installation

```bash
sudo npm i -g versioning-manager
```

### Usage

> Important: The command below should be executed in the root project folder

```bash
vm increment-version
```

### Params

| param |        description         |         type          | default |
| :---: | :------------------------: | :-------------------: | :-----: |
|  -t   | specify the increment type | (major\|minor\|patch) |  patch  |
|  -p   |    specify the platform    | (android\/ios\/both)  |  both   |

### License

[MIT](https://choosealicense.com/licenses/mit/)
