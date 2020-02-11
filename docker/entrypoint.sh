echo "Starting DBUS daemon..."
dbus-uuidgen > /var/lib/dbus/machine-id
dbus-daemon --config-file=/usr/share/dbus-1/system.conf

echo "Starting supervisor..."
exec supervisord -c /etc/supervisord.conf
