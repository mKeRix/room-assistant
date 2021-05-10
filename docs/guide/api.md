# API

::: warning

The API is still a work in progress and some features are missing. The existing endpoints will stay compatible within the same major version though.

:::

Each instance of room-assistant exposes an HTTP API that you can use for debugging or connecting it to different services. The API is accessible under port `6415` by default.

The API is documented with an OpenAPI schema that you can retrieve under `/api-json`. For a visual representation navigate to `/api`. You can make all available API calls directly in your browser from this page.

## WebSocket API

room-assistant also offers a websocket interface, which you can use to subscribe to entity updates. It is hosted on the same port as the HTTP API. To subscribe to updates you can send the following request to the socket:

```json
{
  "event": "subscribeEvents",
  "data": {
    "type": "entityUpdates"
  }
}
```

This will give you a stream of all entity updates in the same format as the [MQTT integration](../integrations/mqtt.md#message-format) provides.