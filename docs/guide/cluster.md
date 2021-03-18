# Cluster

**Config Key:** `cluster`

If you are running multiple room-assistant instances they come together in a cluster. By default, the instances discover each other using mDNS. This requires all of them live in the same subnet. You can also specify the adresses of other instances and tweak some other things manually.

## Usage tips

### Preferred leaders

In some situations you may want some instances of room-assistant to be the leading ones more than others. This could for example be the case if you have instances that are connected to the network better than others. To accomplish this you can configure custom weights that are then used during the leader election process. The `weight` option should ideally be configured on every instance of room-assistant that you run to achieve consistent behavior. The preferred leader instances need to have the largest weight numbers.

## Troubleshooting

### Some nodes not appearing

If the auto discovery does not seem to pick up all (or any) nodes for your cluster you can approach the problem from two different directions:

1. Make sure your router and network settings are compatible with mDNS/Bonjour. An easy way to test this is pinging your devices by their hostname, e.g. `ping raspberrypi.local`.
2. Disable `autoDiscovery` and provide the `peerAddresses` manually. Make sure to give your devices DHCP reservations or static IPs.

Should the other nodes not appear in your cluster even after configuring it manually you should make sure that the devices can communication with each other via UDP on the port you configured, by default `6425`.

### MDNS errors

If you're seeing errors relating to MDNS discovery in your logs there is no need to worry - room-assistant will function fine even without it. In this case you can just specify the `peerAddresses` of your other room-assistant instances manually.

If you want to fix the discovery issues you need to take a look at [Avahi](http://avahi.org) on Linux or the equivalent Bonjour responder on other operating systems. It needs to be installed and available to room-assistant.

As for Docker, the auto discovery will only work if you're running the container on a Linux machine and have mapped the `/var/run/dbus` volume.

### getaddrinfo errors

This error correlates to your machine not being able to resolve `.local` hostnames correctly. On Linux systems you need to have [nss-mdns](http://0pointer.de/lennart/projects/nss-mdns/) installed and configured for this to work. Alternatively you can use the `--digResolver` CLI option when starting room-assistant to use the `dig` command for resolving hostnames.

### Rivalling clusters

If you're seeing multiple clusters form on your network that are both trying to take control of the distributed entities you can set the `quorum` option. This ensures that only a cluster that contains the majority of instances can update the values. Set this number so that it represents the smallest instance count to constitute a majority in your setup. For example: if you have 3 instances of the software at home you would set `quorum` to 2, for 6 overall instances it should be 4.

## Settings

| Name               | Type    | Default | Description                                                  |
| ------------------ | ------- | ------- | ------------------------------------------------------------ |
| `networkInterface` | String  |         | The specific network interface that room-assistant should advertise its presence on, e.g. `eth0`. |
| `port`             | Number  | `6425`  | The UDP port that room-assistant should use for internal communication. |
| `timeout`          | Number  | `60`    | Number of seconds that an instance can go without sending a heartbeat and not be dropped from the cluster. |
| `weight`           | Number  | Random  | Value used to sort when electing a leading instance. The instance with the highest weight in the cluster becomes the leader. |
| `quorum`           | Number  |         | Minimum amount of nodes required for the cluster to represent the majority. |
| `autoDiscovery`    | Boolean | `true`  | Allows mDNS-based auto discovery of other room-assistant instances to be turned off. |
| `peerAddresses`    | Array   |         | A list of endpoint addresses (IP + port) of other room-assistant instances. |

::: details Example Config

```yaml
cluster:
  port: 6425
  peerAddresses:
    - 192.168.1.10:6425
    - 192.168.1.11:6425
```

:::

