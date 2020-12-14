# react-native-speech-recognization

## Getting started

```
yarn add react-native-speech-recognization --save
```

```
$ npm install react-native-speech-recognization --save
```

* ios

```
$ npx pod install
```

Or

```
cd ios && pod install
```

Because implemented by swift class, so just need to do addtion steps to do
https://github.com/ko2ic/image_downloader/wiki#ios 

* android
1. Add dependencies in project build.gradle

    `maven {url 'https://developer.huawei.com/repo/'}`

    .build.gradle
    ``` gradle
    allprojects {
        repositories {
            ...
            maven {url 'https://developer.huawei.com/repo/'}
        }
    }
    ```
2. Add permissions to project manifest
    ```
    <uses-permission android:name="android.permission.RECORD_AUDIO"/>
    ```

## Usage
```javascript

import {DictationPanel} from 'react-native-speech-recognization';

export default class App extends Component<{}> {
  ...

  render() {
    return (
      <View style={styles.container}>
        ...
        <DictationPanel
          onStartRecord={() => {
            this.setState({status: 'Listening...'});
          }}
          onEndRecord={(text) => {
            this.setState({status: 'Done'});
          }}
          onComplete={(text) => {
            this.setState((prevState) => ({
              message: `${prevState.message || ''}${text}`,
            }));
          }}
        />
      </View>
    );
  }
}

```
