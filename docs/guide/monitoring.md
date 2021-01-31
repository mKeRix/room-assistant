# Monitoring

Since room-assistant is a distributed system it quickly gets difficult to keep track of everything. To help we provide some tools for power users that wish to keep track of all their instance states without having to go to each one manually.

## Metrics

room-assistant provides metrics in the Prometheus format on port `6415`, path `/metrics`. This includes some default metrics about the general state of the application, as well as integration-specific metrics that you can explore. You can setup your Prometheus instance to scrape these endpoints like this:

```yaml
scrape_configs:
  - job_name: 'room-assistant'
    metrics_path: '/metrics'
    scrape_interval: 30s
    static_configs:
      - targets:
      		- '<room-assistant-ip1>:6415'
      		- '<room-assistant-ip2>:6415'
```

## Logging

**Config Key:** `logger`

If you want to capture the logs of all your instances in a single place you can configure additional log outputs, which will be used alongside the console output you are used to.

### Elasticsearch/Kibana

**Config Key:** `elasticsearch`

room-assistant is capable of piping log output into an Elasticsearch cluster with the logstash format, which makes it searchable from Kibana.

| Name          | Type    | Default               | Description                                                  |
| ------------- | ------- | --------------------- | ------------------------------------------------------------ |
| `enabled`     | Boolean | `false`               | Whether room-assistant should send logs to Elasticsearch or not. |
| `node`        | String  | http://localhost:9200 | The endpoint under which your Elasticsearch cluster is accessible. |
| `auth`        | Object  |                       | Object containing either `username` + `password` or `apiKey` that should be used for authenticating against your Elasticsearch cluster (matches `auth` in the [official client docs](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/client-configuration.html)). |
| `indexPrefix` | String  | `room-assistant`      | The prefix of the indices that will be created. The indices follow the naming format `<indexPrefix>-<date>`. |

::: details Example Config

```yaml
logger:
    elasticsearch:
        enabled: true
        node: http://192.168.0.20:9200
```

:::

