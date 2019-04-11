const WebSocket = require('ws');

const socket = new WebSocket('ws://localhost:3001');

socket.sendJson = obj => socket.send(JSON.stringify(obj));

socket.onopen = () => {
  console.log('Chat bot connected');
  socket.sendJson({
    type: 'postNotification',
    oldName: 'Anonymous',
    newName: 'ChattyBot'
  });
};

socket.onmessage = event => {
  console.log(event.data);
  const json = JSON.parse(event.data);

  if (json.type === 'incomingMessage') {
    handleIncomingMessage(json);
  }
};

const handleIncomingMessage = data => {
  const hiRegex = /^[hH](i|ello) ChattyBot/;
  const shrugRegex = /^\/shrug ?([\w ?.,\-!]*)$/;
  const shrugMatches = data.content.match(shrugRegex);
  console.log(shrugMatches);

  if (hiRegex.test(data.content)) {
    const message = {
      content: `Hello ${data.username}`,
      username: 'ChattyBot',
      color: '#4283f4',
      type: 'postMessage'
    };

    socket.sendJson(message);
  } else if (shrugMatches) {
    const capturedContent = shrugMatches[1];

    const message = {
      content: `¯\\_(ツ)_/¯ ${capturedContent}`,
      username: 'ChattyBot',
      color: '#4283f4',
      type: 'postMessage'
    };

    socket.sendJson(message);
  }
};
