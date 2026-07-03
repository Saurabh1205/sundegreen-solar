const http = require('http')
const data = JSON.stringify({ name: 'Test User', whatsapp: '9999999999', pincode: '400001', bill: 'Less than ₹1500' })
const options = {
  hostname: 'localhost',
  port: 3005,
  path: '/api/consultation',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}

const req = http.request(options, res => {
  let body = ''
  res.on('data', chunk => body += chunk)
  res.on('end', () => {
    console.log('STATUS', res.statusCode)
    console.log('BODY', body)
  })
})
req.on('error', err => console.error(err))
req.write(data)
req.end()
