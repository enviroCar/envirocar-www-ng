/* The translation provider is based on the i18 internationalization
   the identifiers can be found on the left and these identifiers have to be rewritten with the corresponding translation
   for any language that is added to the translationProvider.
*/
angular.module('translations', [])
    .config(['$translateProvider', function($translateProvider) {
        console.log('translation configuration set up');
        $translateProvider.translations('en', {
            // defaults:
            'WEBSITE-TITLE' : 'EnviroCar Webapp',
            
            // Login:
            'USERNAME'  : 'Username',
            'PASSWORD'  : 'Password',
            'REGISTER'  : 'Register',
            'LOGIN'     : 'Login',
                
            'TITLE_TRACKS': 'Latest Tracks',
            'TRACK_ID': 'Track ID',
            'MODIFIED': 'Modified',
            'User_VS_PUBLIC': 'User vs Public',
            'FRIENDS_ACTIVITY': 'Friend\'s Activity',
            'LOADING_DATA': 'Loading Data...',
            'SPEED_STATS': 'Speed Zones',
            'LOAD_MORE': 'Load More',
            'HEAT_MAP': 'Heat Map',
            'MY_ACTIVITY': 'My Activity',
            'TRACK_MAP': 'Track Map',
            'GRAPH': 'Graph',
            'PIE_CHART': 'Pie Chart',
            'TRACK_SUMMARY': 'Track Summary',
            'DISTANCE': 'Distance',
            'VEHICLE_TYPE': 'VEHICLE_TYPE',
            'TOTAL_TIME': 'TOTAL_TIME',
            'START_FINISH': 'Start Finish Time',
            'CONSUMPTION': ' Consumption',
            'CONSUMPTION_HOUR': 'Consumption/Hr',
            'CO2_EMISSION': 'CO2 Emission',
            'CO2_EMISSION_HOUR': 'CO2 Emission/Hr',
            'FRIENDS': 'Friends',
            'TRACKS': 'Tracks',
            'GROUPS': 'Groups',
            'TIMELINE_TAB': 'Timeline',
            'ACTIVITY_TAB': 'Activity',
            'FRIENDS_AND_GROUPS_TAB': 'Friends and Groups',
            'NO_FRIENDS': 'You do not have any Friends',
            'NO_ACTIVITY': 'You do not have any Activity to show',
            'NO_FRIENDS_ACTIVITY': 'You do not have any friend activity to show',
            'CALENDAR_OF_TRACKS_TAB': 'Calendar',
            'ALL_TRACKS_TAB': 'All Tracks',
            'TRACKS_LIST': "Tracks List",
            'NAME': 'Name',
            'CREATED': 'Created',
            'TIME_SERIES': 'Time Series',
            'DURATION': 'Duration',
            'CAR:': 'Car:',
            'START:': 'Start:',
            'END:': 'End:',
            'CONSUMPTION:': 'Consumption:',
            'CO2_EMISSION:': 'CO2 Emission:',
            'TRACK_VS_PUBLIC': 'Track Vs Public',
            'LOGOUT': 'Logout',
            'PROFILE': 'Profile',
            'DASHBOARD': 'Dashboard',
            'TABLE': 'Profile',
            'SEGMENT': 'Segment',
            'SPEED_PIE': 'Speed',
            'CONSUMPTION_PIE': 'Consumption',
            'CO2_PIE': 'CO2',
            'STATISTICS': 'Statistics',
            'DATE_FILTERS_HEADING': 'Set Date Filters',
            'DATE_OVERLAP_ERROR': 'Start date cannot be after End Date',
            'CONTINUE': 'Continue',
            'DISTANCE_FILTERS_HEADING' : 'Set Distance Filters',
            'ERROR_NEGATIVE': 'Please give only positive integers',
            'DISTANCE_OVERLAP_ERROR': 'Minimum Distance should be lesser than maximum distance',
            'DISTANCE_ERROR_LIMIT': 'Maximum distance should be lesser than 5000km',
            'DURATION_FILTERS_HEADING': 'Set Duration Filters',
            'DURATION_OVERLAP_ERROR': 'Minimum time should be lesser than maximum time',
            'DURATION_ERROR_LIMIT': 'Maximum duration should be lesser than 6000 Minutes',
            'BIO': 'Bio',
            'EMAIL_ID': 'Email ID',
            'COUNTRY': 'Country',
            'LANGUAGE': 'Language',
            'GENDER': 'Gender',
            'TERMS_OF_USE_VERSION': 'Terms of User version',
            'BADGES': 'Badges',
            'NO_BADGES': 'You do not have any badges',
            'EDIT_INFO': 'Edit personal Information',
            'FIRST_NAME': 'First Name',
            'LAST_NAME': 'Last Name',
            'DOB': 'Date of Birth',
            'ENTER_DATE': 'Enter Date',
            'PASSWORD_TIP': 'If you do not want to change your password leave these fields blank',
            'OLD_PASSWORD': 'Old Password',
            'NEW_PASSWORD': 'New Password',
            'NEW_PASSWORD_R': 'New Password(Repeat)',
            'SUBMISSION_SUCCESS': 'Your details have been updated',
            'UPDATE_PROFILE': 'Update Profile',
            'CONTROL_PANEL': 'Control Panel',
            'SEGMENT_INFO': 'Click on map to place a marker at that point, click on it again to delete it.',
            'RESET_POINTS': 'Reset Points',
            'SEARCH_TRACKS': 'Search for tracks',
            'COUNT_POINTS': 'Count of Points',
            'MONTHLY_OVERVIEW': 'Monthly Overview',
            'NO_MONTHLY_STATISTICS': 'No statistics to show for this month',
            'ORDER_BY': 'Order By',
            'REVERSE': 'Reverse',
            'VEHICLE_FILTERS_HEADING': 'Set Distance Filters',
            'SELECT_VEHICLES': 'Select Vehicles',
            'NO_SEGMENT_TRACKS': 'We could not find any track statistics in the selected region, You could try increasing the search region by using the slider in the panel',
            'TOURTIP1': 'Draw a polyline to create segments',
            'TOURTIP2': 'Click here to search for segments, after drawing a polyline',
            'TOURTIP3': 'Edit a polyline here',
            'TOURTIP4': 'Clicking on a point removes it from the polyline',
            'TOURTIP5': 'Use the slider to change the region you are searching for, the blue circle around each point shows the region where the tracks are being searched for'
        });
        $translateProvider.translations('de', {
            // defaults:
            'WEBSITE-TITLE' : 'EnviroCar Webapp',
            
            // Login:
            'USERNAME': 'Benutzername',
            'PASSWORD': 'Passwort',
            'REGISTER': 'Registrieren',
            'LOGIN': 'Anmelden',


            'TITLE_TRACKS': 'neuste Fahrten',
            'TRACK_ID': 'Fahrt ID',
            'MODIFIED': 'Geändert',
            'User_VS_PUBLIC': 'Du im Vergleich',
            'FRIENDS_ACTIVITY': 'Aktivitäten von Freunden',
            'LOADING_DATA': 'Lade Daten...',
            'SPEED_STATS': 'Geschwindigkeitszonen',
            'LOAD_MORE': 'Lade mehr',
            'HEAT_MAP': 'Deine Einwirkungskarte',
            'MY_ACTIVITY': 'Meine Aktivitäten',
            'TRACK_MAP': 'Karte der Fahrt',
            'GRAPH': 'Graph',
            'PIE_CHART': 'Tortendiagramm',
            'TRACK_SUMMARY': 'Fahrtübersicht',
            'DISTANCE': 'Distanz',
            'VEHICLE_TYPE': 'FEHRZEUG_TYP',
            'TOTAL_TIME': 'GESAMT_ZEIT',
            'START_FINISH': 'Start Ziel Zeit',
            'CONSUMPTION': ' Verbrauch',
            'CONSUMPTION_HOUR': 'Verbrauch/Stunde',
            'CO2_EMISSION': 'CO2 Emission',
            'CO2_EMISSION_HOUR': 'CO2 Emission/Stunde',
            'FRIENDS': 'Freunde',
            'TRACKS': 'Fahrten',
            'GROUPS': 'Gruppen',
            'TIMELINE_TAB': 'Zeitleiste',
            'ACTIVITY_TAB': 'Aktivität',
            'FRIENDS_AND_GROUPS_TAB': 'Freunde und Gruppen',
            'NO_FRIENDS': 'Du hast keine Freunde',
            'NO_ACTIVITY': 'Du hast keine Aktivitäten zum Anzeigen',
            'NO_FRIENDS_ACTIVITY': 'Du hast keine Freundesaktivitäten zum Anzeigen',
            'CALENDAR_OF_TRACKS_TAB': 'Kalenderübersicht',
            'ALL_TRACKS_TAB': 'Alle Fahrten',
            'TRACKS_LIST': "Liste der Fahrten",
            'NAME': 'Name',
            'CREATED': 'Erstellt am',
            'TIME_SERIES': 'Zeitreihenanalyse',
            'DURATION': 'Fahrtzeit',
            'CAR:': 'Fahrzeug:',
            'START:': 'Start:',
            'END:': 'Ende:',
            'CONSUMPTION:': 'Verbrauch:',
            'CO2_EMISSION:': 'CO2 Emission:',
            'LOGOUT': 'Abmelden',
            'PROFILE': 'Profil',
            'DASHBOARD': 'Dashboard',
            'TABLE': 'Profil',
            'SEGMENT': 'Abschnitt',
            'SPEED_PIE': 'Geschwindigkeit',
            'CONSUMPTION_PIE': 'Verbrauch',
            'CO2_PIE': 'CO2',
            // SINGLE_TRACK_PAGE: BARCHART:
            'TRACK_VS_PUBLIC': 'Fahrt im Vergleich',
            'TRACK_VS_PUBLIC_X_AXIS' : 'Fahrt und allgemeiner Durschnittswert',
            'TRACK_VS_PUBLIC_Y_AXIS' : 'Geschwindigkeit (km/h)',
            'SPEED' : 'Geschwindigkeit',
            'CO2' : 'CO2 Emission',
            'TRACK_VS_PUBLIC_User' : 'Fahrt',
            'TRACK_VS_PUBLIC_Public' : 'Allgemeiner Durchschnitt',
            'TRACK_VS_PUBLIC_UserAvg' : 'Dein Fahrtendurchschnitt',
            // SINGLE_TRACK_PAGE: PIECHART:
            'CALCULATED_MAF' : 'Berechnete MAF',
            'ENGINE_LOAD' : 'Motorauslastung', 
            'INTAKE_TEMPERATURE' : 'Ansaugtemperatur'
        });
        $translateProvider.preferredLanguage('de');

    }
]);
