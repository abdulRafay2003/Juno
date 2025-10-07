package com.beyond.broker

import android.os.Build
import android.os.Bundle
import android.view.View
import android.view.WindowInsets
import android.view.WindowManager
import android.content.Intent
import android.content.res.Configuration
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

 /**
 * Returns the name of the main component registered from JavaScript. This is used to schedule
 * rendering of the component.
 */
 override fun getMainComponentName(): String = "Juno"

 /**
 * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
 * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
 */
 override fun createReactActivityDelegate(): ReactActivityDelegate =
 DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

 override fun onConfigurationChanged(newConfig: Configuration) {
 super.onConfigurationChanged(newConfig)
 val intent = Intent("onConfigurationChanged")
 intent.putExtra("newConfig", newConfig)
 this.sendBroadcast(intent)
 }

 override fun onResume() {
 super.onResume()
 enterImmersiveMode()
 }

 override fun onWindowFocusChanged(hasFocus: Boolean) {
 super.onWindowFocusChanged(hasFocus)
 if (hasFocus) {
 enterImmersiveMode()
 }
 }

 private fun enterImmersiveMode() {
 // Allow layout in the cutout (Android 9+)
 if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
 window.attributes.layoutInDisplayCutoutMode =
 WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES
 }

 // Set immersive full-screen UI flags
 window.decorView.systemUiVisibility = (
 View.SYSTEM_UI_FLAG_LAYOUT_STABLE
 or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
 or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
 or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
 )
 }
}