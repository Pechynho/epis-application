import React from 'react';
import {BackHandler, RefreshControl, SafeAreaView, ScrollView, StatusBar, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import Config from "Config/Config";

const MainScreen = ({route, navigation}) => {
    const [refreshing, setRefreshing] = React.useState(false);
    const [refreshingEnabled, setRefreshingEnabled] = React.useState(true);

    let lastNavigationState = null;
    let webView = null;
    let jsToInject = `
    (() => {
        window.addEventListener("scroll", () => {
            ReactNativeWebView.postMessage(JSON.stringify({type: "WindowScrollEvent", data: {scrollY: window.scrollY}}));
        });
    })();
    `;
    const onBackPress = () => {
        if (lastNavigationState !== null && lastNavigationState.canGoBack === true) {
            webView.goBack();
            return true;
        }
        return false;
    };

    const onRefresh = () => {
        webView.reload();
        setRefreshing(false);
    };

    const onNavigationStateChange = (navigationState) => {
        lastNavigationState = navigationState;
    };

    const onJavaScriptEvent = (event) => {
        const {type, data} = JSON.parse(event.nativeEvent.data);
        if (type === "WindowScrollEvent") {
            setRefreshingEnabled(data.scrollY === 0);
        }
    };

    React.useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    });

    return (
        <>
            <StatusBar/>
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollViewContent}
                            refreshControl={
                                <RefreshControl enabled={refreshingEnabled}
                                                tintColor={"#0069b0"}
                                                colors={["#0069b0"]}
                                                refreshing={refreshing}
                                                onRefresh={onRefresh}/>}>
                    <WebView
                        style={styles.webView}
                        ref={(ref) => webView = ref}
                        source={{uri: route.params.url}}
                        originWhitelist={[Config.webUrl]}
                        sharedCookiesEnabled={true}
                        domStorageEnabled={true}
                        mixedContentMode={"compatibility"}
                        userAgent={"epis-app"}
                        allowsFullscreenVideo={true}
                        geolocationEnabled={true}
                        allowsLinkPreview={true}
                        setJavaScriptEnabled={true}
                        onNavigationStateChange={onNavigationStateChange}
                        onMessage={onJavaScriptEvent}
                        injectedJavaScript={jsToInject}
                    />
                </ScrollView>
            </SafeAreaView>
        </>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewContent: {
        flex: 1
    }
});

export default MainScreen;
