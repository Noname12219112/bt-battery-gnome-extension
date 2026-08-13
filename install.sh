#!/usr/bin/env bash
set -e

UUID="bt-battery@local.dev"
DEST="$HOME/.local/share/gnome-shell/extensions/$UUID"
RAW_BASE="https://raw.githubusercontent.com/Noname12219112/bt-battery-gnome-extension/master"

echo "Creating extension folder at $DEST ..."
mkdir -p "$DEST"

echo "Downloading files ..."
curl -fsSL "$RAW_BASE/extension.js" -o "$DEST/extension.js"
curl -fsSL "$RAW_BASE/metadata.json" -o "$DEST/metadata.json"

echo "Enabling extension ..."
gnome-extensions enable "$UUID" || {
    echo "Could not enable automatically (this can happen if the shell hasn't seen the new folder yet)."
    echo "Log out and back in, then run: gnome-extensions enable $UUID"
    exit 0
}

echo ""
echo "Done. Files are in: $DEST"
echo "Now reload GNOME Shell:"
echo "  X11:    press Alt+F2, type r, press Enter"
echo "  Wayland: log out and log back in"
echo "Then check the top bar for your connected Bluetooth device's battery."
