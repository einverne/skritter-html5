package com.inkren.skritter;

import android.app.Application;
import com.testflightapp.lib.TestFlight;

public class App extends Application {
	@Override
    public void onCreate() {
        super.onCreate();
        //Initialize TestFlight with your app token.
        TestFlight.takeOff(this, "40e452fd-4da6-4efa-84ba-88d86e5ca747");
    }
}
