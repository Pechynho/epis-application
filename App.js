import React from 'react';
import {Linking} from "react-native";
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainScreen from "Screen/MainScreen";
import Config from "Config/Config";
import * as Navigation from "Ref/Navigation";

const Stack = createStackNavigator();

const App = () => {

  const handleOpenUrl = (event) => {
    navigateToUrl(event.url);
  };

  const navigateToUrl = (url) => {
    if (typeof url === "string" && url.startsWith(Config.webUrl)) {
      Navigation.navigate("MainScreen", {url: url});
      return;
    }
    if (url !== null) {
      throw new Error("Unknown url " + url + ".")
    }
  };

  React.useEffect(() =>{
    (async () => navigateToUrl(await Linking.getInitialURL()))();
    Linking.addEventListener("url", handleOpenUrl);
    return () => Linking.removeEventListener("url", handleOpenUrl);
  });

  return (
      <NavigationContainer ref={Navigation.navigation}>
        <Stack.Navigator>
          <Stack.Screen name="MainScreen" component={MainScreen} options={{headerShown: false}}
                        initialParams={{url: Config.webUrl}}/>
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default App;
