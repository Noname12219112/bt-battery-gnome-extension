import GObject from 'gi://GObject';
import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import St from 'gi://St';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

const REFRESH_SECONDS = 30;

const Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, 'Bluetooth Battery', false);

        this._label = new St.Label({
            text: '',
            y_align: Clutter.ActorAlign.CENTER,
            style_class: 'bt-battery-label',
        });
        this.add_child(this._label);

        this._refresh();
        this._timeoutId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, REFRESH_SECONDS, () => {
            this._refresh();
            return GLib.SOURCE_CONTINUE;
        });
    }

    _refresh() {
        try {
            const result = Gio.DBus.system.call_sync(
                'org.bluez',
                '/',
                'org.freedesktop.DBus.ObjectManager',
                'GetManagedObjects',
                null,
                null,
                Gio.DBusCallFlags.NONE,
                -1,
                null
            );

            const [objects] = result.deep_unpack();
            const parts = [];

            for (const path in objects) {
                const interfaces = objects[path];
                const device = interfaces['org.bluez.Device1'];
                const battery = interfaces['org.bluez.Battery1'];

                if (device && battery) {
                    const connected = device['Connected']
                        ? device['Connected'].deep_unpack() : false;

                    if (connected) {
                        const name = device['Name']
                            ? device['Name'].deep_unpack() : 'Device';
                        const pct = battery['Percentage']
                            ? battery['Percentage'].deep_unpack() : null;

                        if (pct !== null)
                            parts.push(`${name} ${pct}%`);
                    }
                }
            }

            if (parts.length > 0) {
                this._label.set_text(parts.join('  |  '));
                this.visible = true;
            } else {
                this.visible = false;
            }
        } catch (e) {
            logError(e, 'Bluetooth Battery Indicator: refresh failed');
            this.visible = false;
        }
    }

    destroy() {
        if (this._timeoutId) {
            GLib.source_remove(this._timeoutId);
            this._timeoutId = null;
        }
        super.destroy();
    }
});

export default class BluetoothBatteryExtension extends Extension {
    enable() {
        this._indicator = new Indicator();
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }

    disable() {
        this._indicator?.destroy();
        this._indicator = null;
    }
}
