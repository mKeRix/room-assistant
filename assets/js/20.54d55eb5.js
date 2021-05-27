(window.webpackJsonp=window.webpackJsonp||[]).push([[20],{391:function(t,e,a){"use strict";a.r(e);var s=a(49),n=Object(s.a)({},(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"entities"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#entities"}},[t._v("#")]),t._v(" Entities")]),t._v(" "),a("p",[a("strong",[t._v("Config Key:")]),t._v(" "),a("code",[t._v("entities")])]),t._v(" "),a("p",[t._v("Each entity that room-assistant exposes is managed by a central registry and has a locally unique ID. You can apply some configuration options to any entity to modify the behavior.")]),t._v(" "),a("h2",{attrs:{id:"settings"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#settings"}},[t._v("#")]),t._v(" Settings")]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",[t._v("Name")]),t._v(" "),a("th",[t._v("Type")]),t._v(" "),a("th",[t._v("Default")]),t._v(" "),a("th",[t._v("Description")])])]),t._v(" "),a("tbody",[a("tr",[a("td",[a("code",[t._v("behaviors")])]),t._v(" "),a("td",[a("a",{attrs:{href:"#behaviors"}},[t._v("Behaviors")])]),t._v(" "),a("td"),t._v(" "),a("td",[t._v("Options that modify the behavior of the entities.")])])])]),t._v(" "),a("h3",{attrs:{id:"behaviors"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#behaviors"}},[t._v("#")]),t._v(" Behaviors")]),t._v(" "),a("p",[t._v("Behaviors may be set per entity ID, with the ID being the key and an object with some of the properties below as value in the configuration map.")]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",[t._v("Name")]),t._v(" "),a("th",[t._v("Type")]),t._v(" "),a("th",[t._v("Default")]),t._v(" "),a("th",[t._v("Description")])])]),t._v(" "),a("tbody",[a("tr",[a("td",[a("code",[t._v("debounce")])]),t._v(" "),a("td",[a("a",{attrs:{href:"#debounce"}},[t._v("Debounce")])]),t._v(" "),a("td"),t._v(" "),a("td",[t._v("Allows you to debounce state updates for entities.")])]),t._v(" "),a("tr",[a("td",[a("code",[t._v("rollingAverage")])]),t._v(" "),a("td",[a("a",{attrs:{href:"#rolling-average"}},[t._v("Rolling Average")])]),t._v(" "),a("td"),t._v(" "),a("td",[t._v("Makes sensors output the average value based on a sliding window.")])])])]),t._v(" "),a("h4",{attrs:{id:"debounce"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#debounce"}},[t._v("#")]),t._v(" Debounce")]),t._v(" "),a("p",[t._v("Debouncing is especially helpful for sensors that jump states quickly in an incorrect manner. This could for example be the case for some GPIO sensors or thermopiles. This behavior is based on the "),a("a",{attrs:{href:"https://lodash.com/docs/#debounce",target:"_blank",rel:"noopener noreferrer"}},[t._v("Lodash debounce implementation"),a("OutboundLink")],1),t._v(" and the options will therefore behave the same.")]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",[t._v("Name")]),t._v(" "),a("th",[t._v("Type")]),t._v(" "),a("th",[t._v("Default")]),t._v(" "),a("th",[t._v("Description")])])]),t._v(" "),a("tbody",[a("tr",[a("td",[a("code",[t._v("wait")])]),t._v(" "),a("td",[t._v("Number")]),t._v(" "),a("td"),t._v(" "),a("td",[t._v("Number of seconds to wait after the last time the state was updated before publishing it to integrations.")])]),t._v(" "),a("tr",[a("td",[a("code",[t._v("maxWait")])]),t._v(" "),a("td",[t._v("Number")]),t._v(" "),a("td"),t._v(" "),a("td",[t._v("Maximum number of seconds that a state update may be delayed. If left undefined there will be no limit.")])]),t._v(" "),a("tr",[a("td",[a("code",[t._v("leading")])]),t._v(" "),a("td",[t._v("Boolean")]),t._v(" "),a("td",[a("code",[t._v("false")])]),t._v(" "),a("td",[t._v("Invoke the update on the leading edge of the timeout.")])]),t._v(" "),a("tr",[a("td",[a("code",[t._v("trailing")])]),t._v(" "),a("td",[t._v("Boolean")]),t._v(" "),a("td",[a("code",[t._v("true")])]),t._v(" "),a("td",[t._v("Invoke the update on the trailing edge of the timeout.")])])])]),t._v(" "),a("details",{staticClass:"custom-block details"},[a("summary",[t._v("Example Config")]),t._v(" "),a("div",{staticClass:"language-yaml extra-class"},[a("pre",{pre:!0,attrs:{class:"language-yaml"}},[a("code",[a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("entities")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("behaviors")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("d6t_occupancy_count")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("debounce")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("wait")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("0.75")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("maxWait")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("2")]),t._v("\n")])])])]),t._v(" "),a("h4",{attrs:{id:"rolling-average"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#rolling-average"}},[t._v("#")]),t._v(" Rolling Average")]),t._v(" "),a("p",[t._v("This behavior is useful for when you have a sensor that on average has the correct value, but sometimes changes to wrong states. It will make the sensor output the average value that it has seen over the window period that you configured. Depending on the state type the average calculation behaves differently:")]),t._v(" "),a("ul",[a("li",[t._v("For numeric states, the weighted average of all values seen in the window period will be calculated.")]),t._v(" "),a("li",[t._v("For other states, the state that the original sensor spent the longest time in over the last "),a("code",[t._v("window")]),t._v(" seconds will be chosen as the output.")])]),t._v(" "),a("p",[t._v("The state itself is updated every second.")]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",[t._v("Name")]),t._v(" "),a("th",[t._v("Type")]),t._v(" "),a("th",[t._v("Default")]),t._v(" "),a("th",[t._v("Description")])])]),t._v(" "),a("tbody",[a("tr",[a("td",[a("code",[t._v("window")])]),t._v(" "),a("td",[t._v("Number")]),t._v(" "),a("td"),t._v(" "),a("td",[t._v("Number of seconds to look back for when calculating the average state.")])])])]),t._v(" "),a("details",{staticClass:"custom-block details"},[a("summary",[t._v("Example Config")]),t._v(" "),a("div",{staticClass:"language-yaml extra-class"},[a("pre",{pre:!0,attrs:{class:"language-yaml"}},[a("code",[a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("entities")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("behaviors")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("bluetooth-classic-xx-tracker")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("rollingAverage")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("window")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("300")]),t._v("\n")])])])])])}),[],!1,null,null,null);e.default=n.exports}}]);