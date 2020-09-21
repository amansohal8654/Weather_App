import { AppLoading } from 'expo';
import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import WeatherInfo from './components/WeatherInfo';
import UnitsPicker from './components/UnitsPicker';
import ReloadIcon from './components/Reloadicon';
import WeatherDetails from './components/WeatherDetails';
import { colors } from './utils/index';
import {Weather_Api_Key} from 'react-native-dotenv';
import { LinearGradient } from 'expo-linear-gradient';


const Base_Url = "https://api.openweathermap.org/data/2.5/weather?"

export default function App() {

  const[errorMess, setError] = useState(null)
  const[currentWeather, setCurrentWeather] = useState(null)
  const[unitSystem, setUnitSystem] = useState('metric')

  useEffect(() => {
    load()
  }, [unitSystem])

  async function load() {
    setCurrentWeather(null)
    setError(null)
    try{
      let{status} = await Location.requestPermissionsAsync()

      if(status != 'granted') {
        setError("Access to location is needed to run the app")
        return
      }

      const location = await Location.getCurrentPositionAsync()

      const {latitude, longitude} = location.coords

      const weather_Url = `${Base_Url}lat=${latitude}&lon=${longitude}&units=${unitSystem}&appid=${Weather_Api_Key}`

      const response = await fetch(weather_Url)

      const result = await response.json()

      if(response.ok)
      {
        setCurrentWeather(result)
      }
      else
      {
        setError(result.message)
      }

      console.log(latitude)
    }
    catch(error){
        setError(error.message)
    }
  }
  if(currentWeather){
    debugger
    return (
      <View style={styles.container}>
         <LinearGradient
          // Background Linear Gradient
          colors={['rgba(90,100,150,0.8)', 'transparent']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: 300,
          }}/>
        <StatusBar style="auto" />
        <View style ={styles.main}>
          <UnitsPicker unitsSystem={unitSystem} setUnitsSystem={setUnitSystem}/>
          <ReloadIcon load={load} />
          <WeatherInfo currentWeather={currentWeather} />
        </View>
        <WeatherDetails currentWeather={currentWeather} unitsSystem={unitSystem}/>
      </View>
    );
  }
  else if(errorMess){
    return (
      <View style={styles.container}>
        <ReloadIcon load={load} />
        <Text style={{ textAlign: 'center' }}>{errorMess}</Text>
        <StatusBar style="auto" />
      </View>
    );
  }
  else {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.PRIMARY_COLOR} />
            <StatusBar style="auto" />
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  main:{
    justifyContent:"center",
    flex:1
  }
});

