const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.get('/', function(request, response) {
	response.sendFile(__dirname + '/views/index.html');
});
app.listen(3000, () => console.log(`INICIALIZANDO \n`));


const Discord = require("discord.js");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"] });
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { join } = require('node:path');



// ---------------Array de audios ---------------
let audios = new Array(
	'./audios/discordCall.mp3',
	'./audios/notificacionSaturada.mp3',
	'./audios/oof.mp3',
	'./audios/pablo.mp3',
	'./audios/queMeTirasCubilla.ogg',
	'./audios/Whyareyougae.mp3'
);


// ---------------Personalizacion y Constantes ---------------

const prefix = '/';
let saturado = false;
const delay = ms => new Promise(res => setTimeout(res, ms));
const delayMinimoDefault = 500;
const delayMaximoDefault = 10800;
const minimoDelayAceptable = 60;
const maximoDelayAceptable = 50000;
delayMinimo = delayMinimoDefault;
delayMaximo = delayMaximoDefault;




client.on("ready", () => {
	client.user.setActivity("Volvi paaaaaaa", {
		type: "PLAYING"
	});
	console.log("-----------------------------------");
	console.log("Listo para trabajar");
	console.log("-----------------------------------\n");
	funcionamientoTotal();
});

const mySecret = process.env['TOKEN']
client.login(mySecret);

// ---------------Manejo de mensajes ---------------

client.on("messageCreate", message => {
	console.log("Mensaje Recibido");
	prefijo = message.content[0];
	if (prefijo != prefix) {
		return;
	}
	recibirComando(message);
	return;
});

function recibirComando(message) {
	console.log("Procesando Comando")
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	if (!command) {
		return;
	}
	else if (command === 'hola') {
		message.channel.send('Hola La Granja!');
		return;
	}
	else if (command === 'comandos') {
		message.channel.send('**Los comandos son los siguientes:**');
		message.channel.send('\n */hola* - El bot te saluda \n\n */setup min max* - setea los tiempos minimos y maximos de intervalos de conexión. El minimo es ' + delayMinimo + ' y el maximo ' + delayMaximo + ' \n\n */saturado* - Los audios se escucharan saturados \n\n */normal* - Los audios se escucharan en su volumen predeterminado\n \n **La Granjaa**')
		return;
	}
	else if (command === 'setup') {
		if (args[0] && args[1]) {
			cambiarMinimo(args[0], message);
			cambiarMaximo(args[1], message);
			message.channel.send('Minimo Actual: ' + delayMinimo + ' Segundos');
			message.channel.send('Maximo Actual: ' + delayMaximo + ' Segundos');
			console.log(delayMinimo + " " + delayMaximo)
			return;
		}
		message.channel.send('Debes Poner El Comando Completo');
	}
	else if (command === 'test') {
		conectarse(1);
		return;
	}
	else if (command === 'saturado') {
		saturado = true;
		message.channel.send('Audio Saturado');
		return;
	}
	else if (command === 'normal') {
		saturado = false;
		message.channel.send('Audio Normal');
		return;
	}
}


function cambiarMinimo(valor, message) {
	valorObtenido = Number(valor);
	if (valorObtenido) {
		if (valorObtenido < minimoDelayAceptable) {
			message.channel.send('El Valor Minimo Es' + minimoDelayAceptable);
			return;
		}
		delayMinimo = valorObtenido;
	}
}

function cambiarMaximo(valor, message) {
	valorObtenido = Number(valor);
	if (valorObtenido) {
		if (valorObtenido > (maximoDelayAceptable) || valorObtenido <= delayMinimo) {
			message.channel.send('El Valor Maximo No Es Valido');
			return;
		}
		delayMaximo = valorObtenido;
	}
}

// ---------------FUNCIONAMIENTO PLENO ---------------

function conectarse(valor) {

	let voiceChannel = client.channels.cache.filter(ch => ch.type === "GUILD_VOICE" && ch.members.size != 0).random()
	if (!voiceChannel) {
		console.log('No Hay Canales Disponibles');
		return;
	}
	console.log("Conectado al canal: " + voiceChannel.name)
	const player = createAudioPlayer();
	const resource = createAudioResource(audios[valor]);
	if(saturado === true){
			resource.volume.setVolume(8.0);
			console.log("Audio Saturado Activado");
	}
	
	const connection = joinVoiceChannel({
		channelId: voiceChannel.id,
		guildId: voiceChannel.guild.id,
		adapterCreator: voiceChannel.guild.voiceAdapterCreator,
	});
	const subscription = connection.subscribe(player);
	console.log("-----Conectado al canal-----");
	console.log(voiceChannel.name);

	player.play(resource);

	console.log("Reproduciendo: " + audios[valor]);
	player.on(AudioPlayerStatus.Idle, () => {
		player.stop();
		connection.destroy()
		console.log("--------Desconectado--------\n");
	});

}
function funcionar() {
	var valor = Math.floor(Math.random() * audios.length);
	console.log("Valor random: " + valor);
	conectarse(valor);
}

async function funcionamientoTotal() {
	await delay(125000)
	console.log("Cantidad de audios: " + audios.length);

	while (true) {
		funcionar();
		var tiempo = Math.floor(Math.random() * (delayMaximo - delayMinimo)) + 650
		console.log("Tiempo a esperar: " + tiempo + " Segundos");
		await delay(tiempo * 1000); // Pasando tiempo a milisegundos
		

	}
}