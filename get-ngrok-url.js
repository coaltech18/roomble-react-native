const https = require('https');
const http = require('http');

function getNgrokUrl() {
  const options = {
    hostname: 'localhost',
    port: 4040,
    path: '/api/tunnels',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const tunnels = JSON.parse(data);
        if (tunnels.tunnels && tunnels.tunnels.length > 0) {
          const url = tunnels.tunnels[0].public_url;
          console.log('🌐 Ngrok URL:', url);
          console.log('📝 Copy this URL and run: node setup-ngrok.js ' + url);
        } else {
          console.log('❌ No tunnels found. Make sure ngrok is running with: ngrok http 4000');
        }
      } catch (error) {
        console.log('❌ Error parsing ngrok response:', error.message);
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ Cannot connect to ngrok API. Make sure ngrok is running with: ngrok http 4000');
    console.log('💡 If ngrok is running, try opening http://localhost:4040 in your browser to see the URL');
  });

  req.end();
}

getNgrokUrl();
