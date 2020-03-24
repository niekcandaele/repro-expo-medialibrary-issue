/**
 * @format
 */
import * as MediaLibrary from 'expo-media-library';
import BackgroundFetch from "react-native-background-fetch";
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';



AppRegistry.registerComponent(appName, () => App);


let MyHeadlessTask = async (event) => {
    // Get task id from event {}:
    let taskId = event.taskId;
    console.log('[BackgroundFetch HeadlessTask] start: ', taskId);

    const permissionsMediaLib = await MediaLibrary.getPermissionsAsync();

    console.log(permissionsMediaLib);


    try {
        const response = await MediaLibrary.getAssetsAsync({ first: 20, mediaType: ["photo"] });
        console.log('[BackgroundFetch HeadlessTask] response: ', response);
    } catch (error) {
        console.log(`Error getting assets from library! ${error}`);
    }


    // Required:  Signal to native code that your task is complete.
    // If you don't do this, your app could be terminated and/or assigned
    // battery-blame for consuming too much time in background.
    BackgroundFetch.finish(taskId);
}

// Register your BackgroundFetch HeadlessTask
BackgroundFetch.registerHeadlessTask(MyHeadlessTask);

BackgroundFetch.configure({
    minimumFetchInterval: 15,     // <-- minutes (15 is minimum allowed)
    // Android options
    forceAlarmManager: false,     // <-- Set true to bypass JobScheduler.
    stopOnTerminate: false,
    startOnBoot: true,
    requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE, // Default
    requiresCharging: false,      // Default
    requiresDeviceIdle: false,    // Default
    requiresBatteryNotLow: false, // Default
    requiresStorageNotLow: false,  // Default
    enableHeadless: true,
}, MyHeadlessTask);
