<script setup name="BeMonitored">
import { Peer } from "peerjs";
import { ref } from "vue";

const peer = new Peer();

const videoEl = ref(null);

peer.on("open", (id) => {
  // console.log("🚀 ~ id:", id);
  logMessage("My peer ID is: " + id);
});
peer.on("error", (error) => {
  // console.log("🚀 ~ error:", error);
  logMessage("My peer has a error: " + error);
});
peer.on("connection", (conn) => {
  // console.log("🚀 ~ conn:", conn);
  logMessage("incoming peer connection!");
  conn.addListener("data", (data) => {
    // console.log("🚀 ~ data:", data);
    logMessage("I received: " + data);
  });
});

const connectId = ref();
var conn;
function connect() {
  conn = peer.connect(connectId.value);
  conn.on("open", () => {
    // console.log("🚀 ~ conn:", conn);
    logMessage("I connected to: " + conn.peer);
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
          },
        },
      })
      .then((stream) => {
        logMessage("use navigator.mediaDevices.getUserMedia");
        const call = peer.call(connectId.value, stream);

        call.on("stream", (remoteStream) => {
          // Show stream in some <video> element.
          videoEl.value.srcObject = remoteStream;
        });
        call.on("close", () => {
          console.log("The call is closed.");
        });
        call.on("error", (error) => {
          console.log("The call has an error:", error);
        });
      })
      .catch((error) => {
        // console.log("🚀 ~ error:", error);
        logMessage("Use navigator.mediaDevices.getDisplayMedia");
        navigator.mediaDevices
          .getDisplayMedia({ video: true })
          .then((stream) => {
            const call = peer.call(connectId.value, stream);
            call.on("stream", (remoteStream) => {
              // Show stream in some <video> element.
              videoEl.value.srcObject = remoteStream;
            });
            call.on("close", () => {
              console.log("The call is closed.");
            });
            call.on("error", (error) => {
              console.log("The call has an error:", error);
            });
          });
      });
  });
}

const msg = ref("");
function send(params) {
  conn.send(params);
  logMessage("I send: " + params);
}

const messageEl = ref(null);
function logMessage(message) {
  // console.log("🚀 ~ message:", message);
  let newMessage = document.createElement("div");
  newMessage.innerText = message;
  messageEl.value.appendChild(newMessage);
}
</script>

<template>
  <body>
    <div>
      <h2>Be monitored</h2>
      <div class="form">
        <input type="text" v-model="connectId" />
        <button @click="connect">connect</button>
      </div>
      <div class="form">
        <input type="text" v-model="msg" />
        <button @click="send(msg)">send</button>
      </div>
      <div ref="messageEl" class="messageEl"></div>
    </div>
    <video ref="videoEl" autoplay controls></video>
  </body>
</template>

<style scoped lang="scss">
body {
  display: flex;
  flex-direction: row;
}
video {
  width: calc(100vw * 0.5);
  height: calc(100vh * 0.5);
}
.messageEl {
  width: 500px;
}
.form {
  width: 300px;
  margin: 5px;
  input {
    width: 200px;
  }
  button {
    width: 80px;
    margin-left: 5px;
  }
}
</style>
