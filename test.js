const xrpl = require('xrpl');
(async () => {
  const client = new xrpl.Client(process.env.XRPL_WS || 'wss://s.altnet.rippletest.net:51233');
  await client.connect();
  const info = await client.request({ command: 'server_info' });
  console.log(info.result || info);
  await client.disconnect();
})();