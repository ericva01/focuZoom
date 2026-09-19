!macro NSIS_HOOK_POSTINSTALL
  DetailPrint "Ensuring WebView2Loader.dll is located in app root..."
  IfFileExists "$INSTDIR\resources\WebView2Loader.dll" 0 +3
    CopyFiles /SILENT "$INSTDIR\resources\WebView2Loader.dll" "$INSTDIR\WebView2Loader.dll"
    Goto done_wv2
  IfFileExists "$INSTDIR\_up_\WebView2Loader.dll" 0 +3
    CopyFiles /SILENT "$INSTDIR\_up_\WebView2Loader.dll" "$INSTDIR\WebView2Loader.dll"
    Goto done_wv2
  done_wv2:
!macroend

!macro NSIS_HOOK_PREUNINSTALL
  Delete "$INSTDIR\WebView2Loader.dll"
!macroend
