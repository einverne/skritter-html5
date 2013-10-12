/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.inkren.skritter;

import java.util.concurrent.ExecutorService;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import org.apache.cordova.*;

public class Skritter extends Activity implements CordovaInterface {
	CordovaWebView cwv;

	@Override
	@SuppressWarnings("static-access")
	@SuppressLint("NewApi")
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.main);
		cwv = (CordovaWebView) findViewById(R.id.viewer);
		if (Build.VERSION.SDK_INT > 16) {
			cwv.setLayerType(cwv.LAYER_TYPE_SOFTWARE, null);
        }
		Config.init(this);
		cwv.loadUrl(Config.getStartUrl());
	}

	@Override
	public Activity getActivity() {
		// TODO Auto-generated method stub
		return this;
	}

	@Override
	public ExecutorService getThreadPool() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Object onMessage(String arg0, Object arg1) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void setActivityResultCallback(CordovaPlugin arg0) {
		// TODO Auto-generated method stub

	}

	@Override
	public void startActivityForResult(CordovaPlugin arg0, Intent arg1, int arg2) {
		// TODO Auto-generated method stub

	}
}
