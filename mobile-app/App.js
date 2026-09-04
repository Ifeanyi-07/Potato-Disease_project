import React, {useState} from 'react';
import {
  SafeAreaView,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  Platform,
  Dimensions,
  useColorScheme,
  View,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import PermissionsService, {isIOS} from './Permissions';


axios.interceptors.request.use(
  async config => {
    let request = config;

    request.headers = {
      Accept: 'application/json',
    };

    request.url = configureUrl(config.url);

    return request;
  },
  error => error,
);

export const {height, width} = Dimensions.get('window');

export const configureUrl = url => {
  let authUrl = url;
  if (url && url[url.length - 1] === '/') {
    authUrl = url.substring(0, url.length - 1);
  }
  return authUrl;
};

export const fonts = {
  Bold: {fontFamily: 'Roboto-Bold'},
};

const options = {
  mediaType: 'photo',
  quality: 1,
  width: 256,
  height: 256,
  // includeBase64: true,
};

const App = () => {
  const [result, setResult] = useState('');
  const [label, setLabel] = useState('');
  const [loading, setLoading] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';
  const [image, setImage] = useState('');
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };


  const getPrediction = async params => {
  try {
    const bodyFormData = new FormData();

    bodyFormData.append('file', {
      uri: params.uri,
      name: params.name || 'potato.jpg',
      type: params.type || 'image/jpeg',
    });

    const response = await axios.post(
      Config.URL,
      bodyFormData,
    );

    return response;
  } catch (error) {
    console.log('Prediction error:', error.response?.data || error.message);
    setLabel('Failed to predict');
    throw error;
  }
};

  const manageCamera = async type => {
    try {
      if (!(await PermissionsService.hasCameraPermission())) {
        return [];
      } else {
        if (type === 'Camera') {
          openCamera();
        } else {
          openLibrary();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const openCamera = async () => {
    launchCamera(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const uri = response?.assets[0]?.uri;
        const path = Platform.OS !== 'ios' ? uri : 'file://' + uri;
        getResult(path, response);
      }
    });
  };

  const clearOutput = () => {
    setResult('');
    setImage('');
  };


const getResult = async (path, response) => {
  setImage(path);
  setResult('');
  setLoading(true);

  try {
    const asset = response.assets[0];

    const params = {
      uri: path,
      name: asset.fileName || 'potato.jpg',
      type: asset.type || 'image/jpeg',
    };

    const res = await getPrediction(params);

    if (res?.data?.class) {
      setLabel(res.data.class);
      setResult(res.data.confidence);
    } else {
      setLabel('Failed to predict');
    }
  } catch (error) {
    setLabel('Failed to predict');
  } finally {
    setLoading(false);
  }
};

  const openLibrary = async () => {
    launchImageLibrary(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const uri = response.assets[0].uri;
        const path = Platform.OS !== 'ios' ? uri : 'file://' + uri;
        getResult(path, response);
      }
    });
  };

  const formatDiseaseName = disease => {
  if (!disease) {
    return '';
  }

  return disease
    .replace('Potato___', '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
  };

  return (
    <View style={[backgroundStyle, styles.outer]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ImageBackground
        blurRadius={10}
        source={{uri: 'background'}}
        style={{height: height, width: width}}
      />
      <Text style={styles.title}>{'Potato Disease \nPrediction App'}</Text>
      <TouchableOpacity onPress={clearOutput} style={styles.clearStyle}>
        <Image source={{uri: 'clean'}} style={styles.clearImage} />
      </TouchableOpacity>
      {(image?.length && (
        <Image source={{uri: image}} style={styles.imageStyle} />
      )) ||
        null}
      {loading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFF" />
        <Text style={styles.loadingText}>Analyzing leaf...</Text>
      </View>
      ) : result && label ? (
      <View style={styles.resultCard}>
        <Text style={styles.resultTitle}>Prediction</Text>

      <Text style={styles.diseaseName}>
        {formatDiseaseName(label)}
      </Text>

      <Text style={styles.confidenceLabel}>
        Confidence
      </Text>

          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressBar,
                {width: `${parseFloat(result) || 0}%`},
              ]}
            />
          </View>

          <Text style={styles.confidenceValue}>
            {parseFloat(result).toFixed(2)}%
          </Text>
        </View>
      ) : image ? (
        <Text style={styles.emptyText}>{label}</Text>
      ) : (
        <Text style={styles.emptyText}>
          Use below buttons to select a picture of a potato plant leaf.
        </Text>
      )}
      <View style={styles.btn}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => manageCamera('Camera')}
          style={styles.btnStyle}>
          <Image source={{uri: 'camera'}} style={styles.imageIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => manageCamera('Photo')}
          style={styles.btnStyle}>
          <Image source={{uri: 'gallery'}} style={styles.imageIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    alignSelf: 'center',
    position: 'absolute',
    top: (isIOS && 35) || 10,
    fontSize: 30,
    ...fonts.Bold,
    color: '#FFF',
  },
  clearImage: {height: 40, width: 40, tintColor: '#FFF'},
  mainOuter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: height / 1.6,
    alignSelf: 'center',
  },
  outer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    position: 'absolute',
    bottom: 40,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  btnStyle: {
    backgroundColor: '#FFF',
    opacity: 0.8,
    marginHorizontal: 30,
    padding: 20,
    borderRadius: 20,
  },
  imageStyle: {
    marginBottom: 50,
    width: width / 1.5,
    height: width / 1.5,
    borderRadius: 20,
    position: 'absolute',
    borderWidth: 0.3,
    borderColor: '#FFF',
    top: height / 4.5,
  },
  clearStyle: {
    position: 'absolute',
    top: 100,
    right: 30,
    tintColor: '#FFF',
    zIndex: 10,
  },
  space: {marginVertical: 10, marginHorizontal: 10},
  labelText: {color: '#FFF', fontSize: 20, ...fonts.Bold},
  resultText: {fontSize: 32, ...fonts.Bold},
  imageIcon: {height: 40, width: 40, tintColor: '#000'},
  emptyText: {
    position: 'absolute',
    top: height / 1.6,
    alignSelf: 'center',
    color: '#FFF',
    fontSize: 20,
    maxWidth: '70%',
    ...fonts.Bold,
  },
  loadingContainer: {
  position: 'absolute',
  top: height / 1.6,
  alignSelf: 'center',
  alignItems: 'center',
  },

  loadingText: {
    color: '#FFF',
    fontSize: 20,
    marginTop: 15,
    ...fonts.Bold,
  },

  resultCard: {
    position: 'absolute',
    top: height / 1.55,
    width: width * 0.8,
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignSelf: 'center',
  },

  resultTitle: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
  },

  diseaseName: {
    color: '#FFF',
    fontSize: 28,
    textAlign: 'center',
    ...fonts.Bold,
    marginBottom: 20,
  },

  confidenceLabel: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 8,
  },

  progressBackground: {
    width: '100%',
    height: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
  },

  progressBar: {
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#FFF',
  },

  confidenceValue: {
    color: '#FFF',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 8,
    ...fonts.Bold,
  },
});

export default App;
