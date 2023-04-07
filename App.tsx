import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

function App(): JSX.Element {
  enum AppState {
    LOADING,
    LOADED,
    NETWORK_ERROR,
  }

  const [state, setState] = useState({
    state: AppState.LOADING,
    text: '',
  });

  useEffect(() => {
    if (state.state === AppState.LOADING) {
      makeRequest();
    }
  });

  const buttonClickHandler = () => {
    setState({...state, state: AppState.LOADING});
  };

  const makeRequest = async () => {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 10000);
      const response = await fetch('https://catfact.ninja/fact', {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(id);
      if (response.status === 200) {
        const data = await response.json();
        setState({state: AppState.LOADED, text: data.fact});
      } else {
        setState({
          state: AppState.NETWORK_ERROR,
          text: 'Ошибка подключения к сети. Повторите попытку позже.',
        });
      }
    } catch (error) {
      setState({
        state: AppState.NETWORK_ERROR,
        text: 'Ошибка подключения к сети. Повторите попытку позже.',
      });
    }
  };

  if (state.state === AppState.LOADING) {
    return (
      <SafeAreaView style={styles.mainView}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.mainView}>
        <Text style={styles.title}>Cat facts</Text>
        <Text style={styles.text}>{state.text}</Text>
        <TouchableOpacity style={styles.button} onPress={buttonClickHandler}>
          <Text style={styles.buttonText}>New fact</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 50,
    paddingRight: '5%',
    paddingLeft: '5%',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    flexWrap: 'wrap',
  },
  text: {
    flexWrap: 'wrap',
  },
  button: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#6A5ACD',
  },
  buttonText: {
    color: 'white',
  },
});

export default App;
