# Simple Bluetooth Battery

A minimal GNOME Shell extension that shows the battery percentage of your connected Bluetooth device (headphones, mouse, keyboard, etc.) directly in the top bar — no need to dig through Settings → Power.

It reads battery data straight from BlueZ over D-Bus, so there are no external dependencies and no third-party code.

## Features

- Shows connected Bluetooth device name and battery percentage in the top bar
- Refreshes automatically every 30 seconds
- Automatically hides itself when no battery-reporting device is connected
- No configuration needed, no extra packages required

## Requirements

- GNOME Shell 45 or newer
- A Bluetooth device that reports battery level over BlueZ's `org.bluez.Battery1` interface (most modern headphones and peripherals support this — if your device's battery shows up under Settings → Power, it will work here too)

## Installation

```bash
git clone https://github.com/YOUR-USERNAME/bt-battery-gnome-extension.git ~/.local/share/gnome-shell/extensions/bt-battery@local.dev
gnome-extensions enable bt-battery@local.dev
```

Then reload GNOME Shell:
- **X11**: press `Alt+F2`, type `r`, press `Enter`
- **Wayland**: log out and log back in

## Updating for newer GNOME Shell versions

If a new GNOME major version marks this extension as "OUT OF DATE," add the new version number to the `shell-version` array in `metadata.json`, or disable the version check entirely:

```bash
gsettings set org.gnome.shell disable-extension-version-validation true
```

## How it works

The extension calls BlueZ's `GetManagedObjects` over the system D-Bus every 30 seconds. For each connected device that exposes an `org.bluez.Battery1` interface, it reads the `Percentage` property and displays it alongside the device name in the top bar.

## License

Free to use, modify, and share.
