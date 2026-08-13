# Simple Bluetooth Battery

A minimal GNOME Shell extension that shows the battery percentage of your connected Bluetooth device (headphones, mouse, keyboard, etc.) directly in the top bar — no need to dig through Settings → Power.

It reads battery data straight from BlueZ over D-Bus. No external dependencies, no third-party code, no config files.

## Features

- Shows connected Bluetooth device name and battery percentage in the top bar
- Refreshes automatically every 30 seconds
- Automatically hides itself when no battery-reporting device is connected
- Just two files: `extension.js` and `metadata.json`

## Requirements

- GNOME Shell 45 or newer
- A Bluetooth device that reports battery level over BlueZ's `org.bluez.Battery1` interface (most modern headphones and peripherals support this — if your device's battery already shows up under Settings → Power, it will work here too)
- `curl` (preinstalled on virtually all Ubuntu systems)

## Installation

One command, no `git` required:

```bash
curl -fsSL https://raw.githubusercontent.com/Noname12219112/bt-battery-gnome-extension/master/install.sh | bash
```

Then reload GNOME Shell:
- **X11**: press `Alt+F2`, type `r`, press `Enter`
- **Wayland**: log out and log back in

### Manual installation

If you'd rather install by hand:

```bash
mkdir -p ~/.local/share/gnome-shell/extensions/bt-battery@local.dev
curl -fsSL https://raw.githubusercontent.com/Noname12219112/bt-battery-gnome-extension/master/extension.js -o ~/.local/share/gnome-shell/extensions/bt-battery@local.dev/extension.js
curl -fsSL https://raw.githubusercontent.com/Noname12219112/bt-battery-gnome-extension/master/metadata.json -o ~/.local/share/gnome-shell/extensions/bt-battery@local.dev/metadata.json
gnome-extensions enable bt-battery@local.dev
```

## Updating for newer GNOME Shell versions

If a new GNOME major version marks this extension as "OUT OF DATE," add the new version number to the `shell-version` array in `metadata.json`, or disable the version check entirely:

```bash
gsettings set org.gnome.shell disable-extension-version-validation true
```

## Uninstalling

```bash
gnome-extensions disable bt-battery@local.dev
rm -rf ~/.local/share/gnome-shell/extensions/bt-battery@local.dev
```
How it works

The extension calls BlueZ's GetManagedObjects over the system D-Bus every 30 seconds. For each connected device that exposes an org.bluez.Battery1 interface, it reads the Percentage property and displays it alongside the device name in the top bar.

License

Free to use, modify, and share.
