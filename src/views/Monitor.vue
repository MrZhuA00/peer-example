<script setup name="Monitor">
import { Peer } from "peerjs";
import { ref } from "vue";

const videoEl = ref(null);

const peer = new Peer();

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
  conn.on("data", (data) => {
    // console.log("🚀 ~ data:", data);
    logMessage("I received: " + data);
  });
});

peer.on("call", (call) => {
  // console.log("🚀 ~ call:", call);
  // Answer the call with an A/V stream.
  call.answer();
  // navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
  //   call.answer(stream);
  //   // call.addStream(stream);
  // });
  call.on("open", () => {
    console.log("The call is opened.");
  });
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

const connectId = ref("");
var conn;
function connect() {
  conn = peer.connect(connectId.value);
  conn.on("open", () => {
    // console.log("🚀 ~ conn:", conn);
    logMessage("I connected to: " + conn.peer);
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
      <h2>monitor</h2>
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
