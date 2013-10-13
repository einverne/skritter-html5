package com.inkren.skritter;

import android.app.Application; 
import org.acra.*; 
import org.acra.annotation.*; 

@ReportsCrashes ( 
	formKey = "", 
	formUri = "https://mcfarljw.cloudant.com/acra-skritter", 
	reportType = org.acra.sender.HttpSender.Type.JSON, 
	httpMethod = org.acra.sender.HttpSender.Method.PUT, 
	formUriBasicAuthLogin="therseredgarthicandeesto", 
	formUriBasicAuthPassword="yMiE8R3NEXSFiRmHkKHJWqfT",
	mode = ReportingInteractionMode.SILENT
	//resToastText = R.string.acra_crash_tex
) 

public class Acra extends Application { 
    @Override
    public void onCreate() { 
        super.onCreate(); 
        ACRA.init(this); 
    } 
}