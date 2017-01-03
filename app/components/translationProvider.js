/* The translation provider is based on the i18 internationalization
   the identifiers can be found on the left and these identifiers have to be rewritten with the corresponding translation
   for any language that is added to the translationProvider.
*/
angular.module('translations', [])
    .constant('LOCALES', {
        'locales': {
            'de_DE': 'Deutsch',
            'en_EN': 'English'
        },
        'preferredLocale': 'en_EN'
    })
    .config(['$translateProvider', function($translateProvider) {
        console.log('translation configuration set up');
        $translateProvider.translations('en', {
            // defaults:
            'WEBSITE-TITLE'         : 'EnviroCar Webapp',
            'LANGUAGE'              : 'Language',
            'CLICK_FOR_MORE_INFO'   : 'click for more information...',
            'COMMING_SOON'          : 'Coming Soon...',
            'NO_TRACKS'             : 'You have no tracks uploaded yet.',
            
            // Sidenavigation:
            'OPEN-NAV'              : 'Open Sidenav',
            'CLOSE-NAV'             : 'Close Sidenav',
            'TT_SIDENAV-OPEN'       : 'opens the sidenavigation',
            'TT_SIDENAV-CLOSE'      : 'closes the sidenavigation',
            'TT_SN_DASHBOARD_OPEN'  : 'opens the dashboard',
            'TT_SN_TRACKS_OPEN'     : 'opens the trackview',
            'TT_SN_PROFILE_OPEN'    : 'opens the profileview',
            'TT_SN_SEGMENT_OPEN'    : 'opens the communitydataview',
            'DASHBOARD'             : 'Dashboard',
            'TRACKS'                : 'Tracks',
            'TABLE'                 : 'Profile',
            'COMMUNITY'             : 'Community data',
            'SITE_FEEDBACK'         : 'Site feedback',
            'SITE_IMPRINT'          : 'Imprint',
            'SITE_TERMS'            : 'Terms',
            
            // Login:
            'USERNAME'  : 'Username',
            'PASSWORD'  : 'Password',
            'REGISTER'  : 'Register',
            'LOGIN'     : 'Login',
            'FORGOT_PASSWORD'   : 'forgot password?',
            'INVALID_LOGIN'     : 'Invalid user credentials.',
            
            // Dashboard:
            'FRIENDS'               : 'Friends',
            'DISTANCE'              : 'Distance',
            'GROUPS'                : 'Groups',
            'TT_DB_TRACKS'          : 'amount of your tracks',
            'TT_DB_FRIENDS'         : 'amount of your friends',
            'TT_DB_DISTANCE'        : 'your total distance',
            'TT_DB_GROUPS'          : 'number of enviroCar community groups, you are in',
            'TT_DB_TOTAL_USERS'     : 'number of enviroCar users',
            'TT_DB_TOTAL_TRACKS'    : 'number of enviroCar tracks',
            'TT_DB_TOTAL_DISTANCE'  : 'total distance driven by all community members',
            'TOTAL_USERS'           : 'Users',
            'TOTAL_TRACKS'          : 'Tracks',
            'TOTAL_DISTANCE'        : 'Total Distance',
                
            // Phenomenon:
            'ENGINE_LOAD'               : 'Engine load',
            'SPEED'                     : 'Speed',
            'RPM'                       : 'Rounds per minute',
            'CO2'                       : 'CO2 emissions',
            'CONSUMPTION'               : ' Consumption',
            'CO2_EMISSION'              : 'CO2 emissions',
            
            // Dashboard - ComparisonChart:
            'COMPARISON_CHART_TITLE'    : 'You compared to the enviroCar community',
            'LABEL_USER'                : 'You',
            'LABEL_PUBLIC'              : 'enviroCar Ø',
            'TT_LABEL_USER'             : 'Your average',
            'TT_LABEL_PUBLIC'           : 'enviroCar community average',
            'COMPARISON_CHART_DESCRIPTION'  : 'Your statistic averages compared to the enviroCar community\'s statistic averages.',
            
            // Dashboard - LatestTracksChart:
            'TITLE_TRACKS'                      :   'Latest tracks',
            'LATEST_TRACKS_CHART_DESCRIPTION'   :   'Your latest six tracks are listed here. You can see a summary of the driven distance, your used vehicle, and the duration of the track. Hover over a track to see a map preview of the track. Click on a track to get redirect to the single track analysis page.',
            
            // Dashboard - Heatmap:
            'TITLE_HEATMAP'         : 'Your footprints',
            'HEATMAP_DESCRIPTION'   : 'This map shows where you\'ve been driving.',
            
            // Dashboard - SpeedZoneChart:
            'SPEED_ZONES'                   : 'Speedzones',
            'SPEEDZONES_CHART_TITLE'        : 'Your speed zones',
            'SPEEDZONES_CHART_DESCRIPTION'  : 'There are three speed zones defined as \'slower than 60km/h\',\'between 60 and 130km/h\', and \'above 130km/h\'. How much time did you spend in each of these speed zones and which distances did you cover?',
            'SPEEDZONES_DESC_SHORT'         : 'Your duration and distance above 130km/h, below 60km/h and in-between.',
            'HIGH_SPEED_ZONE'               : 'faster than 130km/h',
            'MID_SPEED_ZONE'                : 'between 60 and 130km/h',
            'LOW_SPEED_ZONE'                : 'slower than 60km/h',
            'HOURS'                         : 'hours',
            
            
            // Dashboard - WeekdaysChart
            'WEEKDAYS_CHART_TITLE'          : 'Your weekday distribution',
            'WEEKDAYS_CHART_DESCRIPTION'    : 'Your driven distance across weekdays',
            'WEEKDAYS'                      : 'Weekdays',
            'MONDAY'        : 'Monday',
            'TUESDAY'       : 'Tuesday',
            'WEDNESDAY'     : 'Wednesday',
            'THURSDAY'      : 'Thursday',
            'FRIDAY'        : 'Friday',
            'SATURDAY'      : 'Saturday',
            'SUNDAY'        : 'Sunday',
            
            // Track Analysis - Header:
            'TRACK_ID'  : 'Track ID',
            'NAME'      : 'Name',
            'CREATED'   : 'created',
            
            // Track Analysis - Toolbar:
            'SEGMENT_ANALYSIS'  : 'Segment analysis',
            
            // Track Analysis - Leaflet:
            'TRACK_MAP_TITLE'       : 'Track map',
            'TRACK_MAP_DESCRIPTION' : 'this map visualizes the selected track. Change phenomenom or select a segment of the track in the toolbar above.',
            
            // Track Analysis - Chart:
            'TRACK_CHART_TITLE'         : 'Time series',
            'TRACK_CHART_DESCRIPTION'   : 'this chart shows the selected phenomenon from start to end of the selected track. Change phenomenon or select a segment of the track in the toolbar above.',
            
            // Track Analysis - Comparison Chart:
            'COMPARISON_TRACK_CHART_TITLE'          : 'Compared to enviroCar',
            'COMPARISON_TRACK_CHART_DESCRIPTION'    : 
                    'Your track\'s statistic averages compared to the enviroCar community\'s statstic averages.',
            'TRACK_LABEL_USER'                : 'this track',
            'TRACK_LABEL_PUBLIC'              : 'enviroCar Ø',
            'TT_TRACK_LABEL_USER'             : 'track\'s average',
            'TT_TRACK_LABEL_PUBLIC'           : 'enviroCar community average',
            
            // Track Analysis - Track Summary:
            'TRACK_SUMMARY_TITLE'       : 'Track Summary',
            'TRACK_SUMMARY_DESCRIPTION' : 'Your track\'s phenomenons summary',
            'VEHICLE_TYPE'              : 'Vehicle type',
            'START_TIME'                : 'Starttime',
            'END_TIME'                  : 'Finishtime',
            'CO2EMISSION'               : 'CO2 emission',
            'DURATION'                  : 'Duration',
            'PER_HOUR'                  : 'per hour',
            'PER_100_KM'                : 'per 100km',
            'ON_SEGMENT'                : 'on segment',
            'STOPS'                     : 'Stop-and-go\'s',
            
            // Track Analysis - Speed Ranges Chart:
            'SPEED_RANGES_CHART_TITLE'          : 'In intervals',
            'SPEED_RANGES_CHART_DESCRIPTION'    : 'How much percentages of the track did you spend in which interval? Click on one of the intervals and the map highlights all measuered values within that interval. Click again to remove the highlight.',
            
            // Tracks Page - Calendar Tab:
            'CALENDAR_OF_TRACKS_TAB'        : 'Calendar tab',
            'ALL_TRACKS_TAB'                : 'All Tracks',
            'DAILY_OVERVIEW'                : 'Daily overview',
            'MONTHLY_OVERVIEW'              : 'Monthly overview',
            'SELECTION_OVERVIEW'            : 'Selection overview',
            'CALENDAR_TITLE'                : 'Calendar of your tracks',
            'CALENDAR_DESCRIPTION'          : 'The calendar shows you the number of tracks for each day. An overview of the monthly tracks is displayd at the bottom. You can select a single day by clicking on it. You can select a range of days by clicking on the start and end day. The statistics overview at the bottom matches your selection. The pagination list on the right also matches your selection.',
            'CALENDAR_OVERVIEW_DESCRIPTION' : 'This pagination list shows all tracks of the selected day range. The tracks are ordered by upload date. You can navigate through the pages via the controls. If you click on one of the tracks, you will be moved to the single track analysis page.',
            
            // Tracks Page - All Tracks Pagination Tab:
            'ALL_TRACKS_OVERVIEW_TITLE'         : 'List of tracks',
            'ALL_TRACKS_OVERVIEW_DESCRIPTION'   : 'This pagination list shows all filtered tracks. The tracks are ordered by upload date. You can navigate through the pages via the controls on the bottom. If you click on one of the tracks, you will be moved to the single track analysis page.',
            'PAGE'          : 'Page',
            'OF'            : 'of',
            'WITH_TRACKS'   : 'with tracks',
            'FROM_TO'       : 'to',
            'SHOWING'       : 'Showing',
            
            // Tracks Page - All Tracks Pagination Tab - Filter:
            'ALL_TRACKS_FILTER_TITLE'                   : 'Filter options',
            'ALL_TRACKS_FILTER_DESCRIPTION'             : 'In this card you can set filter options for the tracks in the pagination list. You can create distance, duration, date, vehicle and location filters by clicking on the \'+Filter\'-button. The tracks in the pagination list will be automatically filtered by your filters.',
            'TT_ADD_FILTER_BUTTON'                      : 'Click to create a new filter',
            'CHANGE_FILTER_OPTION'                      : 'Edit',
            'CLICK_TO_CHANGE_FILTER_OPTION'             : 'Click to edit filter options',
            'CLICK_TO_REMOVE'                           : 'Click to remove this filter',
            'FILTER_OKAY'                               : 'Okay',
            'CLOSE_DIALOG'                              : 'Click to cancel',
            'ERROR_NEGATIVE'                            : 'You can not enter negative numbers',
            'ERROR_NO_INPUT'                            : 'You must enter at least one input. Click on the cross on the top right to cancel.',
            'BTN_ADD_FILTER'                            : 'add filter',
            
            'FILTER_DISTANCE_TITLE'                     : 'Distance filter',
            'FILTER_DISTANCE_DESCRIPTION'               : 'The distance filter filters your tracks by their length. You can specify a minimum length and/or a maximum length.',
            'FILTER_DISTANCE_HEADING'                   : 'Distance filter options',
            'FILTER_DISTANCE'                           : 'Distance',
            'DISTANCE_LONGER_THAN'                      : 'Minimum length (km)',
            'DISTANCE_SHORTER_THAN'                     : 'Maximum length (km)',
            'DISTANCE_OVERLAP_ERROR'                    : 'The maximum field must be bigger than or at least equal to the minimum field.',
            'DISTANCE_ERROR_NOINPUT'                    : 'You must specify at least one of the fields. Click on the cross on the top right to cancel.',
            'DISTANCE_CARD_MIN'                         : 'Minimum distance',
            'DISTANCE_CARD_MAX'                         : 'Maximum distance',
            
            'FILTER_DATE_TITLE'                         : 'Date filter',
            'FILTER_DATE_DESCRIPTION'                   : 'The date filter filters your tracks by their date. You can specify a minimum date and/or a maximum date.',
            'FILTER_DATE_HEADING'                       : 'Date filter options',
            'FILTER_DATE'                               : 'Date',
            'DATE_MIN_DATE'                             : 'Minimum date',
            'DATE_MAX_DATE'                             : 'Maximum date',
            'DATE_OVERLAP_ERROR'                        : 'The maximum date must be later than or at least equal to the minimum date. Click on the cross on the top right to cancel.',
            
            'FILTER_DURATION_TITLE'                     : 'Duration filter',
            'FILTER_DURATION_DESCRIPTION'               : 'The duration filter filters your tracks by their duration. You can specify a minimum duration and/or a maximum duration.',
            'FILTER_DURATION_HEADING'                   : 'Duration filter options',
            'FILTER_DURATION'                           : 'Duration',
            'DURATION_MIN'                              : 'Minimum duration (in minutes)',
            'DURATION_MAX'                              : 'Maximum duration (in minutes)',
            'DURATION_OVERLAP_ERROR'                    : 'The maximum duration must be bigger than or at least equal to the minimum duration.',
            'DURATION_CARD_MIN'                         : 'Minimum duration',
            'DURATION_CARD_MAX'                         : 'Maximum duration',
            'MINUTES'                                   : 'minutes',
            
            'FILTER_VEHICLE_TITLE'                      : 'Vehicle filter',
            'FILTER_VEHICLE_DESCRIPTION'                : 'The vehicle filter filters your tracks by their vehicle. You can specify a set of vehicles.',
            'FILTER_VEHICLE_HEADING'                    : 'Vehicle filter options',
            'FILTER_VEHICLE'                            : 'Vehicle',
            'SELECT_VEHICLES'                           : 'Select Vehicles',
            'VEHICLES'                                  : 'Vehicles',
            'ERROR_NOSELECTION'                         : 'You must select at least one vehicle. Click on the cross on the top right to remove this filter.',
            
            'FILTER_SPATIAL_TITLE'                      : 'Location filter',
            'FILTER_SPATIAL_DESCRIPTION'                : 'The location filter filters your tracks by their location. You can specify a bounding box on the map. The resulting tracks have at least one point within the bounding box.',
            'FILTER_SPATIAL_HEADING'                    : 'Location filter options',
            'FILTER_SPATIAL'                            : 'Location',
            'FILTER_SPATIAL_DESCRIPTION_SHORT_1'        : 'Select the ',
            'FILTER_SPATIAL_DESCRIPTION_SHORT_2'        : '-button to draw a rectangle.',
            'SPATIAL_INPUT_MISSING_ERROR'               : 'You must specify a bounding box before you can use this filter. Click on the X on the top right to cancel this filter.',
            'SPATIAL_SERVER_REQUEST_ERROR'              : 'The server did not respond to your selection. Please try again with another bounding box.',
            
            // Tracks Page - All Tracks Tab:
            'JAN': 'JANUARY',
            'FEB': 'FEBRUARY',
            'MAR': 'MARCH',
            'APR': 'APRIL',
            'MAY': 'MAY',
            'JUN': 'JUNE',
            'JUL': 'JULY',
            'AUG': 'AUGUST',
            'SEP': 'SEPTEMBER',
            'OCT': 'OCTOBER',
            'NOV': 'NOVEMBER',
            'DEZ': 'DECEMBER',
            
            // Profile Page - Bio expressions:
            'BIO'                   : 'Profile',
            'EMAIL'                 : 'E-mail',
            'COUNTRY'               : 'Country',
            'GENDER'                : 'Gender',
            'MODIFIED'              : 'last edit',
            'TERMS_OF_USE'          : 'Terms of Use version',
            'FIRST_NAME'            : 'First Name',
            'LAST_NAME'             : 'Last Name',
            'ENTER_DATE'            : 'Enter Date',
            'OLD_PASSWORD'          : 'Old Password',
            'NEW_PASSWORD'          : 'New Password',
            'NEW_PASSWORD_REPEAT'   : 'New Password(Repeat)',
            'DATE_OF_BIRTH'         : 'Date of Birth',
            'EDIT_PERSONAL_INFO'    : 'Edit Personal Information',
            'HINT_EDIT_PASSWORD'    : 'Leave these fields blank if you do not want to change your password.',
            'INFO_UPDATE_SUCCESS'   : 'Your details have been updated',
            'MALE'                  : 'Male',
            'FEMALE'                : 'Female',
            'BUTTON_UPDATE_PROFILE' : 'Update Profile',
            'GERMAN'                : 'German',
            'ENGLISH'               : 'English'
            
            
        });
        $translateProvider.translations('de', {
            // defaults:
            'WEBSITE-TITLE'         : 'EnviroCar Webapp',
            'LANGUAGE'              : 'Sprache',
            'CLICK_FOR_MORE_INFO'   : 'Klick für weitere Informationen...',
            'COMMING_SOON'          : 'Demnächst Verfügbar...',
            'NO_TRACKS'             : 'Du hast noch keine Fahrten hochgeladen.',
            
            // Sidenavigation:
            'OPEN-NAV'              : 'Öffne Seitenleiste',
            'CLOSE-NAV'             : 'Schließe Seitenleiste',
            'TT_SIDENAV-OPEN'       : 'öffnet die Navigation',
            'TT_SIDENAV-CLOSE'      : 'schließt die Navigation',
            'TT_SN_DASHBOARD_OPEN'  : 'öffnet das Dashboard',
            'TT_SN_TRACKS_OPEN'     : 'öffnet die Fahrtansicht',
            'TT_SN_PROFILE_OPEN'    : 'öffnet deine Profileeinstellungen',
            'TT_SN_SEGMENT_OPEN'    : 'öffnet die Communitydatenanalyse',
            'DASHBOARD'             : 'Dashboard',
            'TRACKS'                : 'Fahrten',
            'TABLE'                 : 'Profil',
            'COMMUNITY'             : 'Communitydaten',
            'SITE_FEEDBACK'         : 'Seitenfeedback',
            'SITE_IMPRINT'          : 'Impressum',
            'SITE_TERMS'            : 'Nutzungsbedingungen',
            
            // Login:
            'USERNAME': 'Benutzername',
            'PASSWORD': 'Passwort',
            'REGISTER': 'Registrieren',
            'LOGIN': 'Anmelden',
            'FORGOT_PASSWORD'   : 'Passwort vergessen?',
            'INVALID_LOGIN'     : 'Fehlerhafte Benutzerdaten.',
            
            // Dashboard:
            'FRIENDS'               : 'Freunde',
            'DISTANCE'              : 'Distanz',
            'GROUPS'                : 'Gruppen',
            'TT_DB_TRACKS'          : 'Anzahl deiner gefahrenen Fahrten',
            'TT_DB_FRIENDS'         : 'Anzahl deiner Freunde',
            'TT_DB_DISTANCE'        : 'Deine zurückgelegte Gesamtdistanz',
            'TT_DB_GROUPS'          : 'Anzahl der enviroCar Gemeinschaftsgruppen, in der du bist',
            'TT_DB_TOTAL_USERS'     : 'Anzahl an enviroCar Mitgliedern',
            'TT_DB_TOTAL_TRACKS'    : 'Anzahl an enviroCar Fahrten',
            'TT_DB_TOTAL_DISTANCE'  : 'Gesamtdistanz, die von allen enviroCar Mitgliedern gefahren wurde.',
            'TOTAL_USERS'           : 'Mitglieder',
            'TOTAL_TRACKS'          : 'Fahrten',
            'TOTAL_DISTANCE'        : 'Distanz',
            'YOU_VS_PUBLIC'         : 'Ich und enviroCar im Vergleich',
            
            // Phenomenon:
            'ENGINE_LOAD'               : 'Motorauslastung',
            'SPEED'                     : 'Geschwindigkeit',
            'RPM'                       : 'Umdrehungen',
            'CO2'                       : 'CO2 Emissionen',
            'CONSUMPTION'               : 'Treibstoffverbrauch',
            'CO2_EMISSION'              : 'CO2 Emissionen',
            
            // Dashboard - ComparisonChart:
            'COMPARISON_CHART_TITLE'    : 'Ich im Vergleich zur enviroCar Gemeinschaft',
            'LABEL_USER'                : 'Ich',
            'LABEL_PUBLIC'              : 'enviroCar Ø',
            'TT_LABEL_USER'             : 'Mein Durchschnittswert',
            'TT_LABEL_PUBLIC'           : 'enviroCar Durchschnittswert',
            'COMPARISON_CHART_DESCRIPTION'  : 'Deine Durchschnittswerte im Vergleich mit den Durchschnittswerten, die die enviroCar Gemeinschaft gesammelt hat.',
            
            // Dashboard - LatestTracksChart:
            'TITLE_TRACKS'                      :   'Neuste Fahrten',
            'LATEST_TRACKS_CHART_DESCRIPTION'   : 
                    'Deine neusten sechs Fahrten werden hier angezeigt. '+
'Dir werden das Datum, deine zurückgelegte Distanz, dein Fahrzeug sowie die Fahrtdauer angezeigt. '+
'Bewege den Mauszeiger über die Fahrt um eine Kartenvorschau zu sehen. '+
'Klicke auf die Fahrt um zur Einzelfahrtanalyseseite weitergeleitet zu werden.',
            
            // Dashboard - Heatmap:
            'TITLE_HEATMAP'         : 'Mein Einflussbereich',
            'HEATMAP_DESCRIPTION'   : 'Diese Karte zeigt dir an, wo du gefahren bist',
            
            // Dashboard - SpeedZoneChart:
            'SPEED_ZONES'   :   'Geschwindigkeitszonen',
            'SPEEDZONES_CHART_TITLE'        : 'Meine Geschwindigkeitszonen',
            'SPEEDZONES_CHART_DESCRIPTION'  : 'Es sind drei Geschwindigkeitszonen definiert als "langsamer als 60km/h", "zwischen 60 und 130km/h", und "schneller als 130km/h". Wie viel Zeit hast du in jeder Geschwindigkeitzone verbracht und welche Distanzen bist du in den Geschwindigkeiten zurückgelegt?',
            'SPEEDZONES_DESC_SHORT'         : 'Deine Zeit und Distanz über 130km/h, unter 60km/h und dazwischen.',
            'HIGH_SPEED_ZONE'               : 'schneller als 130km/h',
            'MID_SPEED_ZONE'                : 'zwischen 60 und 130km/h',
            'LOW_SPEED_ZONE'                : 'langsamer als 60km/h',
            'HOURS'                         : 'Stunden',
            
            // Dashboard - WeekdaysChart
            'WEEKDAYS_CHART_TITLE'          : 'Meine Wochentagsverteilung',
            'WEEKDAYS_CHART_DESCRIPTION'    : 'Meine zurückgelegte Distanz verteilt auf Wochentage',
            'WEEKDAYS'                      : 'Wochentage',
            'MONDAY'        : 'Montag',
            'TUESDAY'       : 'Dienstag',
            'WEDNESDAY'     : 'Mittwoch',
            'THURSDAY'      : 'Donnerstag',
            'FRIDAY'        : 'Freitag',
            'SATURDAY'      : 'Samstag',
            'SUNDAY'        : 'Sonntag',
            
            // Track Analysis - Header:
            'TRACK_ID'  : 'Fahrt ID',
            'NAME'      : 'Name',
            'CREATED'   : 'erstellt am',
            
            // Track Analysis - Toolbar:
            'SEGMENT_ANALYSIS'  : 'Segmentanalyse',
            
            // Track Analysis - Leaflet:
            'TRACK_MAP_TITLE'       : 'Fahrtkarte',
            'TRACK_MAP_DESCRIPTION' : 'Diese Karte zeigt deine gewählte Strecke. Wähle ein anderes Phänomen aus oder betrachte einen Teil der Strecke in der obigen Werkzeugleiste.',
            
            // Track Analysis - Chart:
            'TRACK_CHART_TITLE'         : 'Zeitreihendiagramm',
            'TRACK_CHART_DESCRIPTION' : 'Dieses Diagramm zeigt das ausgewählte Phänomen deiner Fahrt über eine Zeitachse an. Wähle ein anderes Phänomen aus oder betrachte einen Teil der Strecke in der obigen Werkzeugleiste.',
            
            // Track Analysis - Comparison Chart:
            'COMPARISON_TRACK_CHART_TITLE'          : 'Vergleich mit enviroCar',
            'COMPARISON_TRACK_CHART_DESCRIPTION'    : 
                    'Durchschnittswerte dieser Fahrt im Vergleich mit den Durschschnittwerten, die die enviroCar-Gemeinschaft gesammelt hat.',
            'TRACK_LABEL_USER'                : 'Meine Fahrt',
            'TRACK_LABEL_PUBLIC'              : 'enviroCar Ø',
            'TT_TRACK_LABEL_USER'             : 'Fahrtdurchschnittswert',
            'TT_TRACK_LABEL_PUBLIC'           : 'enviroCar Durchschnittswert',
            
            // Track Analysis - Track Summary:
            'TRACK_SUMMARY_TITLE'       : 'Fahrtüberblick',
            'TRACK_SUMMARY_DESCRIPTION' : 'Zusammenfassung der Daten deiner Fahrt',
            'VEHICLE_TYPE'              : 'Fahrzeugtyp',
            'START_TIME'                : 'Startzeit',
            'END_TIME'                  : 'Endzeit',
            'CO2EMISSION'               : 'CO2 Emissionen',
            'DURATION'                  : 'Fahrtdauer',
            'PER_HOUR'                  : 'pro Stunde',
            'PER_100_KM'                : 'pro 100km',
            'ON_SEGMENT'                : 'auf Segment',
            'STOPS'                     : 'Stop-and-go\'s',
            
            // Track Analysis - Speed Ranges Chart:
            'SPEED_RANGES_CHART_TITLE'          : 'In Intervallen',
            'SPEED_RANGES_CHART_DESCRIPTION'    : 'In welche Intervallen hast du welchen Anteil deiner Fahrt verbracht? Klick auf eines der Intervalle um alle Messungen innerhalb des Intervals auf der Karte hervorzuheben. Klick erneut auf das Interval um die Hervorhebung wieder zu entfernen.',
            
            // Tracks Page - Calendar Tab:
            'CALENDAR_OF_TRACKS_TAB'        : 'FahrtenKalender',
            'ALL_TRACKS_TAB'                : 'Alle Fahrten',
            'DAILY_OVERVIEW'                : 'Tagesübersicht',
            'MONTHLY_OVERVIEW'              : 'Monatsübersicht',
            'SELECTION_OVERVIEW'            : 'Übersicht ausgewählter Tage',
            'CALENDAR_TITLE'                : 'Kalendar deiner Fahrten',
            'CALENDAR_DESCRIPTION'          : 'Dieser Kalendar zeigt dir zu jedem Tag die Anzahl der Fahrten an. Unten siehst du eine Übersicht der Fahrten im Monat. Du kannst einen einzelnen Tag durch Klicken auswählen, oder ein Interval von Tagen durch Klicken auf dem Start- und End-tag auswählen. Die unten aufgeführte Statistik passt sich der Selektion an. Die Seitenliste rechts passt sich ebenfalls deiner Tagesauswahl an.',
            'CALENDAR_OVERVIEW_DESCRIPTION' : 'Diese Seitenansicht zeigt dir alle Fahrten aus dem ausgewählten Zeitraum an. Die Fahrten sind nach dem Datum des Uploads sortiert. Du kannst zwischen den Seiten navigieren. Wenn du auf eine der Fahrten klickst, gelangst du zur Einzelfahrtanalyseseite mit der ausgewählten Fahrt.',
            
            // Tracks Page - All Tracks Pagination Tab:
            'ALL_TRACKS_OVERVIEW_TITLE'         : 'Liste aller Fahrten',
            'ALL_TRACKS_OVERVIEW_DESCRIPTION'   : 'Diese Seitenansicht zeigt dir alle gefilterten Fahrten an. Die Fahrten sind nach dem Datum des Uploads sortiert. Unten kannst du zwischen den Seiten navigieren. Wenn du auf eine der Fahrten klickst, gelangst du zur Einzelfahrtanalyseseite mit der ausgewählten Fahrt.',
            'PAGE'          : 'Seite',
            'OF'            : 'von',
            'WITH_TRACKS'   : 'mit Fahrten',
            'FROM_TO'       : 'bis',
            'SHOWING'       : 'Zeige',
            
            // Tracks Page - All Tracks Pagination Tab - Filter:
            'ALL_TRACKS_FILTER_TITLE'                   : 'Filteroptionen',
            'ALL_TRACKS_FILTER_DESCRIPTION'             : 'Hier kannst du filteroptionen für die aufgelisteten Fahrten einstellen. Du kannst Filter für die gefahrene Distanz, die Fahrtdauer, das Fahrtdatum, den Fahrzeugtyp und/oder den Ort erstellen, indem du auf den \'+Filter\'-Knopf drückst. Die Fahrten in der Seitenliste passen sich den Filtereinstellungen automatisch an.',
            'TT_ADD_FILTER_BUTTON'                      : 'Klick um einen neuen Filter zu erstellen',
            'CHANGE_FILTER_OPTION'                      : 'Bearbeiten',
            'CLICK_TO_CHANGE_FILTER_OPTION'             : 'Klick um die Filteroptionen zu bearbeiten',
            'CLICK_TO_REMOVE'                           : 'Klick um diesen Filter zu entfernen',
            'FILTER_OKAY'                               : 'Okay',
            'CLOSE_DIALOG'                              : 'Klick um abzubrechen',
            'ERROR_NEGATIVE'                            : 'Keine negativen Einträge erlaubt!',
            'ERROR_NO_INPUT'                            : 'Du musst mindestens eine Eingabe machen. Klicke auf das Kreuz oben rechts um abzubrechen.',
            'BTN_ADD_FILTER'                            : 'Filter hinzufügen',
           
            'FILTER_DISTANCE_TITLE'                     : 'Distanzfilter',
            'FILTER_DISTANCE_DESCRIPTION'               : 'Der Distanzfilter filtert die Fahrten nach ihrer Länge. Du kannst eine Minimallänge und/oder eine Maximallänge angeben.',
            'FILTER_DISTANCE_HEADING'                   : 'Distanzfilteroptionen',
            'FILTER_DISTANCE'                           : 'Distanz',
            'DISTANCE_LONGER_THAN'                      : 'Mindestdistanz (km)',
            'DISTANCE_SHORTER_THAN'                     : 'Höchstldistanz (km)',
            'DISTANCE_OVERLAP_ERROR'                    : 'Das \'größer als\'-Feld muss mindestens so groß sein, wie das \'kleiner als\'-Feld',
            'DISTANCE_ERROR_NOINPUT'                    : 'Du must mindestens eine Eingabe machen. Klicke auf das Kreuz oben rechts um abzubrechen.',
            'DISTANCE_CARD_MIN'                         : 'Mindestdistanz',
            'DISTANCE_CARD_MAX'                         : 'Höchstdistanz',
            
            'FILTER_DATE_TITLE'                         : 'Datumsfilter',
            'FILTER_DATE_DESCRIPTION'                   : 'Der Datumsfilter filtert die Fahrten nach ihrem Datum. Du kannst ein Minimumdatum und/oder ein Maximumdatum angeben.',
            'FILTER_DATE_HEADING'                       : 'Datumsfilteroptionen',
            'FILTER_DATE'                               : 'Datum',
            'DATE_MIN_DATE'                             : 'Mindestdatum',
            'DATE_MAX_DATE'                             : 'Höchstdatum',
            'DATE_OVERLAP_ERROR'                        : 'Das zweite Datum muss zeitlich nach dem ersten Datum kommen. Klicke auf das Kreuz oben rechts um abzubrechen.',
            
            'FILTER_DURATION_TITLE'                     : 'Fahrtdauerfilter',
            'FILTER_DURATION_DESCRIPTION'               : 'Der Fahrtdauerfilter filtert die Fahrten nach ihrem Fahrtdauer. Du kannst eine Minimumdauer und/oder eine Maximumdauer angeben.',
            'FILTER_DURATION_HEADING'                   : 'Fahrtdauerfilteroptionen',
            'FILTER_DURATION'                           : 'Fahrtdauer',
            'DURATION_MIN'                              : 'Mindestfahrtdauer (in Minuten)',
            'DURATION_MAX'                              : 'Höchstfahrtdauer (in Minuten)',
            'DURATION_OVERLAP_ERROR'                    : 'Die Höchstfahrtdauert muss größer als oder mindestens genauso groß sein wie die Mindestfahrtdauert.',
            'DURATION_CARD_MIN'                         : 'Mindestfahrtdauer',
            'DURATION_CARD_MAX'                         : 'Höchstfahrtdauer',
            'MINUTES'                                   : 'Minuten',
            
            'FILTER_VEHICLE_TITLE'                      : 'Fahrzeugtypfilter',
            'FILTER_VEHICLE_DESCRIPTION'                : 'Der Fahrzeugtypfilter filtert die Fahrten nach ihrem Fahrzeugtyp. Du kannst für jeden deiner Fahrzeuge angeben, ob Fahrten mit diesem Fahrzeug angezeigt werden sollen.',
            'FILTER_VEHICLE_HEADING'                    : 'Fahrzeugtypfilteroptionen',
            'FILTER_VEHICLE'                            : 'Fahrzeugtyp',
            'SELECT_VEHICLES'                           : 'Wähle Fahrzeugtypen',
            'VEHICLES'                                  : 'Fahrzeuge',
            'ERROR_NOSELECTION'                         : 'Du musst mindestens ein Fahrzeugtyp auswählen. Klicke auf das Kreuz oben rechts um diesen Filter zu entfernen.',
            
            'FILTER_SPATIAL_TITLE'                      : 'Ortsfilter',
            'FILTER_SPATIAL_DESCRIPTION'                : 'Mit dem Ortsfilter kannst du auf einer Karte ein Rechteck ziehen. Der Ortsfilter filtert die Fahrten danach, ob sie Messungen innerhalb deines gezogenen Rechtsecks enthalten.',
            'FILTER_SPATIAL_HEADING'                    : 'Ortsfilteroptionen',
            'FILTER_SPATIAL'                            : 'Ort',
            'FILTER_SPATIAL_DESCRIPTION_SHORT_1'        : 'Klicke auf den ',
            'FILTER_SPATIAL_DESCRIPTION_SHORT_2'        : '-Knopf um ein Rechteck zu zeichnen.',
            'SPATIAL_INPUT_MISSING_ERROR'               : 'Du musst ein Begrenzungsrechteck eingeben bevor du diesen Filter nutzen kannst. Klicke auf das X oben rechts, um diesen Filter abzubrechen.',
            'SPATIAL_SERVER_REQUEST_ERROR'              : 'Der Server konnte die Anfrage nicht verarbeiten. Versuche es bitte mit einem anderen Begrenzungsrechteck erneut.',
            
            // Tracks Page - All Tracks Tab:
            'JAN': 'JANUAR',
            'FEB': 'FEBRUAR',
            'MAR': 'MÄRZ',
            'APR': 'APRIL',
            'MAY': 'MAI',
            'JUN': 'JUNI',
            'JUL': 'JULI',
            'AUG': 'AUGUST',
            'SEP': 'SEPTEMBER',
            'OCT': 'OKTOBER',
            'NOV': 'NOVEMBER',
            'DEZ': 'DEZEMBER',
            
            // Profile Page - Bio expressions:
            'BIO'                   : 'Profil',
            'EMAIL'                 : 'E-mail',
            'COUNTRY'               : 'Land',
            'GENDER'                : 'Geschlecht',
            'MODIFIED'              : 'geändert am',
            'TERMS_OF_USE'          : 'Version der Nutzungsregeln',
            'FIRST_NAME'            : 'Vorname',
            'LAST_NAME'             : 'Nachname',
            'ENTER_DATE'            : 'Wähle ein Datum',
            'HINT_EDIT_PASSWORD'    : 'Lasse diese Felder frei, wenn du dein Passwort nicht ändern willst.',
            'OLD_PASSWORD'          : 'Altes Passwort',
            'NEW_PASSWORD'          : 'Neues Passwort',
            'NEW_PASSWORD_REPEAT'   : 'Neues Passwort (wiederhole)',
            'INFO_UPDATE_SUCCESS'   : 'Deine Profilinformationen wurden aktualisiert.',
            'DATE_OF_BIRTH'         : 'Geburtsdatum',
            'EDIT_PERSONAL_INFO'    : 'Ändere deine persönlichen Informationen',
            'MALE'                  : 'Männlich',
            'FEMALE'                : 'Weiblich',
            'BUTTON_UPDATE_PROFILE' : 'Aktualisiere Profil',
            'GERMAN'                : 'Deutsch',
            'ENGLISH'               : 'Englisch'
            
        });
        $translateProvider.preferredLanguage('en');

    }
]);
