# Cluster

**Config Key:** `cluster`

If you are running multiple room-assistant instances they come together in a cluster. By default, the instances discover each other using mDNS. This requires all of them live in the same subnet. You can also specify the adresses of other instances and tweak some other things manually.

## Preferred leaders

In some situations you may want some instances of room-assistant to be the leading ones more than others. This could for example be the case if you have instances that are connected to the network better than others. To accomplish this you can configure custom weights that are then used during the leader election process. The `weight` option should ideally be configured on every instance of room-assistant that you run to achieve consistent behavior. The preferred leader instances need to have the largest weight numbers.

## Settings

| Name               | Type   | Default | Description                                                  |
| ------------------ | ------ | ------- | ------------------------------------------------------------ |
| `networkInterface` | String |         | The specific network interface that room-assistant should advertise its presence on, e.g. `eth0`. |
| `port`             | Number | `6425`  | The UDP port that room-assistant should use for internal communication. |
| `timeout`          | Number | `60`    | Number of seconds that an instance can go without sending a heartbeat and not be dropped from the cluster. |
| `weight`           | Number | Random  | Value used to sort when electing a leading instance. The instance with the highest weight in the cluster becomes the leader. |
| `peerAddresses`    | Array  |         | A list of endpoint addresses (IP + port) of other room-assistant instances. |

::: details Example Config

```yaml
cluster:
  networkInterface: wlan0
  port: 6425
  peerAddresses:
    - 192.168.1.10:6425
    - 192.168.1.11:6425
```

:::

