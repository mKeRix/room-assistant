import{r as o,o as a,c as r,a as t,b as n,F as i,e,d as l}from"./app.71086382.js";import{_ as d}from"./plugin-vue_export-helper.21dcd24c.js";const c={},u=t("h1",{id:"home-assistant-core",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#home-assistant-core","aria-hidden":"true"},"#"),e(" Home Assistant Core")],-1),h=t("p",null,[t("strong",null,"Integration Key:"),e(),t("code",null,"homeAssistant")],-1),p=e("The "),_={href:"https://www.home-assistant.io",target:"_blank",rel:"noopener noreferrer"},m=e("Home Assistant Core"),f=e(" integration shares data with the home automation software over "),b={href:"https://www.home-assistant.io/integrations/mqtt/",target:"_blank",rel:"noopener noreferrer"},g=e("MQTT"),T=e("."),k=t("h2",{id:"requirements",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#requirements","aria-hidden":"true"},"#"),e(" Requirements")],-1),y=t("div",{class:"custom-container tip"},[t("p",{class:"custom-container-title"},"TIP"),t("p",null,[t("strong",null,"Running on Home Assistant OS?"),e(" If you are also using the MQTT server add-on room-assistant will automatically pick up the correct credentials - no configuration needed!")])],-1),w=e("You will need to setup an MQTT broker that both your instance of Home Assistant Core and all instances of room-assistant can connect to. If you are using Home Assistant OS you can install the "),A={href:"https://github.com/home-assistant/hassio-addons/tree/master/mosquitto",target:"_blank",rel:"noopener noreferrer"},S=e("official mosquitto add-on"),q=e(" to get started quickly."),M=e("room-assistant makes use of the "),v={href:"https://www.home-assistant.io/docs/mqtt/discovery/",target:"_blank",rel:"noopener noreferrer"},x=e("MQTT auto discovery"),Q=e(" features provided by Home Assistant Core to automatically create all entities for you. It is strongly recommended that you enable this feature when setting up the MQTT integration in Home Assistant Core."),H=t("h2",{id:"settings",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#settings","aria-hidden":"true"},"#"),e(" Settings")],-1),R=t("thead",null,[t("tr",null,[t("th",null,"Name"),t("th",null,"Type"),t("th",null,"Default"),t("th",null,"Description")])],-1),I=t("tr",null,[t("td",null,[t("code",null,"mqttUrl")]),t("td",null,"String"),t("td",null,[t("code",null,"mqtt://localhost:1883")]),t("td",null,"Connection string for your MQTT broker.")],-1),N=t("tr",null,[t("td",null,[t("code",null,"mqttOptions")]),t("td",null,[t("a",{href:"#mqtt-options"},"MQTT Options")]),t("td"),t("td",null,"Additional options for the MQTT connection.")],-1),O=t("tr",null,[t("td",null,[t("code",null,"sendAttributes")]),t("td",null,"Boolean"),t("td",null,[t("code",null,"true")]),t("td",null,"Whether entity attributes should be forwarded to Home Assistant or not. May be disabled to reduce the number of messages that Home Assistant needs to process.")],-1),E=t("td",null,[t("code",null,"sendMqttRoom")],-1),C=t("td",null,"Boolean",-1),B=t("td",null,[t("code",null,"false")],-1),P=e("Whether entities with distances should publish them in the "),U={href:"https://www.home-assistant.io/integrations/mqtt_room/",target:"_blank",rel:"noopener noreferrer"},D=e("MQTT Room integration"),L=e(" format or not."),V=t("tr",null,[t("td",null,[t("code",null,"discoveryPrefix")]),t("td",null,"String"),t("td",null,[t("code",null,"homeassistant")]),t("td",null,"The prefix for the discovery topic that Home Assistant will watch.")],-1),W=t("td",null,[t("code",null,"mqttRoomPrefix")],-1),F=t("td",null,"String",-1),j=t("td",null,[t("code",null,"room-assistant/mqtt-room")],-1),z=e("The topic prefix that will be used for the "),K={href:"https://www.home-assistant.io/integrations/mqtt_room/",target:"_blank",rel:"noopener noreferrer"},Y=e("MQTT Room"),G=e(" messages, should match "),J=t("code",null,"state_topic",-1),X=e(" in Home Assistant."),Z=l(`<h3 id="mqtt-options" tabindex="-1"><a class="header-anchor" href="#mqtt-options" aria-hidden="true">#</a> MQTT Options</h3><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>username</code></td><td>String</td><td></td><td>Username for authentication</td></tr><tr><td><code>password</code></td><td>String</td><td></td><td>Password for authentication</td></tr><tr><td><code>rejectUnauthorized</code></td><td>Boolean</td><td><code>true</code></td><td>Whether MQTTS connections should fail for invalid certificates or not. Set this to <code>false</code> if you are using a self-signed certificate and connect via TLS.</td></tr></tbody></table><p>Some of these settings may also be configured as environment variables, using <code>RA_HOME_ASSISTANT_MQTT_URL</code>, <code>RA_HOME_ASSISTANT_MQTT_USERNAME</code> and <code>RA_HOME_ASSISTANT_MQTT_PASSWORD</code>.</p><details class="custom-container details"><summary>Example Config</summary><div class="language-yaml ext-yml line-numbers-mode"><pre class="language-yaml"><code><span class="token key atrule">global</span><span class="token punctuation">:</span>
  <span class="token key atrule">integrations</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> homeAssistant
<span class="token key atrule">homeAssistant</span><span class="token punctuation">:</span>
  <span class="token key atrule">mqttUrl</span><span class="token punctuation">:</span> mqtt<span class="token punctuation">:</span>//homeassistant.local<span class="token punctuation">:</span><span class="token number">1883</span>
  <span class="token key atrule">mqttOptions</span><span class="token punctuation">:</span>
    <span class="token key atrule">username</span><span class="token punctuation">:</span> youruser
    <span class="token key atrule">password</span><span class="token punctuation">:</span> yourpass
  <span class="token key atrule">discoveryPrefix</span><span class="token punctuation">:</span> homeassistant
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div></details>`,4);function $(tt,et){const s=o("ExternalLinkIcon");return a(),r(i,null,[u,h,t("p",null,[p,t("a",_,[m,n(s)]),f,t("a",b,[g,n(s)]),T]),k,y,t("p",null,[w,t("a",A,[S,n(s)]),q]),t("p",null,[M,t("a",v,[x,n(s)]),Q]),H,t("table",null,[R,t("tbody",null,[I,N,O,t("tr",null,[E,C,B,t("td",null,[P,t("a",U,[D,n(s)]),L])]),V,t("tr",null,[W,F,j,t("td",null,[z,t("a",K,[Y,n(s)]),G,J,X])])])]),Z],64)}var ot=d(c,[["render",$]]);export{ot as default};
