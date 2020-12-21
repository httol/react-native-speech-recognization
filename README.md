# react-native-speech-recognization

Locally speech recognization for both Android and ios, use AudioEngine class of Native ios, and HuaweiHiAi sdk under android platform. Unluck that HuaweiHiAi sdk only support chinese language, will add multiple language later. However you can set multiple language by ios supported via `setLanguage` api before `startRecord`.

## Getting started

```
$ yarn add react-native-speech-recognization --save
```

```
$ npm install react-native-speech-recognization --save
```

* ios

ReactNative >= 0.60 will autolink
```
$ npx pod install
```

Or

```
cd ios && pod install
```

ReactNative < 0.60 should manullay install

Under ios because implemented by swift, so you need to do addtion steps by this [REFERENCE](https://github.com/ko2ic/image_downloader/wiki#ios)
 

- android
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
  
- Use class RNDictation to implement depends on your own needs
  
``` javascript
import {RNDictation,dicEvent} from 'react-native-speech-recognization'

//isSupport
//ios target >= 10.0
//android sdk >= 28
//this method is help you to get whether supported your device 
RNDictation.isSupport();

//setLanguage, Only form ios
//Before startRecord, you can set language for recognize (Default en-US)
RNDictation.setLanguage('en-US');

//startRecord
RNDictation.startRecord();

//endRecord
RNDictation.endRecord();

//addEventListener
RNDictation.addEventListener(dicEvent.onStart,()=>{});
RNDictation.addEventListener(dicEvent.onSuccess,(speechText)=>{});
RNDictation.addEventListener(dicEvent.onFailure,(e)=>{});

//Do not forget remove listener when component unmount
RNDictation.removeEventListener(dicEvent.onStart);
RNDictation.removeEventListener(dicEvent.onSuccess);
RNDictation.removeEventListener(dicEvent.onFailure);
```

- Directly use `<DictationPanel/>`

```javascript
import {DictationPanel,RNDictation} from 'react-native-speech-recognization';

export default class App extends Component<{}> {
  ...

  render() {
    return (
      <View style={styles.container}>
        ...
        <Button title="IsSupport" onPress={async ()=>{
           const result = await RNDictation.isSupport();
           console.log(result);
        }}/>
        <DictationPanel
          language="en-US"
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

- Reference for [languange-code](http://www.lingoes.net/en/translator/langcode.htm)
