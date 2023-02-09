## Versioning Manager CLI

Versioning manager is a CLI that simply increment the version for android and iOS in Flutter or ReactNative projects

### Installation

```bash
sudo npm i -g versioning-manager
```

### Usage

> Important: The command below should be executed in the root project folder

```bash
vm increment-version
```

the command above will result in this:

```bash
-------------------------------------------------------
---- Successfully incremented the patch version 🎉 ----
-------------------------------------------------------

Android: 1.0.1(2)
iOS: 1.0.1(2)
```

### Multi targets

You must be asking yourself:
What if I have multiple targets on iOS?

This is the answer:
This package will handle all targets for you. It means that, the command will apply the change for all of them

### Params

| param |         description          |         type          | default |
| :---: | :--------------------------: | :-------------------: | :-----: |
|  -t   | specifies the increment type | (major\|minor\|patch) |  patch  |
|  -p   |    specifies the platform    | (android\/ios\/both)  |  both   |

### License

[MIT](https://choosealicense.com/licenses/mit/)
