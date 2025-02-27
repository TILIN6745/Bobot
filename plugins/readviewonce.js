let { downloadContentFromMessage } = (await import('@whiskeysockets/baileys'))

let handler = async (m, { conn }) => {
let quoted = m.quoted
if (!quoted) return conn.reply(m.chat, `*Responde a un mensaje de una sola vez "ViewOnce" para ver su contenido.*`, m)

let viewOnceMessage = quoted.viewOnce ? quoted : quoted.mediaMessage?.imageMessage || quoted.mediaMessage?.videoMessage || quoted.mediaMessage?.audioMessage
console.log(viewOnceMessage)
if (!viewOnceMessage && !(quoted?.viewOnce || quoted?.mediaMessage?.imageMessage?.viewOnce || quoted?.mediaMessage?.videoMessage?.viewOnce || quoted?.mediaMessage?.audioMessage?.viewOnce)) return conn.reply(m.chat, `❌ No es un mensaje de imagen, video o audio ViewOnce.`, m)

let messageType = viewOnceMessage.mimetype || quoted.mtype
let stream = await downloadContentFromMessage(viewOnceMessage, messageType.split('/')[0])
    
if (!stream) return conn.reply(m.chat, `*❌ No se pudo descargar el contenido.*`, m)
  
let buffer = Buffer.from([])
for await (const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}

if (messageType.includes('video')) {
await conn.sendMessage(m.chat, { video: buffer, caption: viewOnceMessage.caption || '', mimetype: 'video/mp4' }, { quoted: m })

} else if (messageType.includes('image')) {
await conn.sendMessage(m.chat, { image: buffer, caption: viewOnceMessage.caption || '' }, { quoted: m })

} else if (messageType.includes('audio')) {
await conn.sendMessage(m.chat, { audio: buffer, mimetype: 'audio/ogg; codecs=opus', ptt: viewOnceMessage.ptt || false }, { quoted: m })

} else {
return conn.reply(m.chat, `❌ No es un mensaje de imagen, video o audio ViewOnce.`, m)
}}

handler.command = ['readviewonce', 'read', 'viewonce', 'ver'];
handler.register = true;

export default handler;
