const { createCanvas } = require('canvas');

const width = 800;
const height = 600;

const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

ctx.fillStyle = '#000';
ctx.fillRect(0, 0, width, height);

ctx.setLineDash([10, 10]);
ctx.strokeStyle = '#333';
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(width / 2, 0);
ctx.lineTo(width / 2, height);
ctx.stroke();
ctx.setLineDash([]);

ctx.fillStyle = '#fff';
ctx.fillRect(10, height / 2 - 50, 12, 100);
ctx.fillRect(width - 22, height / 2 - 60, 12, 100);

ctx.beginPath();
ctx.arc(width / 2, height / 2, 10, 0, Math.PI * 2);
ctx.fill();

ctx.fillStyle = '#fff';
ctx.font = 'bold 64px Courier New';
ctx.textAlign = 'center';
ctx.fillText('0', width / 2 - 50, 80);
ctx.fillText('0', width / 2 + 50, 80);

const buffer = canvas.toBuffer('image/png');
require('fs').writeFileSync('screenshot.png', buffer);
console.log('Screenshot saved as screenshot.png');
