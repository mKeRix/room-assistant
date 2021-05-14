(window.webpackJsonp=window.webpackJsonp||[]).push([[20],{392:function(t,a,s){"use strict";s.r(a);var e=s(49),n=Object(e.a)({},(function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"monitoring"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#monitoring"}},[t._v("#")]),t._v(" Monitoring")]),t._v(" "),s("p",[t._v("Since room-assistant is a distributed system it quickly gets difficult to keep track of everything. To help we provide some tools for power users that wish to keep track of all their instance states without having to go to each one manually.")]),t._v(" "),s("h2",{attrs:{id:"metrics"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#metrics"}},[t._v("#")]),t._v(" Metrics")]),t._v(" "),s("p",[t._v("room-assistant provides metrics in the Prometheus format on port "),s("code",[t._v("6415")]),t._v(", path "),s("code",[t._v("/metrics")]),t._v(". This includes some default metrics about the general state of the application, as well as integration-specific metrics that you can explore. You can setup your Prometheus instance to scrape these endpoints like this:")]),t._v(" "),s("div",{staticClass:"language-yaml extra-class"},[s("pre",{pre:!0,attrs:{class:"language-yaml"}},[s("code",[s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("scrape_configs")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("job_name")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'room-assistant'")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("metrics_path")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'/metrics'")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("scrape_interval")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" 30s\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("static_configs")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("targets")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n      \t\t"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'<room-assistant-ip1>:6415'")]),t._v("\n      \t\t"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'<room-assistant-ip2>:6415'")]),t._v("\n")])])]),s("h2",{attrs:{id:"logging"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#logging"}},[t._v("#")]),t._v(" Logging")]),t._v(" "),s("p",[s("strong",[t._v("Config Key:")]),t._v(" "),s("code",[t._v("logger")])]),t._v(" "),s("p",[t._v("If you want to capture the logs of all your instances in a single place you can configure additional log outputs, which will be used alongside the console output you are used to.")]),t._v(" "),s("h3",{attrs:{id:"elasticsearch-kibana"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#elasticsearch-kibana"}},[t._v("#")]),t._v(" Elasticsearch/Kibana")]),t._v(" "),s("p",[s("strong",[t._v("Config Key:")]),t._v(" "),s("code",[t._v("elasticsearch")])]),t._v(" "),s("p",[t._v("room-assistant is capable of piping log output into an Elasticsearch cluster with the logstash format, which makes it searchable from Kibana. On NodeJS installations this logger requires an additional dependency, which you can install with "),s("code",[t._v("npm install -g winston-elasticsearch")]),t._v(".")]),t._v(" "),s("table",[s("thead",[s("tr",[s("th",[t._v("Name")]),t._v(" "),s("th",[t._v("Type")]),t._v(" "),s("th",[t._v("Default")]),t._v(" "),s("th",[t._v("Description")])])]),t._v(" "),s("tbody",[s("tr",[s("td",[s("code",[t._v("enabled")])]),t._v(" "),s("td",[t._v("Boolean")]),t._v(" "),s("td",[s("code",[t._v("false")])]),t._v(" "),s("td",[t._v("Whether room-assistant should send logs to Elasticsearch or not.")])]),t._v(" "),s("tr",[s("td",[s("code",[t._v("node")])]),t._v(" "),s("td",[t._v("String")]),t._v(" "),s("td",[t._v("http://localhost:9200")]),t._v(" "),s("td",[t._v("The endpoint under which your Elasticsearch cluster is accessible.")])]),t._v(" "),s("tr",[s("td",[s("code",[t._v("auth")])]),t._v(" "),s("td",[t._v("Object")]),t._v(" "),s("td"),t._v(" "),s("td",[t._v("Object containing either "),s("code",[t._v("username")]),t._v(" + "),s("code",[t._v("password")]),t._v(" or "),s("code",[t._v("apiKey")]),t._v(" that should be used for authenticating against your Elasticsearch cluster (matches "),s("code",[t._v("auth")]),t._v(" in the "),s("a",{attrs:{href:"https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/client-configuration.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("official client docs"),s("OutboundLink")],1),t._v(").")])]),t._v(" "),s("tr",[s("td",[s("code",[t._v("indexPrefix")])]),t._v(" "),s("td",[t._v("String")]),t._v(" "),s("td",[s("code",[t._v("room-assistant")])]),t._v(" "),s("td",[t._v("The prefix of the indices that will be created. The indices follow the naming format "),s("code",[t._v("<indexPrefix>-<date>")]),t._v(".")])])])]),t._v(" "),s("details",{staticClass:"custom-block details"},[s("summary",[t._v("Example Config")]),t._v(" "),s("div",{staticClass:"language-yaml extra-class"},[s("pre",{pre:!0,attrs:{class:"language-yaml"}},[s("code",[s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("logger")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("elasticsearch")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("enabled")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean important"}},[t._v("true")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("node")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" http"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("//192.168.0.20"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("9200")]),t._v("\n")])])])]),t._v(" "),s("h3",{attrs:{id:"loki"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#loki"}},[t._v("#")]),t._v(" Loki")]),t._v(" "),s("p",[s("strong",[t._v("Config Key:")]),t._v(" "),s("code",[t._v("loki")])]),t._v(" "),s("p",[t._v("You can send the room-assistant logs to an instance of "),s("a",{attrs:{href:"https://grafana.com/oss/loki/",target:"_blank",rel:"noopener noreferrer"}},[t._v("Grafana Loki"),s("OutboundLink")],1),t._v(", which will allow you to collect and query logs easily from "),s("a",{attrs:{href:"https://grafana.com/grafana/",target:"_blank",rel:"noopener noreferrer"}},[t._v("Grafana"),s("OutboundLink")],1),t._v(". On NodeJS installations this logger requires an additional dependency, which you can install with "),s("code",[t._v("npm install -g winston-loki")]),t._v(".")]),t._v(" "),s("table",[s("thead",[s("tr",[s("th",[t._v("Name")]),t._v(" "),s("th",[t._v("Type")]),t._v(" "),s("th",[t._v("Default")]),t._v(" "),s("th",[t._v("Description")])])]),t._v(" "),s("tbody",[s("tr",[s("td",[s("code",[t._v("enabled")])]),t._v(" "),s("td",[t._v("Boolean")]),t._v(" "),s("td",[s("code",[t._v("false")])]),t._v(" "),s("td",[t._v("Whether room-assistant should send logs to Loki or not.")])]),t._v(" "),s("tr",[s("td",[s("code",[t._v("host")])]),t._v(" "),s("td",[t._v("String")]),t._v(" "),s("td",[t._v("http://localhost:3100")]),t._v(" "),s("td",[t._v("The endpoint of your Loki instance.")])])])]),t._v(" "),s("details",{staticClass:"custom-block details"},[s("summary",[t._v("Example Config")]),t._v(" "),s("div",{staticClass:"language-yaml extra-class"},[s("pre",{pre:!0,attrs:{class:"language-yaml"}},[s("code",[s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("logger")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("loki")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("enabled")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean important"}},[t._v("true")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("host")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" http"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("//192.168.0.20"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("3100")]),t._v("\n")])])])])])}),[],!1,null,null,null);a.default=n.exports}}]);